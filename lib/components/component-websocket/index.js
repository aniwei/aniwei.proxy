var socket    = require('socket.io'),
    Emitter   = require('events').Emitter,
    WebSocket = require('websocket').server,
    http      = require('http'),
    urlParser = require('url'),
    net       = require('net'),
    express   = require('express'),
    io        = require('socket.io'),
    router    = express.Router(),
    Socket    = require('./socket');
    

module.exports = function (components, configure, app) {
  var server     = app.httpServer,
      waterfall  = app.waterfall,
      dynamic    = configure.get('websocket-dynamic').value,
      port       = configure.get('websocket-port-number').value,
      ip         = app.ip,
      websocket;

  app.Socket = Socket;

  components.registe('websocket', {
    name:   'websocket',
    text:   'WebSocket',
    icon:   'socket',
    uri:    __dirname
  }, {

  });

  app.proxySocket = new Socket('proxy');

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

  io = io(server);

  io.on('connection', function (socket) {
    Socket.already(socket);
  });

  router.use(function (req, res, next) {
    next();
  });

  return router;
}

