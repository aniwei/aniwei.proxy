var socket    = require('socket.io'),
    Emitter   = require('events').Emitter,
    WebSocket = require('websocket').server,
    http      = require('http'),
    urlParser = require('url'),
    net       = require('net'),
    express   = require('express'),
    io        = require('socket.io'),
    router    = express.Router();

module.exports = function (components, configure, app) {
  var server     = app.httpServer,
      waterfall  = app.waterfall,
      dynamic    = configure.get('websocket-dynamic').value,
      port       = configure.get('websocket-port-number').value,
      ip         = app.ip,
      websocket;

  components.registe('websocket',{

  }, {

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

  io = io(server);

  io.on('connection', function (socket) {
    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function (from, msg) {
      console.log('I received a private message by ', from, ' saying ', msg);
    });

    socket.on('disconnect', function () {
      io.emit('user disconnected');
    });
  });

  // io = new WebSocket({
  //   httpServer: server,
  //   autoAcceptConnections: true
  // });

  // io.on('connect', function (connection) {
  //   connection.on('message', function () {
  //   });
  // });

  // router.use(function (req, res, next) {
  //   next();
  // });

  return router;
}
