var proto,
    http    = require('http'),
    cert    = require('./cert'),
    midway  = require('./midway'),
    service = require('./service'),
    Tunnel  = require('./tunnel');

proto         = module.exports;
proto.service = service
proto.midway  = midway;
proto.cert    = cert;
proto.Tunnel  = Tunnel;

proto.purityTunnel = function (hostname) {
  var besideAltnames = this.config('besideAltnames');

  if (!besideAltnames) {
    this.config('besideAltnames', besideAltnames = []);
  }

  if (besideAltnames.indexOf(hostname) > -1) {
    return true;
  }

  return false;
}
