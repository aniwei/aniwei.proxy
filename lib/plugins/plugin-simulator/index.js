var urlParser = require('url'),
    fs        = require('fs'),
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
    var rules,
        proxy = req.proxy,
        rule;

    // rules = [{
    //   subject: 'default',
    //   text: '默认',
    //   list: [
    //     {
    //       match: {
    //         type: 'string',
    //         content: 'https://www.baidu.com/'
    //       },
    //       response: {
    //         type: 'define',
    //         content: 'hello world'
    //       }
    //     }
    //   ]
    // }];

    // rule = matchProxy(rules, proxy.url);

    // if (rule) {
    //   return responseProxy(req, res, rule);
    // }

    next();
  });
}


function responseProxy (req, res, rule) {
  var response = rule.response,
      type     = response.type;
      content  = response.content;

  switch (type) {
    case 'define':
      return res.send(content);
    case 'local':
      break;
  }

}

function matchProxy (rules, url) {
  var rule;
  
  rules.some(function (ru) {
    ru.list.some(function (li) {
      var type    = li.match.type,
          content = li.match.content,
          res;

      switch (type) {
        case 'string':
          if (url === content) {
            return rule = li;
          }
          break;

        case 'regexp':
          res = url.match(content);
          
          if (res) {
            return rule = li;
          }
          break;
      }
    });
  });

  return rule;
}