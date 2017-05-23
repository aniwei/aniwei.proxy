var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router(),
    proto


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('url-formatter'),
      router = express.Router();

  plugin.description = {
    text: '格式地址'
  };

  plugin.defaultSettings = {};

  plugin.router = express.Router();

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
      
      next();
    });
  });
}
