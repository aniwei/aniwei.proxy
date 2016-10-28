var express = require('express'),
    path    = require('path'),
    router  = require('./router');

module.exports = function (context) {
  var app = express();

  app.code    = require('./common/code');
  app.format  = require('./common/format') ;
  app.context = context;

  app.use(express.static(path.join(__dirname,'../static')));
  app.use(router);

  return app;
}
