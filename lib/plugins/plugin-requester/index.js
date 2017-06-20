var urlParser = require('url'),
    http      = require('http'),
    https     = require('https'),
    zlib      = require('zlib'),
    mime      = require('mime'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router();


module.exports = function (pluginsManager) {
  var plugin = new pluginsManager.Plugin('requester', __dirname),
      router = express.Router();

  plugin.description = {
    text: '资源请求',
    brief: '资源请求模块，用于发送代理请求，并将结果返回。'
  };

  plugin.router = router;

  router.use(function (req, res, next) {
    var proxy   = req.proxy,
        client  = proxy.protocol == 'http:' ? http : https,
        app     = req.app,
        requ;

    requ = client.request({
      hostname: proxy.ip,
      port:     proxy.port,
      path:     proxy.path,
      method:   proxy.method,
      headers:  proxy.headers,
      rejectUnauthorized: false
    }, function(resp){
      var headers     = resp.headers,
          contentType = headers['content-type'] || headers['Content-Type'],
          chunk = [],
          type;

      if (!contentType) {
        headers['content-type'] = mime.lookup(proxy.pathname); 
      }

      if (contentType) {
        type = contentType.split(';');
      }

      res.writeHead(resp.statusCode, headers);

      resp.pipe(res);

      resp.on('data', function (data) {
        chunk.push(data);
      });
      
      resp.on('end', function () {
        
        app.emit('proxy/receive', {
          id:       proxy.id,
          code:     resp.statusCode,
          message:  resp.statusMessage,
          headers:  resp.headers,
          type:     type ? type.shift() : mime.lookup(proxy.pathname),
          contentType: contentType,
          from:     'receive'    
        });

      });   
    });

    requ.on('error', function(err){
      next(err);
    });

    requ.on('response', function () {});

    requ.write(proxy.chunk);
    requ.end();
  });
}