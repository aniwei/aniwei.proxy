require('babel-register');

var express = require('express'),
    path    = require('path'),
    fs      = require('fs');

module.exports = function (context) {
  var app     = express(),
      router  = require('./app'),
      dict    = context.config('store.path');

  app.code    = require('./common/code');
  app.format  = require('./common/format') ;
  app.context = context;

  app.use(require('./common/complie'));
  
  if (fs.existsSync(dict)) {
    app.set('store', require(dict));
  }

  app.use(router);

  return app;
}
