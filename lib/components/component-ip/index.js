var dns     = require('dns'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    router  = express.Router(),
    assign  = require('lodash').assign;

module.exports = function (store, configure) {
  var components = store.get('components'),
      configure;

  components.push({
    key: 'ip',
    brief: {},
    configure: configure = {
      accessControlAllowOrigin: '*'
    }
  });

  router.use(function(req, res, next){
    var proxy   = req.proxy,
        app     = req.app,
        tl      = req.timeline,
        ip;

    tl('dns').begin();

    if (!ip) {
      if (!proxy.ip) {
        return dns.lookup(proxy.hostname, function(err, ip){
          if (err) {
            return next(err)
          }

          tl('dns').end()

          res.setHeader('x-remote-address', ip);
          proxy.ip = ip;

          // general.general.address = ip;

          next();
        })
      }

      return next();
    }

    tl('dns').end()

    // res.setHeader('x-local-address', ip);

    // general.general.address = ip;
    // typeof ip == 'object' ? _.assign(proxy, ip) : proxy.ip = ip;

    next();
  });

  return router;
}

