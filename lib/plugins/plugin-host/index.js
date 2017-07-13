var dns         = require('dns'),
    path        = require('path'),
    fs          = require('fs'),
    hostParser  = require('parse-hosts'),
    express     = require('express'),
    assign      = require('lodash').assign;

module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('host', __dirname, '0.0.1'),
      router = express.Router(),
      app    = plugin.application,
      rulesManager;

  plugin.description = {
    text: '域名配置',
    brief: '域名配置模块，提供自配置域名映射关系。',
  };

  plugin.defaultSettings  = {
    path: '/etc/hosts',
    navigations: {
      list: [
        { key: 'rules', icon: 'ti-layout-list-thumb', text: '规则配置', action: 'RULES', selected: true },
        { key: 'settings', icon: 'ti-settings', text: '插件设置', action: 'SETTINGS' },
        { key: 'helpful', icon: 'ti-help-alt', text: '使用帮助', action: 'HELPFUL' }
      ],
      selectedKey: 'rules'
    }
  };

  plugin.router           = router;

  if (plugin.get('rules')) {
    plugin.set('rules', []);
  }

  rulesManager = new RulesManager(plugin.get('rules'));
  rulesManager.rulesReader(plugin.get('path'));

  plugin.set('rules', rulesManager.all());

  router.get('/plugin/host/rules', function (req, res) {
    res.json({
      code: 0,
      rules: rulesManager.all()
    });
  });

  router.use('/plugin/host/update', function (req, res) {
    var rules = req.query.rules || req.body.rules;

    if (!Array.isArray(rules)) {
      return res.json({
        code: 1000,
        message: '[rules] 参数必须为数组'
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
        app   = req.app,
        rule;

    if (app.local(proxy)) {
      return next();
    }

    rule = rulesManager.exist(proxy.hostname);

    if (!rule) {
      if (!proxy.ip) {
        return dns.lookup(proxy.hostname, function(err, ip){
          if (err) {
            return next(err)
          }

          res.setHeader('x-from', ip);
          proxy.ip = ip;

          app.emit('proxy/ip', {
            id: proxy.id,
            ip: ip
          });

          next();
        });
      }

      return next();
    } else {
      proxy.ip = rule.key;

      res.setHeader('x-from', rule.key);

      app.emit('proxy/ip', {
        id: proxy.id,
        ip: rule.key
      });
    }

    next();
  });
}

function RulesManager (rules) {
  this.rules = rules || [];
}

RulesManager.prototype = {
  all: function () {
    return this.rules;
  },

  exist: function (hostname) {
    var rule;

    this.rules.some(function (ru) {
      return ru.list.some(function (li) {
        if (li.value.indexOf(hostname) > -1) {
          if (!li.disable) {
            return rule = li;
          }
        }
      })
    });

    return rule;
  },

  // 读取系统hosts
  rulesReader: function (path) {
    var list    = hostParser.get(path),
        rule;    
        
    rule = {
      name:   '系统',
      editable: false,
      list:   Object.keys(list).map(function (key) {
        var li = list[key];

        return {
          key:       key,
          value: li
        };
      })
    };

    if(!this.rules.some(function (ru) {
      if (ru.name === '系统') {
        return true;
      }
    })) {
      this.rules = [rule].concat(this.rules);
    }
  }
};