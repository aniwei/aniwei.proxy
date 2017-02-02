var urlParser     = require('url'),
    http          = require('http'),
    net           = require('net'),
    https         = require('https'),
    zlib          = require('zlib'),
    express       = require('express'),
    assign        = require('lodash').assign,
    fs            = require('fs'),
    path          = require('path'),
    async         = require('async'),
    router        = express.Router(),
    noop          = function () {},
    proto

module.exports = function (store, configure, app) {
  var ui          = configure.get('user-interface-configure').value,
      proxyPort   = configure.get('proxy-port-number').value,
      rootPath    = configure.get('root-path').value,
      serverPath  = path.join(rootPath, ui.server),
      server      = require(serverPath)(app),
      waterfaull  = app.waterfall,
      hostname    = ui.hostname,
      parallel    = [],
      proxyConfig,
      data;

  router.use(function(req, res, next){
    var proxy     = req.proxy,
        inHost    = proxy.hostname == hostname,
        isLocal   = proxy.hostname == '127.0.0.1',
        inPort    = proxy.port     == proxyPort,
        isHttp    = req.protocol   == 'http',
        is        = inHost || isLocal && inPort;

    if (is) {
      if (!proxyConfig) {
        return httpServer(server, function (config) {
          proxyConfig = config;

          assign(proxy, proxyConfig);

          next();
        });
      } else {
        if (isHttp) {
          assign(proxy, proxyConfig);
        }
      }
    }

    next()
  });

  return router;
}

function httpServer (app, done) {
  var server = createServer(http, app);

  done = done || noop;  

  server.on('listening', function () {
    var addr = server.address();

    done({
      port: addr.port,
      ip:   '127.0.0.1'
    });
  });
}

function createServer (client, app, argv) {
  var server = client.createServer.call(client, argv);

  server.setTimeout(0);
  server.listen(0);
  server.on('request', app);

  return server;
}