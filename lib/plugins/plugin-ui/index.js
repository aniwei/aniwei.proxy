var urlParser     = require('url'),
    express       = require('express'),
    assign        = require('lodash').assign,
    server        = require('./server'),
    noop          = function () {};

module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('ui'),
      router  = express.Router(),
      app     = pluginsManager.application,
      setting = app.setting;

  plugin.defaultSettings = {};

  plugin.description = {
    text: '用户界面'
  };

  plugin.router = router;

  router.use(function (req, res, next) {
    var proxy = req.proxy,
        complier;

    if (
      proxy.hostname == setting.get('project') ||
      proxy.ip == '127.0.0.1' && proxy.port == setting.get('proxy-port-number')
    ) {
      return server.handle(req, res, next);
    }

    next();
  });
}
