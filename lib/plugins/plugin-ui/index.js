var urlParser     = require('url'),
    express       = require('express'),
    assign        = require('lodash').assign,
    server        = require('./server'),
    noop          = function () {};

module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('ui'),
      router  = express.Router(),
      app     = plugin.application,
      setting = app.setting,
      socket;

  plugin.defaultSettings = {};

  plugin.description = {
    text: '用户界面'
  };

  plugin.router = router;  
  plugin.socket = socket = new app.Socket('ui');

  server.store   = app.store;
  server.setting = app.setting;

  app.on('url/format', function (proxy) {
    socket.emit('request', {
      hostname: proxy.hostname
    });
  });

  router.use(function (req, res, next) {
    var proxy = req.proxy,
        complier;

    if (
      proxy.hostname == setting.get('project') ||
      proxy.hostname == '127.0.0.1' && proxy.port == setting.get('proxy-port-number')
    ) {
      return server.handle(req, res, next);
    }

    next();
  });
}
