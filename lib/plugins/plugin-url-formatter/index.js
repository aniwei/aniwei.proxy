var urlParser     = require('url'),
    express       = require('express'),
    assign        = require('lodash').assign,
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    Readable      = require('stream').Readable,
    withBody      = require('type-is').hasBody,
    async         = require('async'),
    router        = express.Router(),
    pid;

pid = 1;


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('url-formatter', __dirname, '0.0.1'),
      router = express.Router(),
      app    = plugin.application,
      expressRouter;

  expressRouter = express.Router();

  expressRouter.use(bodyParser.json({
    limit: '50mb'
  }));
  expressRouter.use(bodyParser.urlencoded({ 
    extended: false,
    limit: '50mb'
  }));
  expressRouter.use(cookieParser());

  plugin.description = {
    text: '格式地址',
    brief: '格式地址模块，用于将代理请求格式化为对象，提供给其他扩展模块操作。'
  };

  plugin.defaultSettings = {};

  plugin.router = express.Router();
  plugin.path   = __dirname;

  plugin.router.use(function(req, res, next){
    var headers   = req.headers,
        protocol  = req.protocol,
        url       = protocol == 'http' ? req.url : req.protocol + '://' + headers.host + req.url,
        parsed    = urlParser.parse(url),
        chunkSize = 0,
        proxy;

    if (
      !parsed.hostanme && 
      !parsed.port &&
      !parsed.protocol &&
      !parsed.host 
    ) {
      parsed = urlParser.parse(req.protocol + '://' + headers.host + req.url);
    }

    req.proxy = proxy = assign({
      method:   req.method,
      headers:  assign(headers),
      url:      url,
      id:       pid++
    }, parsed);

    app.emit('proxy/url', proxy);

    if (withBody) {
      async.parallel([
        function (done) {
          var readable = [],
              size     = 0;

          req.on('data', function (chunk) {
            readable.push(chunk);

            size += chunk.length;
          });

          req.on('end', function () {
            proxy.readable = Buffer.concat(readable, size);

            done();
          });
        },
        function (done) {
          expressRouter.handle(req, res, function (err) {
            if (err) {
              return next(err);
            }

            done()
          });
        }
      ], function () {
        next();
      });
    } else {
      next();
    }
  });
}
