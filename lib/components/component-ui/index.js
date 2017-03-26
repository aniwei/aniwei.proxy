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
    noop          = function () {};

module.exports = function (components, settings, app) {
  var ui          = settings.get('user-interface'),
      proxyPort   = settings.get('proxy-port-number'),
      serverPath  = path.join(ui.root, ui.server),
      server      = require(serverPath)(app),
      water       = app.water,
      hostname    = ui.hostname,
      parallel    = [],
      ip          = app.ip, 
      proxyConfig,
      data;

  components.registe('ui',{
    icon: 'ui',
    text: '用户界面',
    name: 'ui',
    uri: __dirname
  }, {
    
  });

  water.fall(function (done, req, socket, head) {
    var url       = urlParser.parse('aniwei://' + req.url),
        inHost    = url.hostname == hostname,
        isLocal   = url.hostname == '127.0.0.1' || url.hostname == ip,
        inPort    = url.port     == proxyPort,
        isHttp    = url.protocol == 'http',
        is        = inHost || isLocal && inPort,
        soc;

    if (is) {
      httpsServer(server, app.certificate, [{
        type: 2,
        value: hostname
      }, {
        type: 7, 
        value: '127.0.0.1'
      }], hostname, function (proxy) {
        proxyConfig = proxy;

        soc = net.connect(proxy.port, proxy.ip, function () {
          socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
          socket.write(head);

          soc.pipe(socket);
        });

        socket.pipe(soc);
      });

      return this;
    }

    done();
  });

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

    next();
  });

  return router;
}

function createCertificate (certificate, altname, hostname) {
  var data = certificate.forge({
    subject: {
      CN: hostname
    }
  }, altname, hostname);

  return data;
}

function httpsServer (app, certificate, altname, hostname, done) {
  var data    = createCertificate(certificate, altname, hostname),
      server  = createServer(https, app, data);

  done = done || noop;

  server.on('listening', function () {
    var addr = server.address();

    done({
      port: addr.port,
      ip:   '127.0.0.1'
    });
  });
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