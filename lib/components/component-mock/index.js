var dns     = require('dns'),
    path    = require('path'),
    fs      = require('fs'),
    express = require('express'),
    router  = express.Router(),
    assign  = require('lodash').assign;

module.exports = function (components, configure) {
  var configure;

  components.registe('mock',{
    name:     'mock',
    text:     '域名配置',
    icon:     'json',
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

