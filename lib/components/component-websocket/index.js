var socket    = require('socket.io'),
    Emitter   = require('events').Emitter,
    WebSocket = require('websocket').server,
    http      = require('http'),
    urlParser = require('url'),
    net       = require('net'),
    express   = require('express'),
    router    = express.Router();

module.exports = function (store, configure, app) {
  var components = store.get('components'),
      server     = app.httpServer,
      waterfall  = app.waterfall,
      dynamic    = configure.get('websocket-dynamic').value,
      port       = configure.get('websocket-port-number').value,
      websocket;

  components.push({
    key: 'websocket',
    brief: {}
  });

  waterfall.fall(function (done, req, socket, head) {
    var url = urlParser.parse('aniwei://' + req.url),
        sock;

    if (!dynamic) {
      if (parseInt(url.port) === port) {
        sock = net.connect(url.port, url.hostname, function () {
          socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
          socket.write(head);

          sock.pipe(socket);
        });

        socket.pipe(sock);

        return this;
      }
    }

    done();
  });

  io = new WebSocket({
    httpServer: server,
    autoAcceptConnections: true
  });

  io.on('connect', function (connection) {
    connection.on('message', function () {
    });
  });

  router.use(function (req, res, next) {
    req.websocket = {
      __proto__: Emitter.prototype
    };

    next();
  });

  return router;
}
