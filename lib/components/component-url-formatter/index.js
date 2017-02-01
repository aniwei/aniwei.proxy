var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    timeline  = require('./timeline'),
    router    = express.Router(),
    proto


module.exports = function (store, configure) {
  var components = store.get('components'),
      configure;

  components.push({
    key: 'url-formatter',
    brief: {},
    configure: configure = {
      accessControlAllowOrigin: '*'
    }
  });

  router.use(function(req, res, next){
    var headers   = req.headers,
        protocol  = req.protocol,
        url       = protocol == 'http' ? req.url : req.protocol + '://' + headers.host + req.url,
        parsed    = urlParser.parse(url),
        postChunk = [],
        chunkSize = 0;

    res.setHeader('Access-Control-Allow-Origin', configure.accessControlAllowOrigin);
    res.setHeader('x-proxy-engine', 'aniwei.proxy');

    headers = assign({
      'cache-control': 'no-cache'
    }, headers);

    req.on('data', function (data) {
      postChunk.push(data);
      chunkSize = chunkSize + data.length;
    });

    req.on('end', function(){
      req.proxy     = assign({
            chunk:    Buffer.concat(postChunk, chunkSize),
            method:   req.method,
            headers:  assign(headers),
            url:      url
          }, parsed);
      req.timeline  = timeline();

      next();
    });
  });

  return router;
}
