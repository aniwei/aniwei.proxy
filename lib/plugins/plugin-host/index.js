var dns     = require('dns'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    assign  = require('lodash').assign;

module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('host'),
      router = express.Router();

  plugin.description = {
    text: '域名配置'
  };

  plugin.defaultSettings = {};

  plugin.router = router;

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

          next();
        })
      }

      return next();
    }

    next();
  });
}
