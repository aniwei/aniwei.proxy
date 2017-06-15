var urlParser     = require('url'),
    express       = require('express'),
    assign        = require('lodash').assign,
    server        = require('./server'),
    noop          = function () {},
    id;

id = 1;

module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('ui'),
      router  = express.Router(),
      app     = plugin.application,
      setting = app.setting,
      socket;

  plugin.defaultSettings = {};

  plugin.description = {
    text: '用户界面'
  };

  plugin.router = router;  
  plugin.socket = socket = new app.Socket('ui');

  server.store   = app.store;
  server.setting = app.setting;
  server.forger   = app.forger;

  app.on('proxy/url', function () {
    var callback = throttle(function (list) {

      socket.emit('request', {
        list,
        __from__: 'url'
      });
    });

    return function (proxy) {
      callback({
        id:       proxy.id,
        hostname: proxy.hostname,
        host:     proxy.host,
        port:     proxy.port,
        path:     proxy.path,
        pathname: proxy.patnname,
        search:   proxy.search,
        method:   proxy.method,
        requestHeaders:  proxy.headers,
        url:      proxy.url,
        protocol: proxy.protocol
      });
    };
  }());

  app.on('proxy/ip', function () {
    var callback = throttle(function (list) {
      socket.emit('request', {
        list,
        __from__: 'ip'
      });
    });

    return function (proxy) {
      callback({
        id:       proxy.id,
        ip:       proxy.ip
      });
    };

  }());

  app.on('proxy/receive', function () {
    var callback = throttle(function (list) {
      socket.emit('request', {
        list,
        __from__: 'receive'
      });
    });

    return function (proxy) {
      callback({
        id:       proxy.id,
        code:     proxy.code,
        message:  proxy.message,
        type:     proxy.type,
        responseHeaders: proxy.headers,
      });
    }
  }());

  router.use(function (req, res, next) {
    var proxy = req.proxy,
        ip    = app.ip,
        port  = setting.get('proxy-port-number');

    if (
      proxy.hostname == setting.get('project') ||
      proxy.hostname == ip && proxy.port == port || 
      proxy.hostname == '127.0.0.1' && proxy.port == port
    ) {
      if (proxy.pathname.indexOf('/socket.io/') == -1) {
        return server.handle(req, res, next);
      }
    }

    next();
  });
}

function throttle (callback, timeout) {
  var timer,
      list = [];

  callback = callback || function () {};

  return function (data) {
    clearTimeout(timer);

    list.push(data);

    timer = setTimeout(function () {
      callback(list);

      list = [];
    }, timeout || 100);
  }
}