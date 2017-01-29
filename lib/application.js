var express     = require('express'),
    http        = require('http'),
    tunnel      = require('./tunnel'),
    waterfall   = require('./waterfall'),
    configure   = require('./configure'),
    store       = require('./store'),
    noop        = function () {};

module.exports = createApplication;

function createApplication (config) {
  var app         = express(),
      httpServer  = http.createServer();

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

  // 设置配置信息
  app.set('configure', configure);
  app.set('store', store);
  app.set('waterfall', waterfall);

  // 重写监听函数
  app.listen = function (port) {
    port = port || configure.get('proxy-port-number');

    httpServer.listen.apply(httpServer, arguments);
  }

  return app;
}
