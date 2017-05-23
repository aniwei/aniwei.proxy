var fs            = require('fs'),
    path          = require('path'),
    assign        = require('lodash').assign,
    forge         = require('node-forge'),
    settings      = require('./setting'),
    constants     = require('./helpers').constants,
    reader        = require('./helpers').reader,
    writer        = require('./helpers').writer,
    config        = settings.get('certificate'),
    slice         = [].slice,
    pki           = forge.pki,
    shortName,
    fullName;

shortName = {
  'C'  : 'countryName',
  'CN' : 'commonName',
  'ST' : 'stateOrProvinceName',
  'L'  : 'localityName',
  'O'  : 'organizationName',
  'OU' : 'organizationalUnitName'
}

fullName = {
  'countryName'             : 'C',
  'commonName'              : 'CN',
  'stateOrProvinceName'     : 'ST',
  'localityName'            : 'L',
  'organizationName'        : 'O',
  'organizationalUnitName'  : 'OU'
}

var exports = {};

exports.filename = '.certificaterc';

exports.get = function get (key) {
  var argv = slice.call(arguments),
      res;

  if (argv.length > 1) {
    res = {};

    argv.forEach((function (key) {
      res[key] = this.get(key);
    }).bind(this));
  } else {
    return this.json[key];
  }

  return res;
}

exports.set = function set (key, value) {
  var store,
      object;

  if (Array.isArray(key)) {
    return key.forEach((function (setter) {
      this.set(setter);
    }).bind(this));
  }

  this.json[key] = value;

  this.write();

  return this;
}

exports.write = function write() {
  var timer,
      file = path.join(constants.path, this.filename);

  this.write = function () {
    var json = this.json;

    clearTimeout(timer);

    timer = setTimeout((function () {
      fs.writeFileSync(file, JSON.stringify(json, null, 2));
    }).bind(this), 200);
  }

  this.write();
}

exports.exists = function (hostname) {
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
}

exports.subject = function (subject) {
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
}

exports.forge = function (model, altname, hostname) {
  var data,
      forgeries = this.get('forgeries'),
      exists;

  model = model || {};

  if (!forgeries) {
    this.set('forgeries', forgeries = []);
  }

  exists = this.exists(hostname);

  if (!exists) {
    data = this.toPem(this.create({
      attributes: [{ name: 'commonName',value: 'aniwei.tech', valueTagClass: 12}].concat(config.attributes),
      subject: this.subject(model.subject),
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
    }));

    forgeries.push({
      'dns': altname.map(function (host) {
        if (typeof host == 'object') {
          return host.value;
        }

        return host;
      }),
      'cert':         data.cert,
      'last-modify':  + new Date()
    });

    data.key = this.privatePem;

    this.set('forgeries', forgeries);
  } else {
    data = exists;
  }

  return data;
}

exports.toPem = function (cert, key) {
  var res = {};

  if (cert) {
    res.cert = pki.certificateToPem(cert); 
  }

  if (key) {
    res.key = pki.privateKeyToPem(key);
  }

  return res;
},

exports.fromPem = function (cert, key) {
  var cert = pki.certificateFromPem(cert);

  return {
    cert: cert,
    key:  {
      privateKey: pki.privateKeyFromPem(key),
      publicKey:  cert.publicKey
    }
  }
}

exports.default = function () {
  var file = path.join(constants.path, this.filename),
      json;

  if (fs.existsSync(file)) {
    json = reader(file);
  } else {
    writer(file, JSON.stringify(json = {}, null, 2));
  }

  this.json = json;

  if (json.root) {
    pem    = this.get('root');
    object = this.fromPem(pem.cert, pem.key).key;

    // 用于伪造证书
    this.publicKey  = object.publicKey;
    this.privateKey = object.privateKey;

    // 用于启动服务
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
}

exports.now = function () {
  return new Date();
}

exports.after = function () {
  var now = this.now();

  now.setFullYear(now.getFullYear() + 10);

  return now;
}

exports.create = function (options) {
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
};

// 创建根证书
exports.root = function () {
  var cert,
      config  = settings.get('certificate'),
      attr    = [
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


Object.defineProperty(module, 'exports', {
  get: function () {
    if (!exports.json) {
      exports.default();
    }

    return exports;
  }
});