var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    timeline  = require('./timeline'),
    router    = express.Router(),
    proto


module.exports = function (components, configure, app) {
  var configManager,
      socket;

  socket = app.Socket('url-formatter');

  configManager = components.registe('url-formatter',{
    className:  'format',
    text:       '资源地址',
    icon:       'arrage',
    uri:        __dirname
  }, {
    namespace: socket.namespace,
    responseHeaders: {
      'Access-Control-Allow-Origin': 'https://aniwei.proxy',
      'Access-Control-Allow-Credentials': 'true',
      'x-proxy-engine': 'aniwei.proxy'
    },
    requestHeaders: {
      'cache-control': 'no-cache'
    }
  });

  router.use(function(req, res, next){
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

    res._headers = assign(res._headers, configManager.get('responseHeaders'));
  
    headers = assign(headers, configManager.get('requestHeaders'));

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
