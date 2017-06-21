var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    proto


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('ssl-crt', __dirname),
      router = express.Router();

  plugin.description = {
    text: '证书下载',
    brief: '证书下载模块，提供通过浏览器下载根证书。'
  };

  plugin.defaultSettings = {};

  plugin.router = router;
  plugin.path   = __dirname;

  plugin.router.get('/ssl.crt', function(req, res, next){
    var proxy = req.proxy,
        app   = req.app,
        setting,
        forger;

    setting = app.setting;
    forger  = app.forger;

    if (
      app.local(proxy)
    ) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(new Buffer(forger.get('root').cert));
    } else {
      next();
    }
  });
}
