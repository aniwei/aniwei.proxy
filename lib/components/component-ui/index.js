var urlParser     = require('url'),
    http          = require('http'),
    https         = require('https'),
    zlib          = require('zlib'),
    express       = require('express'),
    assign        = require('lodash').assign,
    fs            = require('fs'),
    path          = require('path'),
    async         = require('async'),
    router        = express.Router(),
    proto

module.exports = function (store, configure, app) {
  var ui          = configure.get('user-interface-configure').value,
      server      = require(path.join(configure.get('root-path').value, ui.server))(app),
      hostname    = ui.hostname,
      Tunnel      = this.Tunnel,
      parallel    = [],
      context     = app,
      httpConfig;

  // this.on('proxy', function (general) {
  //   var proxy   = hostname.proxy,
  //       host    = general.hostname,
  //       project = hostname.project,
  //       inBan   = host == proxy || host == project || ip == general.hostname || general.referer == proxy;

  //   if (!inBan) {
  //     context.io.emit('proxy', general);
  //   }
  // });

  parallel.push(function (done) {
    var project = hostname.project,
        proxy   = hostname.proxy,
        credent = context.credentials,
        cert    = credent.publicToPem(credent({}, proxy, project)),
        key     = credent.pemKey,
        server;

    context.beside(proxy);
    context.beside(project);

    server = createServer(https, app, {
      key: key,
      cert: cert
    });

    server.on('listening', function () {
      var addr    = server.address(),
          port    = addr.port,
          tunnel  = Tunnel.get(proxy, port);

      tunnel.tunnelConfig.hostname = '127.0.0.1';

      done();
    });
  })

  parallel.push(function (done) {
    var server = createServer(http, app);

    server.on('listening', function () {
      var addr = server.address();

      httpConfig = {
        port: addr.port,
        ip:   '127.0.0.1'
      }

      done()
    })
  })

  router.use(function(req, res, next){
    var proxy     = req.proxy,
        isHttp    = req.protocol == 'http';

    debugger;

    if (proxy.hostname == hostname || proxy.hostname == '127.0.0.1') {
      if (!httpConfig) {
        return async.parallel(parallel, function (result) {
          assign(proxy, httpConfig);

          next();
        });
      } else {
        if (isHttp) {
          assign(proxy, httpConfig);
        }
      }
    }

    next()
  });

  return router;
}

function createServer (client, app, argv) {
  var server = client.createServer.call(client, argv);

  server.setTimeout(0);
  server.listen(0);
  server.on('request', app);

  return server;
}