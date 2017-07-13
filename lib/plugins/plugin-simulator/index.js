var urlParser = require('url'),
    fs        = require('fs'),
    express   = require('express'),
    assign    = require('lodash').assign;


module.exports = function (pluginManager) {
  var plugin      = new pluginManager.Plugin('simulator', __dirname, '0.0.1'),
      router      = express.Router(),
      coder       = plugin.application.code('simulator', 100),
      rulesManager,
      actions;
      
  rulesManager = new RulesManager(plugin);

  plugin.description = {
    text: '数据模拟',
    brief: '提供数据模拟，以及映射到本地文件或者本地服务'
  };

  plugin.defaultSettings = {
    navigations: {
      list: [
        { key: 'rules', icon: 'ti-layout-list-thumb', text: '规则配置', action: 'RULES', selected: true },
        { key: 'settings', icon: 'ti-settings', text: '插件设置', action: 'SETTINGS' },
        { key: 'helpful', icon: 'ti-help-alt', text: '使用帮助', action: 'HELPFUL' }
      ],
      selectedKey: 'rules'
    }
  };

  if (!plugin.get('rules')) {
    plugin.set('rules', []);
  }

  rulesManager.rules = plugin.get('rules');

  plugin.router  = router;

  router.post('/plugin/simulator/update', function(req, res, next){
    var rules   = req.body.rules || req.query.rules,
        object  = {};

    if (!Array.isArray(rules)) {
      return res.json({
        code: 1000,
        message: '[rules] 必须为数组'
      });
    }

    rules = rules.filter(function (ru) {
      return !!ru;
    });

    rulesManager.rules = rules;

    plugin.set('rules', rulesManager.all());
    plugin.save();

    res.json({
      code: 0,
      rules: rulesManager.all()
    });
  });

  router.use(function (req, res, next) {
    var proxy = req.proxy,
        rule;

    rule = rulesManager.match(proxy.url);

    if (rule) {
      return rulesManager.render(rule)(req, res, next);
    }

    next();
  });
}

function RulesManager (plugin, rules) {
  this.rules  = rules || [];
  this.plugin = plugin;
}

RulesManager.prototype = {
  match: function (url) {
    var rules = this.rules,
        rule;

    rules.some(function (ru) {
      var list = ru.list;

      return list.some(function (li) {
        var match   = li.match,
            type    = match.type,
            content = match.content,
            regexp;

        if (type == 'string') {
          if (url == content) {
            return rule = li;
          }
        }

        if (type === 'regular') {
          regexp = li.regexp || new RegExp(content.replace());

          if (regexp.test(url)) {
            return rule = li;
          }
        }
      });
    });

    if (rule) {
      if (!rule.disable) {
        return rule;
      }
    }
  },

  render: function (rule) {
    var response = rule.response,
        type     = response.type,
        match    = rule.match,
        sender   = this.sender[type] || function (match, resp, req, res, next) { next(); };

    sender = sender.bind(this);
        
    return function (req, res, next) {
      sender(match, response, req, res, next);
    }
  },

  sender: {
    defined: function (match, resp, req, res, next) {
      var app   = this.plugin.application,
          proxy = req.proxy;

      res.setHeader('x-from', 'proxy-memory');

      app.emit('proxy/receive', {
        id:           proxy.id,
        code:         res.statusCode,
        message:      res.statusMessage,
        headers:      res.headers,
        // type:         mime.lookup(ext || ''),
        // extension:    ext,
        from:         'receive'    
      });

      res.send(decodeURIComponent(resp.content));
    },

    file: function (match, resp, req, res, next) {
      var app   = this.plugin.application,
          isStr = match.type == 'string',
          proxy = req.proxy,
          content;

      content = isStr ?
        response.content : proxy.url.replace(match.content, response.content);

      fs.exists(content, function (err) {
        if (err) {
          return next(err);
        }

        res.setHeader('x-from', content);
        res.writeHead(200, res.headers);

        app.emit('proxy/receive', {
          id:           proxy.id,
          code:         res.statusCode,
          message:      res.statusMessage,
          headers:      res.headers,
          // type:         mime.lookup(ext || ''),
          // extension:    ext,
          from:         'receive'    
        });

        fs.createReadStream(content).pipe(res);
      });
    },

    service: function (match, resp, req, res, next) {
      var app   = this.plugin.application,
          proxy = req.proxy,
          isStr = match.type == 'string',
          content;

      content = isStr ? 
        resp.content : proxy.url.replace(match.content, resp.content);

      content = decodeURIComponent(content);

      urlParsed = urlParser.parse(content);
      proxy = assign(proxy, urlParsed);

      res.setHeader('x-redirect', content);

      this.plugin.to('requester', req, res, next);
    }

  },

  all: function () {
    return this.rules;
  }
};
