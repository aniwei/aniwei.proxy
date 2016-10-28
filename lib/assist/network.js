var os = require('os');

module.exports = function () {
  var nw = os.networkInterfaces()['en0'] || [],
      ip;

  if (nw.some(function(n){
    if(n.family.toLowerCase() == 'ipv4') {
      return ip = n
    }
  })) {
    return ip.address
  }

  return '127.0.0.1'
}
