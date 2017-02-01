var fs            = require('fs'),
    home          = require('user-home'),
    path          = require('path'),
    plist         = require('plist'),
    assign        = require('lodash').assign,
    forge         = require('node-forge'),
    json          = require('../package.json'),
    configure     = require('./configure'),
    config        = configure.get('certificate-configure').value,
    slice         = [].slice,
    pki           = forge.pki,
    meta          = json.meta;

shortName = {
  'C' : 'countryName',
  'CN' : 'commonName',
  'ST' : 'stateOrProvinceName',
  'L' : 'localityName',
  'O' : 'organizationName',
  'OU' : 'organizationalUnitName'
}

fullName = {
  'countryName' : 'C',
  'commonName' : 'CN',
  'stateOrProvinceName' : 'ST',
  'localityName' : 'L',
  'organizationName' : 'O',
  'organizationalUnitName' : 'OU'
}

module.exports = {
  get: function get (key) {
    var argv = slice.call(arguments),
        res;

    if (argv.length > 1) {
      res = {};

      argv.forEach((function (key) {
        res[key] = this.get(key);
      }).bind(this));
    } else {
      return this.table[key];
    }

    return res;
  },
  set: function set (key, value) {
    var store,
        object;

    if (Array.isArray(key)) {
      return key.forEach((function (setter) {
        this.set(setter);
      }).bind(this));
    }

    this.table[key] = value;

    this.save();

    return this;
  },

  save: function save() {
    var timer,
        path      = filePath();

    this.save = function () {
      var table = this.table;

      clearTimeout(timer);

      timer = setTimeout((function () {
        fs.writeFileSync(path, plist.build(table));
      }).bind(this), 200);
    }

    this.save();
  },

  exists: function (hostname) {
    var forgeries = this.get('forgeries'),
        cert;

    if (forgeries) {
      forgeries.some(function (forge) {
        return forge.dns.indexOf(hostname) > -1 ? cert = forge.cert : false
      });
    }
    

    if (cert) {
      cert['last-modify'] = new Date();

      this.set('forgeries', forgeries);

      return {
        cert: cert,
        key:  this.privatePem
      }
    }
  },

  now: function () {
    return new Date();
  },

  after: function () {
    var now = this.now();

    now.setFullYear(now.getFullYear() + 10);

    return now;
  },

  subject: function (subject) {
    var keys  = Object.keys(subject),
        short = shortName,
        full  = fullName

    if(keys.length > 0) {
      return keys.map(function(key){
        var inShort = key in short,
            inFull  = key in full,
            value,
            res;

        if (inShort || inFull) {
          value = subject[key];

          if (!(typeof value == 'string')) {
            value = '__empty_value__';
          }

          res = {
            value: value,
            valueTagClass: 12
          };

          if (inShort) {
            res.shortName = key;
          } else {
            if (inFull) {
              res.name     = full[key];
            }
          }

          return res;
        }
      }).filter(function(sub){
        return sub;
      })
    }
  },

  forge: function (model, altname, hostname) {
    var data,
        forgeries = this.get('forgeries');

    if (!forgeries) {
      this.set('forgeries', forgeries = []);
    }
    
    data = this.toPem(this.create({
      attributes: [{ name: 'commonName',value: 'aniwei.tech', valueTagClass: 12}].concat(config.attributes),
      subject: this.subject(model.subject),
      extensions: config.commonExtensions.concat(config.forgeCommonExtensions, {
        name:     'subjectAltName',
        altNames: altname.map(function(host){
          return { type:   2, value:  host }
        })
      }),
      serial: model.serial || this.now()
    }));

    if (!this.exists(hostname)) {
      forgeries.push({
        'dns':          altname,
        'cert':         data.cert,
        'last-modify':  + new Date()
      });

      this.set('forgeries', forgeries);
    }

    return data.cert;
  },

  toPem: function (cert, key) {
    var res = {};

    if (cert) {
      res.cert = pki.certificateToPem(cert); 
    }

    if (key) {
      res.key = pki.privateKeyToPem(key);
    }

    return res;
  },

  fromPem: function (cert, key) {
    var cert = pki.certificateFromPem(cert);

    return {
      cert: cert,
      key:  {
        privateKey: pki.privateKeyFromPem(key),
        publicKey:  cert.publicKey
      }
    }
  },

  create: function (options) {
    var cert = pki.createCertificate();
    
    options = options || {};

    cert.serialNumber        = String(options.serial);
    cert.validity.notBefore  = this.now();
    cert.validity.notAfter   = this.after();

    cert.setSubject(options.subject);
    cert.setIssuer(options.attributes);

    cert.publicKey = this.publicKey;

    cert.setExtensions(options.extensions);
    cert.sign(this.privateKey, forge.md.sha256.create());

    return cert;
  },

  root: function () {
    var cert,
        config = configure.get('certificate-configure').value,
        attr      = [
          { name: 'commonName',value: 'aniwei.tech', valueTagClass: 12 }
        ].concat(config.attributes);

    return this.create({
      attributes: attr,
      subject:    attr,
      extensions: [
        { name: 'basicConstraints', critical: true, cA: true },
        { name: 'keyUsage', critical: true, keyCertSign: true}
      ].concat(config.commonExtensions),
      serial:     this.now()
    });
  }
}

function filePath () {
  var fileName = meta['certificate-plist-file'],
      filePath = meta['cache-path'],
      root     = path.join(home, filePath);

  return path.join(root, fileName);
}

function init () {
  var path      = filePath(),
      config    = configure.get('certificate-configure'),
      cert,
      key,
      object,
      pem,
      fileString,
      fileJSON;

  isExist     = fs.existsSync(path);

  if (!isExist) {
    fs.writeFileSync(path,plist.build(fileJSON = {}));
  } else {
    try {
      fileString  = fs.readFileSync(path).toString();

      if (fileString) {
        fileJSON    = plist.parse(fileString);
      }
    } catch (e) {
      fileJSON = {};
    }

    fileJSON = fileJSON || {};
  }

  this.table = fileJSON;

  if (fileJSON.root) {
    pem    = this.get('root');
    object = this.fromPem(pem.cert, pem.key).key;

    this.publicKey  = object.publicKey;
    this.privateKey = object.privateKey;

    this.publicPem  = pem.cert; 
    this.privatePem = pem.key;
  } else {
    key  = pki.rsa.generateKeyPair(config.size);

    object = {
      cert: key.publicKey,
      key:  key.privateKey
    };

    this.publicKey  = key.publicKey;
    this.privateKey = key.privateKey;

    cert = this.root();

    this.publicPem  = cert; 
    this.privatePem = key;

    pem    = this.toPem(cert, object.key);

    this.set('root', pem);
  }

  console.log(this.publicPem);

}

init.bind(module.exports)();