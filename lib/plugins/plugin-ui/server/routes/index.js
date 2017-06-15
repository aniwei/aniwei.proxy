var express = require('express'),
    qs      = require('query-string'),
    os      = require('os')
    request = require('request'),
    router  = express.Router();


module.exports = router;

router.get('/', function (req, res) {
  var app     = req.app,
      setting = app.setting;

  res.render('index', {
    timestamp: + new Date(),
    initState: JSON.stringify({
      port: setting.get('proxy-port-number'),
      ip: network(),
      hostname: setting.get('project')
    })
  });
});

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

// 获取本机ip
function network () {
  var ni    = os.networkInterfaces(),
      keys  = Object.keys(ni),
      local = '127.0.0.1',
      handle,
      ip;

  handle = function (n) {
    var family  = (n.family || '').toLowerCase(),
        address = n.address;

    if (family == 'ipv4') {
      if (!(address == local)) {
        return ip = address;
      }
    }
  }

  keys.some(function (name) {
    var ls = ni[name] || [];

    if (ls.length > 0) {
      return ls.some(handle);
    }
  });

  return ip || local;
}
