var urlParser = require('url'),
    fs        = require('fs'),
    express   = require('express'),
    assign    = require('lodash').assign;


module.exports = function (pluginManager) {
  var plugin      = new pluginManager.Plugin('simulator', __dirname),
      router      = express.Router(),
      coder       = plugin.application.code('simulator', 100),
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
    var rule    = req.body.rule,
        object  = {},
        rules;

    if (!rule) {
      return res.json(coder());
    }

    res.json({
      code: 0,
      message: 'success'
    });
  });

  router.use(function (req, res, next) {
    var rules,
        proxy = req.proxy,
        rule;

    rules = [{
      subject: 'default',
      text: '默认',
      list: [
        {
          match: {
            type: 'regexp',
            content: /https?\:\/\/www\.baidu\.com\/(index\.js)/g
          },
          response: {
            type: 'service',
            content: 'http://127.0.0.1/$1'
          }
        }
      ]
    }];

    rule = matchProxy(rules, proxy.url);

    if (rule) {
      return responseProxy(req, res, next, rule);
    }

    next();
  });
}

function responseProxy (req, res, next, rule) {
  var response = rule.response,
      match    = rule.match.content,
      type     = response.type,
      content  = response.content,
      proxy    = req.proxy,
      url      = proxy.url,
      error;

  switch (type) {
    case 'define':
      return res.send(content);
    case 'local':
      content = url.replace(match, content);

      if (fs.existsSync(content)) {
        res.sendfile(content);
      } else {
        error = new Error('Not Found');
        error.status = 404;

        next(error);
      }

      break;
    case 'service':
      content   = url.replace(match, content);
      urlParsed = urlParser.parse(content);

      assign(proxy, urlParsed);

      proxy.url = content;
      req.proxy = proxy;

      next();
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