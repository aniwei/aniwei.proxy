var urlParser = require('url'),
    http      = require('http'),
    https     = require('https'),
    zlib      = require('zlib'),
    mime      = require('mime'),
    proto

proto = module.exports = function (router, description) {
  router.use(function(req, res, next){
    var client  = req.protocol == 'http' ? http : https,
        proxy   = req.proxy,
        general = req.general,
        app     = req.app,
        rid     = app.rid(),
        tl      = req.timeline,
        requ;

    tl('request').begin();

    requ = client.request({
      hostname: proxy.ip,
      port:     proxy.port,
      path:     proxy.path,
      method:   proxy.method,
      headers:  proxy.headers,
      rejectUnauthorized: false
    },function(resp){
      var headers     = resp.headers,
          contentType = headers['content-type'] || headers['Content-Type'];

      if (!contentType) {
        headers['content-type'] = mime.lookup(proxy.pathname); 
      }

      res.writeHead(resp.statusCode, headers);

      resp.pipe(res);
      resp.on('end', function () {
        tl('response').end();

        general.general.status = resp.statusCode;
        general.response       = headers;
        general.timeline       = tl.all();

        app.emit('proxy', general);
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
