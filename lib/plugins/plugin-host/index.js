var dns         = require('dns'),
    path        = require('path'),
    fs          = require('fs'),
    hostParser  = require('parse-hosts'),
    express     = require('express'),
    assign      = require('lodash').assign;

module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('host', __dirname),
      router = express.Router(),
      app    = plugin.application,
      rulesManager;

  plugin.description = {
    text: '域名配置',
    brief: '域名配置模块，提供自配置域名映射关系。',
  };

  plugin.defaultSettings  = {
    rules: [],
    path: '/etc/hosts'
  };

  plugin.router           = router;

  rulesManager = new RulesManager(plugin.get('rules'));
  rulesManager.rulesReader(plugin.get('path'));

  plugin.set('rules', rulesManager.all());

  router.get('/plugin/host/rules', function (res, req) {
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

          res.setHeader('x-remote-address', ip);
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
      proxy.ip = rule.ip;

      app.emit('proxy/ip', {
        id: proxy.id,
        ip: rule.ip
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
      if (ru.list.indexOf(hostname) > -1) {
        return rule = ru;
      }
    });

    return rule;
  },

  // 读取系统hosts
  rulesReader: function (path) {
    var list    = hostParser.get(path),
        rule;    
        
    rule = {
      group:  'system',
      text:   '系统',
      list:   Object.keys(list).map(function (key) {
        var li = list[key];

        return {
          ip:       key,
          hostname: li,
          comment:  null
        };
      })
    };

    this.rules = [rule].concat(this.rules);
  }
};