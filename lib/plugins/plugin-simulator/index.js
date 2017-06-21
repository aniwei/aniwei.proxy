var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign;


module.exports = function (pluginManager) {
  var plugin      = new pluginManager.Plugin('simulator', __dirname),
      router      = express.Router(),
      simulattion = [];
      

  plugin.description = {
    text: '数据模拟',
    brief: '提供数据模拟，以及映射到本地文件或者本地服务'
  };

  plugin.router = router;
  plugin.path   = __dirname;


  router.get('/plugin/simulator/:action', function(req, res, next){
    res.json({
      code: 0
    });
  });

  router.use(function (req, res, next) {
    next();
  });
}
