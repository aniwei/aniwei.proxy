var express     = require('express'),
    http        = require('http'),
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
      app         = express();

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

  app.use(components(store, configure, app));

  return app;
}

function listen (port) {
  port = port || configure.get('proxy-port-number');

  this.httpServer.listen.apply(this.httpServer, arguments);
}
