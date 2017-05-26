var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router(),
    proto


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('ssl-crt'),
      router = express.Router();

  plugin.description = {
    text: 'SSL Certificate'
  };

  plugin.router = express.Router();

  plugin.router.get('/ssl.crt', function(req, res, next){
    var proxy = req.proxy,
        app   = req.app,
        setting,
        forger;

    setting = app.setting;
    forger  = app.forger;

    if (
      proxy.ip == '127.0.0.1' && proxy.port == setting.get('proxy-port-number') ||
      proxy.hostname == '127.0.0.1' && proxy.port == setting.get('proxy-port-number') ||
      proxy.hostname == setting.get('project')
    ) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(new Buffer(forger.get('root').cert));
    } else {
      next();
    }
  });
}
