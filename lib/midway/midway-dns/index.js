var dns   = require('dns'),
    path  = require('path'),
    fs    = require('fs'),
    proto

proto = module.exports = function (router, description) {
  var configure = description.configure,
      hosts     = configure.hostname || (configure.hosts = {})

  router.use(function(req, res, next){
    var proxy   = req.proxy,
        general = req.general,
        app     = req.app,
        tl      = req.timeline,
        ip;

    ip = hosts[proxy.hostname];

    tl('dns').begin();

    if (!ip) {
      if (!proxy.ip) {
        return dns.lookup(proxy.hostname, function(err, ip){
          if (err) {
            return next(err)
          }

          tl('dns').end()

          res.setHeader('X-Remote-Address', ip);
          proxy.ip = ip;

          general.general.address = ip;

          next();
        })
      }

      return next();
    }

    tl('dns').end()

    res.setHeader('X-Local-Address', ip);

    general.general.address = ip;
    typeof ip == 'object' ? _.assign(proxy, ip) : proxy.ip = ip;

    next();
  })
}

proto.description = {
  name: 'dns',
  text: '域名服务',
  on:   true
}
