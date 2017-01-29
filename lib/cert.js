var fs      = require('fs'),
    forge   = require('node-forge'),
    assign  = require('lodash').assign,
    pinyin  = require('pinyin'),
    pki     = forge.pki,
    shortName,
    fullName,
    proto,
    builder;

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



builder = {
  init:   function (defaults) {
    assign(this, defaults);

    if (this.exist()) {
      return this.read();
    }

    this.key  = pki.rsa.generateKeyPair(this.size);
    this.write();
  },
  exist:  function () {
    if (fs.existsSync(this.keyPath)) {
      if (fs.existsSync(this.certPath)) {
        return true;
      }
    }

    return false;
  },
  now:    function () { return new Date },
  after:  function () {
    var now = this.now();

    now.setFullYear(now.getFullYear() + 1);

    return now;
  },
  publicToPem: function (cert) {
    return pki.certificateToPem(cert)
  },
  toPem: function (cert, key) {
    return {
      cert: pki.certificateToPem(cert),
      key:  pki.privateKeyToPem(key)
    }
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
  read: function () {
    var key = fs.readFileSync(this.keyPath).toString(),
        from;

    this.pemCert = fs.readFileSync(this.certPath).toString();
    this.pemKey  = key;

    from = this.fromPem(this.pemCert, this.pemKey);

    assign(this, from);
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
            value = 'anonymous';
          }

          value = pinyin(value, {
            style: pinyin.STYLE_NORMAL,
            heteronym: true
          }).join('');

          res = {
            value: value || 'anonymous'
          }

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
        if (!sub) {
          return false
        }

        return sub
      })
    }
  },
  altname: function (subjectAltName) {
    var altname,
        dns    = [],
        alts   = [],
        signal = 'DNS:',
        subject;

    subjectAltName = subjectAltName || '';
    subject        = subjectAltName.split(',');

    altname = subject.filter(function(alt){
      if(alt.indexOf(signal) > -1){
        return true
      }
    }).map(function(alt){
      var alt = alt.replace(signal, '').trim()

      return {
        type:   2,
        value:  alt
      }
    });

    if (altname.length > 0) {
      return [{
        name:     'subjectAltName',
        altNames: altname,
      }]
    }
  },
  write: function () {
    var attr      = [{ name: 'commonName',value: 'aniwei.tech'}].concat(this.attributes),
        extens    = [
          { name: 'basicConstraints', critical: true, cA: true },
          { name: 'keyUsage', critical: true, keyCertSign: true}
        ].concat(this.commonExtensions),
        pem;

    this.cert    = this.make(attr, attr, extens, this.now());
    this.pemKey  = pki.privateKeyToPem(this.key.privateKey);
    this.pemCert = pki.certificateToPem(this.cert);

    fs.writeFileSync(this.keyPath, this.pemKey);
    fs.writeFileSync(this.certPath, this.pemCert);
  },
  make: function (attr, subject, extens, serial) {
    var cert = pki.createCertificate();

    cert.serialNumber        = String(serial);
    cert.validity.notBefore  = this.now();
    cert.validity.notAfter   = this.after();

    cert.setSubject(attr);
    cert.setIssuer(subject);

    cert.publicKey = this.key.publicKey;

    cert.setExtensions(extens);
    cert.sign(this.key.privateKey, forge.md.sha256.create());

    return cert;
  }
}

module.exports = function () {

}

proto = module.exports = function () {
  var defaults = this.config('certificate'),
      isArray  = Array.isArray;

  function proxy (model, hostname, alt) {
    var attr,
        altname,
        subject,
        extens,
        cert,
        hosts;

    if (alt) {
      if (!isArray(alt)) {
        alt = [alt];
      }

      hosts = alt.concat(hostname);
    } else {
      hosts = [hostname];
    }

    // if (model.subject) {
    //   debugger
    //   var asn = forge.asn1.fromDer(model.raw.toString('binary'))
    //
    //   debugger;
    //
    //   try {
    //       asn = forge.pki.certificateFromAsn1(asn);
    //   } catch (e) {
    //     debugger;
    //   }
    // }


    attr    = [{ name: 'commonName',value: 'aniwei.tech'}].concat(defaults.attributes);
    altname = builder.altname(model.subjectaltname) || [{
      name:     'subjectAltName',
      altNames: hosts.map(function(host){
        return { type:   2, value:  host }
      })
    }];
    subject = builder.subject(model.subject || {}) || [{
      name: 'commonName',
      value: hostname
    }].concat(defaults.attributes),
    extens  = defaults.commonExtensions.concat(defaults.forgeCommonExtensions, altname),
    cert;

    return builder.make(subject, attr, extens, model.serialNumber || builder.now());
  }

  builder.init(defaults);

  proxy.__proto__ = builder;

  return proxy;
};


function init () {

}

