var express     = require('express'),
    http        = require('http'),
    os          = require('os'),
    noop        = function () {};

module.exports = createApplication;

function createApplication (config) {
  var tunnel      = require('./tunnel'),
      waterfall   = require('./waterfall'),
      configure   = require('./configure'),
      store       = require('./store'),
      components  = require('./components'),
      certificate = require('./certificate'),
      httpServer  = http.createServer(),
      app         = express(),
      ip          = network();

  // 建立代理服务器
  httpServer.on('request', function (req, res) {
    app(req, res);
  });

  httpServer.on('connect', function (req, soc, head) {
    waterfall.run([req, soc, head, app], function () {
      tunnel(req, soc, head, app);
    });
  });

  app.httpServer = httpServer;

  app.configure   = configure;
  app.store       = store;
  app.waterfall   = waterfall;
  app.listen      = listen;
  app.certificate = certificate;
  app.ip          = ip;

  app.store.set('socket', {
    uri: 'ws://' + ip + ':' + configure.get('proxy-port-number').value
  }, true);
  
  app.use(components(store, configure, app));

  return app;
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
