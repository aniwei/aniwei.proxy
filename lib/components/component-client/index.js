var urlParser = require('url'),
    http      = require('http'),
    https     = require('https'),
    zlib      = require('zlib'),
    mime      = require('mime'),
    express   = require('express'),
    router    = express.Router();


module.exports = function (components, configure, app) {
  var configure,
      socket = app.Socket('client');

  components.registe('ip',{
    name:   'request',
    text:   '资源请求',
    icon:   'request',
    uri:    __dirname
  }, {
    namespace: socket.namespace
  });

  router.use(function(req, res, next){
    var proxy   = req.proxy,
        client  = proxy.protocol == 'http:' ? http : https,
        app     = req.app,
        tl      = req.timeline,
        requ;

    tl('request').begin();

    socket.emit('request', proxy);

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
          chunk = [];

      if (!contentType) {
        headers['content-type'] = mime.lookup(proxy.pathname); 
      }

      res.writeHead(resp.statusCode, headers);

      resp.pipe(res);

      resp.on('data', function (data) {
        chunk.push(data);
      });
      
      resp.on('end', function () {
        tl('response').end();
      });   
    });

    requ.on('error', function(err){
      next(err);
    });

    requ.on('response', function () {
      tl('request').end();
      tl('response').begin();
    });

    requ.write(proxy.chunk);
    requ.end();
  });


  return router;
}
