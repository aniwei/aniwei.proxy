var os = require('os');

module.exports = function (req, res) {
  var app     = req.app,
      setting = app.setting,
      plugins = app.plugins,
      plugin  = app.plugin,
      lastStep;

  lastStep = plugin.get('the last step');

  if (lastStep) {
    plugin.set('the last step', undefined);

    return res.redirect(lastStep);
  }

  res.render('index', {
    timestamp: + new Date(),
    initState: JSON.stringify({
      port: setting.get('proxy-port-number'),
      ip: network(),
      hostname: setting.get('project'),
      extension: plugins.json().listing
    })
  });
}

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