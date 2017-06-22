var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router(),
    pid;

pid = 1;


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('url-formatter', __dirname),
      router = express.Router(),
      app    = plugin.application;

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
        postChunk = [],
        chunkSize = 0,
        config;

    if (
      !parsed.hostanme && 
      !parsed.port &&
      !parsed.protocol &&
      !parsed.host 
    ) {
      parsed = urlParser.parse(req.protocol + '://' + headers.host + req.url);
    }

    req.proxy     = assign({
      chunk:    Buffer.concat(postChunk, chunkSize),
      method:   req.method,
      headers:  assign(headers),
      url:      url,
      id:       pid++
    }, parsed);

    app.emit('proxy/url', req.proxy);
    
    next();

    // req.on('data', function (data) {
    //   postChunk.push(data);
    //   chunkSize = chunkSize + data.length;
    // });

    // req.on('end', function(){
    //   req.proxy     = assign({
    //         chunk:    Buffer.concat(postChunk, chunkSize),
    //         method:   req.method,
    //         headers:  assign(headers),
    //         url:      url,
    //         id:       pid++
    //       }, parsed);

    //   app.emit('proxy/url', req.proxy);
      
    //   next();
    // });
  });
}
