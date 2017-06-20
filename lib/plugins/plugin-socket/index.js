var socket    = require('socket.io'),
    Emitter   = require('events').Emitter,
    WebSocket = require('websocket').server,
    http      = require('http'),
    urlParser = require('url'),
    net       = require('net'),
    express   = require('express'),
    io        = require('socket.io'),
    Socket    = require('./socket');
    

module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('socket', __dirname),
      router = express.Router(),
      app    = pluginsManager.application,
      server = app.httpServer,
      water  = app.water,
      setting;

  app.socket = new Socket();
  
  app.Socket = function (ns) {
    return new Socket(ns);
  };

  setting = app.setting;

  plugin.defaultSettings = {};

  plugin.description = {
    text: '通信模块',
    brief: '通信模块提供是给扩展程序视图姐妹通信使用。'
  };

  plugin.router = router;

  router.use(function (req, res, next) {
    var app     = req.app,
        setting = app.setting;

    // 初始化过后，不用在此初始化，顾set false
    plugin.on = false;

    water.fall(function (done, req, socket, head) {
      var url = urlParser.parse('aniwei://' + req.url),
          sock;

      if (
        url.hostname === '127.0.0.1' && parseInt(url.port) === setting.get('proxy-port-number') ||
        url.hostname === app.ip && parseInt(url.port) === setting.get('proxy-port-number')
      ) {

        sock = net.connect(url.port, url.hostname, function () {
          socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
          socket.write(head);

          sock.pipe(socket);
        });

        socket.pipe(sock);

        return this;
      }

      done();
    });

    io = io(server);

    io.on('connection', function (socket) {
      Socket.already(socket);
    });
  });
}
