var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign;


module.exports = function (pluginManager) {
  var plugin      = new pluginManager.Plugin('simulator', __dirname),
      router      = express.Router(),
      actions;
      

  plugin.description = {
    text: '数据模拟',
    brief: '提供数据模拟，以及映射到本地文件或者本地服务'
  };

  plugin.defaultSettings = {
    rules: []
  };

  plugin.router = router;
  plugin.path   = __dirname;


  router.post('/plugin/simulator/append', function(req, res, next){
    var rule = req.body.rule,
        object = {};

    if (!rule) {
      return res.json({
        code: -1000,
        message: 'rule is required'
      });
    }

    debugger;

    rule.forEach(function (r) {
      var subject = object[r.subject] = {};

      object.name = r.subject;

      r.formItem.forEach(function (it) {
        subject[it.name] = it.value;
      });
    });

    res.json({
      code: 0,
      message: 'success'
    });
  });

  router.use(function (req, res, next) {
    next();
  });
}
