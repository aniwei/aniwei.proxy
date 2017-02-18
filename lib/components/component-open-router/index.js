var dns     = require('dns'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    router  = express.Router(),
    assign  = require('lodash').assign;

module.exports = function (components, configure, app) {
  var configure;

  components.registe('open-router',{
    name:     'open-router',
    text:     '开放路由',
    icon:     'host',
    uri:      __dirname,
  }, {
    
  });

  router.use(function(req, res, next){
    var proxy   = req.proxy,
        app     = req.app,
        tl      = req.timeline,
        ip;

    next();
  });

  return router;
}

