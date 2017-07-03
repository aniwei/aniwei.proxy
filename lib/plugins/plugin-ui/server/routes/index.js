var express      = require('express'),
    qs           = require('query-string'),
    urlParser    = require('url'),
    path         = require('path'),
    domainParser = require('domain-name-parser'),
    os           = require('os'),
    request      = require('request'),
    router       = express.Router();


module.exports = router;

router.get('/last-step', function (req, res) {
  var plugin = req.app.plugin;

  plugin.set('the last step', req.query.url);
  plugin.save();

  res.json({
    code: 0
  });
});

router.get('/ico', function (req, res, next) {
  var app = req.app,
      url = req.query.url,
      domainParsed,
      urlParsed,
      requ,
      err;

  if (url) {
    urlParsed    = urlParser.parse(url);
    domainParsed = domainParser(url);

    requ = request({ 
      url:  urlParsed.protocol + '//www.' + domainParsed.domain + '/favicon.ico' 
    });

    requ.on('error', function () {
      res.sendfile(path.join(__dirname, '../ico/favicon.ico'));
    });

    return requ.on('response', function (resp) {
      var code = resp.statusCode;

      if (code === 200 || code === 304) {
        return requ.pipe(res);
      }

      res.sendfile(path.join(__dirname, '../ico/favicon.ico'));
    });
  }

  err         = new Error('Not Found');
  err.status  = 404;

  next(err);
});

router.get('/', require('./render'));

router.get('/ssl.crt', function (req, res) {
  var app     = req.app,
      forger  = app.forger;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(new Buffer(forger.get('root').cert));
});

router.use('/resource', function (req, res) {
  var app   = req.app,
      body  = req.body,
      query = req.query,
      url,
      type;

  url   = query.url || body.url;
  data  = body.data;

  if (url) {
    return request({
      url, 
      form: data
    })
    .pipe(res);
  }

  next();  
});