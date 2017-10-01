const forge     = require('node-forge');
const Router    = require('koa-router');
const fs        = require('fs-extra-promise');
const fullName  = require('./fullName');
const shortName = require('./shortName');
const config    = require('./config');
const pki       = forge.pki;

const type = {
  ROOT   : 'root',
  VIRTUAL: 'virtual'
}

module.exports = async function (app, options) {  
  const { nedb } = app;
  const store    = nedb('forger');
  const router   = Router();
  const name     = await app.get('name');


  router.get(`/${name}.crt`, async (ctx) => {
    ctx.type = 'application/x-x509-ca-cert';
    ctx.body = forger.pem.publicPem;
  });

  app.use(router.routes());

  config.attributes = [
    {
      value        : name,
      shortName    : 'OU',
      valueTagClass: 12
    },
    {
      name         : 'organizationName',
      value        : `Created by ${name}`,
      valueTagClass: 12
    }
  ];

  const forger = {
    async get (hostname) {
      const res = await store.findOne({
        type : type.VIRTUAL,
        dnses: [ hostname ]
      });

      if (res) {
        return {
          publicPem : res.publicPem,
          privatePem: res.privatePem
        };
      }
    },

    async forge (model, altname, hostname) {
      let res = await this.get(hostname);

      if (res) {
        return res;
      }

      const cert = this.create({
        attributes: [
          { name: 'commonName',value: name, valueTagClass: 12}
        ].concat(config.attributes),
        subject: this.getSubject(model.subject),
        extensions: config.commonExtensions.concat(config.forgeCommonExtensions, {
          name:     'subjectAltName',
          altNames: altname.map(function(host){
            if (typeof host == 'string') {
              return { type:   2, value:  host };
            }
  
            return host;
          })
        }),
        serial: model.serial || this.now()
      });

      const pem = {
        publicPem:  this.toPem(cert),
        privatePem: this.pem.privatePem
      };

      await store.insert({
        type             :  type.VIRTUAL,
        dnses            :  altname.map(alt => typeof alt == 'object' ? alt.value : alt),
        publicPem        :  pem.publicPem,
        lastModify       :  + this.now()
      });

      return pem;
    },

    getSubject (subjects) {
      const keys  = Object.getOwnPropertyNames(subjects);
      const short = shortName;
      const full  = fullName;
    
      return keys.map(function(key){
        const inShort = key in short;
        const inFull  = key in full;
        const valueTagClass = 12;
  
        if (inShort || inFull) {
          let value = subjects[key];
          let subject;
  
          if (!(typeof value == 'string')) {
            value = '__empty_value__';
          }
  
          subject = { value, valueTagClass };
          
          inShort ?
            subject.shortName = key : subject.name = full[key];
  
          return subject;
        }
      }).filter(subject => subject);
    },

    toPem (object) {
      try {
        return pki.certificateToPem(object);
      } catch (e) {
        return pki.privateKeyToPem(object);
      }
    },

    fromPem (object) {
      try {
        return pki.certificateFromPem(object);
      } catch (e) {
        return pki.privateKeyFromPem(object);
      }
    },

    now () {
      return new Date();
    },

    after () {
      const now = this.now();
      
      now.setFullYear(now.getFullYear() + 10);
      
      return now;
    },

    create (options) {
      const cert = pki.createCertificate();
      const rsa  = this.rsa;

      options = options || {};

      cert.serialNumber        = String(options.serial);
      cert.validity.notBefore  = this.now();
      cert.validity.notAfter   = this.after();
    
      cert.setSubject(options.subject);
      cert.setIssuer(options.attributes);
    
      cert.publicKey = rsa.publicKey;
    
      cert.setExtensions(options.extensions);
      cert.sign(rsa.privateKey, forge.md.sha256.create());
    
      return cert;
    }
  }

  // get root certificate
  let res = await store.findOne({
    type: type.ROOT
  });

  if (res === null) {
    const rsa = pki.rsa.generateKeyPair(config.size);

    forger.rsa = rsa;

    const attr = [
      { name: 'commonName',value: name, valueTagClass: 12 }
    ].concat(config.attributes);

    const cert = forger.create({
      attributes: attr,
      subject   : attr,
      extensions: [
        { name  : 'basicConstraints', critical: true, cA         : true },
        { name  : 'keyUsage', critical        : true, keyCertSign: true}
      ].concat(config.commonExtensions),
      serial    : new Date()
    }); 

    const pem = forger.pem = {
      publicPem: forger.toPem(cert),
      privatePem: forger.toPem(rsa.privateKey)
    };

    await store.insert({
      type: type.ROOT,
      pem
    });
  } else {
    forger.pem = res.pem;

    forger.rsa = {
      publicKey : forger.fromPem(res.pem.publicPem).publicKey,
      privateKey: forger.fromPem(res.pem.privatePem)
    };
  }

  app.forger = {
    async set (...args) {
      return await forger.forge.apply(forger, args);
    },

    async get (...args) {
      return await forger.get.apply(forger, args);
    }
  }
}

