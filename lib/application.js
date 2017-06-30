var express       = require('express'),
    http          = require('http'),
    os            = require('os'),
    noop          = function () {};

module.exports = createApplication;

function createApplication (config) {
  var tunnel      = require('./tunnel'),
      water       = require('./water'),
      setting     = require('./setting'),
      store       = require('./store'),
      plugins     = require('./plugins'),
      forger      = require('./forger'),
      httpServer  = http.createServer(),
      app         = express();

  // 建立代理服务器
  httpServer.on('request', function (req, res) {
    app(req, res);
  });

  httpServer.on('connect', function (req, soc, head) {
    water.run([req, soc, head, app], function () {
      tunnel(req, soc, head, app);
    });
  });

  app.httpServer  = httpServer;
  app.setting     = setting;
  app.plugins     = plugins;
  app.store       = store;
  app.water       = water;
  app.listen      = listen;
  app.forger      = forger;
  app.coder       = coder;
  app.ip          = network();

  // local
  app.local = function local (urlParsed) {
    var ip          = app.ip,
        port        = parseInt(urlParsed.port),
        proxyNumber = setting.get('proxy-port-number'),
        hostname    = urlParsed.hostname;

    return (
      hostname === setting.get('hostname') ||
      hostname === '127.0.0.1' && port === proxyNumber ||
      hostname === ip && port === proxyNumber
    );
  }

  // api code table
  app.code = function (namespace, range) {
    var record  = app.get('code record'),
        refs;

    if (!record) {
      app.set('code record', record = {
        point: 1000,
        list: {}
      });
    }

    if (namespace in record.list) {
      throw 'The namespace was already existed.';
    } else {
      record.list[namespace] = {
        start: record.point + 1,
        end: record.point + range,
        table: {}
      };
    }

    refs = record.list[namespace];
    
    return function (code, message, text) {
      if (code in refs.table) {
        return refs.table[code];
      }

      return refs.table[code] = {
        code: code,
        message: message,
        text: text
      };
    }
  }

  // express middleware fix body parser ,if content-type last char contain ';'
  app.use(function (req, res, next) {
    var headers = req.headers,
        type    = headers['content-type'] || headers['Content-Type'] || '',
        index   = type.indexOf(';'),
        value   = value = type.slice(0, type.length - 1);

    if (index === type.length - 1) {
      headers['content-type'] ?
         headers['content-type'] = value : headers['Content-Type'] = value;
    }

    next();
  });

  // 内置插件
  app.plugins(require('./plugins/plugin-socket'));
  app.plugins(require('./plugins/plugin-url-formatter'));
  app.plugins(require('./plugins/plugin-ui'));
  app.plugins(require('./plugins/plugin-ssl'));
  app.plugins(require('./plugins/plugin-simulator'));
  app.plugins(require('./plugins/plugin-host'));
  app.plugins(require('./plugins/plugin-requester'));
  app.plugins(require('./plugins/plugin-server-error'));

  return app;
}

function coder (key, range) {
  var coderTable    = this.get('coder table'),
      coderInstance;

  range = range.sort();

  if (!coderTable) {
    this.set('coder table', coderTable = {
      range: [],
      namespace: {}
    });
  }
  

  if (!range.some(function (number) {
    var list,
        index,
        message;

    message = range + ' ' + number + ' was already existed.';

    if (coderTable.range.ndexOf(number) > -1) {
      throw message;
    }

    list = coderTable.range.slice();
    list.push(number).sort();

    index = list.indexOf(number);

    if (!(index === 0 || index === list.length - 1)) {
      throw message;
    }
  })) {
    coderTable.range                = coderTable.range.concat(range);
    coderTable.namespace[namespace] = range; 
  }

  coderInstance = {
    get: function (code, data, message) {
      if ( code > range[0] && code < range[1] ) {
        
      }
    },
    set: function () {}
  };

  return coderInstance;
}

function listen (port) {
  port = port || configure.get('proxy-port-number');

  this.httpServer.listen.apply(this.httpServer, arguments);
}

// 获取本机ip
function network () {
  var ni    = os.networkInterfaces(),
      keys  = Object.keys(ni),
      local = '127.0.0.1',
      handle,
      ip;

  handle = function (n) {
    var family  = (n.family || '').toLowerCase(),
        address = n.address;

    if (family == 'ipv4') {
      if (!(address == local)) {
        return ip = address;
      }
    }
  }

  keys.some(function (name) {
    var ls = ni[name] || [];

    if (ls.length > 0) {
      return ls.some(handle);
    }
  });

  return ip || local;
}

