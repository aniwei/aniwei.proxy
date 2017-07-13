var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign;

module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('open-router', __dirname, '0.0.1'),
      router = express.Router();

  plugin.description = {
    text: '开发插件接口',
    brief: '提供第三方插件接入'
  };

  plugin.defaultSettings = {};

  plugin.router  = router;

  pluginManager.exchange = function () {
    pluginManager.supporter = plugin.router;

    return plugin.router;
  };
}


