var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router(),
    proto


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('ssl-crt', __dirname),
      router = express.Router();

  plugin.description = {
    text: '证书下载',
    brief: '证书下载模块，提供通过浏览器下载根证书。'
  };

  plugin.router = express.Router();
  plugin.path   = __dirname;

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
