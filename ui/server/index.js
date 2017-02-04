require('babel-register');

var express = require('express'),
    path    = require('path'),
    fs      = require('fs'),
    store   = require('./store'),
    server  = require('./app/webpack.config.js'),
    port    = 8887;

module.exports = function (root) {
  var app     = express(),
      router  = require('./app');

  root.store.set(store);
  root.store.set({
    webpackServerPort: port
  });

  app.code    = require('./common/code');
  app.format  = require('./common/format') ;
  app.root    = root;

  app.use(router);

  server.listen(port)

  return app;
}
