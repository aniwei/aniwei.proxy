var urlParser = require('url'),
    http      = require('http'),
    https     = require('https'),
    zlib      = require('zlib'),
    proto

proto = module.exports = function (router, description) {
  router.use(function(req, res, next){
    var client = req.protocol == 'http' ? http : https,
        proxy  = req.proxy,
        app    = req.app,
        rid    = app.rid(),
        tl     = req.timeline;

    tl('request').begin()

    requ = client.request({
      hostname: proxy.ip,
      port:     proxy.port,
      path:     proxy.path,
      method:   proxy.method,
      headers:  proxy.headers,
      rejectUnauthorized: false
    },function(resp){
      var headers = resp.headers;

      res.writeHead(resp.statusCode, headers);

      resp.pipe(res);
      resp.on('end', function () {
        var proxyData;

        tl('response').end();

        proxyData = {
          id:       proxy.id,
          ip:       proxy.ip,
          headers:  headers,
          timeline: tl.all()
        }

        app.emit('proxy.response', proxyData);
      })
    });

    requ.on('error', function(err){
      next(err)
    });

    requ.on('response', function () {
      tl('request').end();
      tl('response').begin();
    });

    requ.write(proxy.chunk);
    requ.end();
  });
}

proto.description = {
  name:   'request',
  text:   '线上文件',
  on:     true
}
