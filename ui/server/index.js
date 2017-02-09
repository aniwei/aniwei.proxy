require('babel-register');

var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    store   = require('./store');

module.exports = function (root) {
  var app     = express(),
      router  = require('./app');

  root.store.set(store);

  app.code    = require('./common/code');
  app.format  = require('./common/format') ;
  app.root    = root;

  app.use(router);

  if (process.env.NODE_ENV == 'dev') {
    dev(app, root.waterfall);
  }

  return app;
}

function dev (app, waterfall) {
  var server    = require('./app/webpack.config.js'),
      urlParser = require('url'),
      net       = require('net'),
      port      = 8887;

  server.listen(port);

  app.set('webpackServerPort', port);

  waterfall.fall(function (done, req, socket, head) {
    var url = urlParser.parse('aniwei://' + req.url),
        sock;

    if (url.hostname == 'localhost' || url.hostname == '127.0.0.1') {
      if (parseInt(url.port) === 9091) {
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
}
