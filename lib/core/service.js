var proto,
    Tunnel = require('./tunnel');

proto = module.exports = function (hostname, port, req, sock, head) {
  var keyName     = hostname + ',' + port,
      credential  = this.credentials,
      requestion  = this.requestion,
      soc,
      tunnel,
      server;

  tunnel = Tunnel.get(hostname, port);
  tunnel.keep(req, sock, head);

  if (this.purityTunnel(hostname)) {
    return tunnel.run();
  }

  tunnel.visit(serve)

  function serve(res){
    var cert = credential.publicToPem(credential(res || {}, hostname)),
        key  = credential.pemKey,
        tunnel,
        dns;

    if (res) {
      dns = Tunnel.altname(res.subjectaltname);
    }

    if (dns) {
      if (dns.length > 0) {
        this.dns = this.dns.concat(dns);
      }
    }

    try {
      tunnel = this.serve(cert, key)
    } catch (e) {
      cert = credential.publicToPem(credential({}, hostname, dns))
      tunnel = this.serve(cert, key)
    }

    tunnel.httpsServer.on('request', requestion)
  }
}
