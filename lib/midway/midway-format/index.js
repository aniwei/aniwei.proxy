var urlParser = require('url'),
    concat    = require('buffer-concat'),
    _         = require('lodash'),
    dns       = require('dns'),
    timeline  = require('./timeline'),
    proto

proto = module.exports = function (router, description) {
  var configure = description.configure;

  router.use(function(req, res, next){
    var headers = req.headers,
        app     = req.app,
        isHttp  = req.protocol == 'http',
        url     = isHttp ? req.url : req.protocol + '://' + headers.host + req.url,
        parsed  = urlParser.parse(url),
        chunk   = [],
        size    = 0

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Proxy-Engine', 'aniwei.proxy');

    req.on('data', function (data) {
      chunk.push(data);
      size = size + data.length;
    })

    req.on('end', function(){
      var proxy = _.assign({
            method:   req.method,
            headers:  _.assign({}, req.headers),
            url:      url
          }, parsed),
          general;

      general = {
        id: app.rid(),
        hostname: proxy.hostname,
        url: proxy.url,
        referer: headers['referer'] || headers['Referer'],
        general: {
          url:      proxy.url,
          method:   proxy.method
        },
        request: req.headers
      }

      app.emit('proxy', general);

      proxy.chunk = concat(chunk, size);
      req.proxy   = proxy;
      req.general = general;

      next()
    });

    req.timeline = timeline();
  });
}

proto.description = {
  name:   'format',
  text:   '代理URL配置',
  on:     true
}
