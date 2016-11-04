var os = require('os');

module.exports = function () {
  var nw    = os.networkInterfaces(),
      local = '127.0.0.1',
      ip;

  Object.keys(nw).some(function (key) {
    var list = nw[key] || [];

    if (list.some(function (n) {
      var family;
      if (family = n.family) {
        if (family.toLowerCase() == 'ipv4') {
          if (!(n.address == local)) {
            return ip = n;
          }
        }
      }
    })) {
      return ip;
    }
  });


  if (ip) {
    return ip.address || local;
  }

  return local
}
