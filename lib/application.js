var express       = require('express'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
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
      app         = express(),
      ip          = network();

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

  // express middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // 内置插件
  app.plugins(require('./plugins/plugin-socket'));
  app.plugins(require('./plugins/plugin-url-formatter'));
  app.plugins(require('./plugins/plugin-ui'));
  app.plugins(require('./plugins/plugin-host'));
  app.plugins(require('./plugins/plugin-ssl'));
  app.plugins(require('./plugins/plugin-requester'));
  app.plugins(require('./plugins/plugin-server-error'));

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
