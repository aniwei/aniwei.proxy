var dns     = require('dns'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    assign  = require('lodash').assign;

module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('host', __dirname),
      router = express.Router(),
      app    = plugin.application;

  plugin.description = {
    text: '域名配置',
    brief: '域名配置模块，提供自配置域名映射关系。',
  };

  plugin.defaultSettings  = {};
  plugin.router           = router;

  router.use(function (req, res, next) {
    var proxy = req.proxy,
        ip;

    if (!ip) {
      if (!proxy.ip) {
        return dns.lookup(proxy.hostname, function(err, ip){
          if (err) {
            return next(err)
          }

          res.setHeader('x-remote-address', ip);
          proxy.ip = ip;

          app.emit('proxy/ip', {
            id: proxy.id,
            ip: ip
          });

          next();
        })
      }

      return next();
    }

    next();
  });
}
