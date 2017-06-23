var urlParser     = require('url'),
    fs            = require('fs'),
    path          = require('path'),
    express       = require('express'),
    assign        = require('lodash').assign,
    server        = require('./server'),
    noop          = function () {},
    id;

id = 1;

module.exports = function (pluginsManager) {
  var plugin  = new pluginsManager.Plugin('ui', __dirname),
      router  = express.Router(),
      app     = plugin.application,
      setting = app.setting,
      socket;

  plugin.defaultSettings = {};

  plugin.description = {
    text: '用户界面',
    brief: '用户界面，用于提供视图在浏览器端或其他端操作代理数据。'
  };

  plugin.router = router;  
  plugin.path   = __dirname;
  plugin.socket = socket = new app.Socket('ui');

  server.store   = app.store;
  server.setting = app.setting;
  server.forger  = app.forger;
  server.plugins = app.plugins;
  server.local   = app.local;

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
        id:               proxy.id,
        code:             proxy.code,
        message:          proxy.message,
        type:             proxy.type,
        extension:        proxy.extension,
        responseHeaders:  proxy.headers,
      });
    }
  }());

  router.use(function (req, res, next) {
    if (app.plugins.isNew()) {
      if (typeof extension === 'function') {
        extension(app.plugins.listing());

        extension = null;
      }
    }

    next();
  });

  router.use(function (req, res, next) {
    var proxy     = req.proxy,
        pathname  = proxy.pathname;

    if (app.local(proxy)) {
      if (
        pathname.indexOf('/socket.io/') > -1
        // pathname.indexOf('/plugin/') > -1
      ) {
        return next();
      }

      return server.handle(req, res, next);
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


function extension (listing) {
  var  importSentence = listing.filter(function (li) {
    return li.ui;
  }).map(function (li) {
    return 'import \'' + path.join(li.path, 'ui') + '\';';
  });

  if (importSentence.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'src/extensions.jsx'), importSentence.join('\n'));
  }
}