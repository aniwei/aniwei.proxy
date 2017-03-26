var EventEmitter = require('events').EventEmitter,
    urlParser    = require('url'),
    https        = require('https'),
    net          = require('net'),
    forge        = require('./forge'),
    noop         = function () {},
    tunnelsManager;

tunnelsManager = {
  tunnelsTable: [],
  lsTable: {},
  altnameTable: {},

  get: function (req, sock, head, app) {
    var url     = urlParser.parse('aniwei://' + req.url),
        table   = this.tunnelsTable,
        ls      = this.ls(url.hostname),
        tunnel,
        res;

    res = table.some(function (tun) {
      var dns = tun.dns;

      if (dns.length > 0) {
        tunnel = tun;

        return ls.some(function (host) {
          return dns.indexOf(host) > -1;
        });
      }
    });

    if (!res) {
      tunnel = this.create(url.hostname, url.port);

      tunnel.on('request', app);
    }

    tunnel.keep(req, sock, head);

    return tunnel;
  },

  create: function (hostname, port) {
    var tunnel = new Tunnel(hostname, port);

    this.tunnelsTable.push(tunnel);

    return tunnel;
  },

  ls: function (hostname) {
    var res   = [hostname],
        ls;

    if (hostname in this.lsTable) {
      return this.lsTable[hostname];
    }

    ls = (hostname || '').split('.')
    this.lsTable[hostname] = res.concat(ls.map(function (piece, i) {
      ls[i] = '*';

      return ls.join('.');
    }));

    return res;
  }
};

module.exports = function (req, socket, head, app) {
  var url    = urlParser.parse('aniwei://' + req.url),
      tunnel = tunnelsManager.get(req, socket, head, app);

  tunnel.visit(certificate.exists(url.hostname), function (res, hostname, port) {
    tunnel.serve(certificate.forge(res, tunnel.dns, hostname));
  });
}

function Tunnel (hostname, port) {
  this.hostname     = hostname;
  this.port         = port     || 443;
  this.connected    = false;
  this.visited      = false;
  this.connections  = [];
  this.protocol     = 'https:';
  this.dns          = [hostname];
  this.configure    = {
    port:     port,
    hostname: hostname,
    protocol: 'https:'
  }
}

Tunnel.prototype.__proto__ = EventEmitter.prototype;

Tunnel.prototype.altname = function (altname) {
  var signal = 'DNS:',
      subject;

  this.dns = this.dns.concat((altname || '').split(',').filter(function(alt){
    return alt.indexOf(signal) > -1;
  }).map(function(alt){
    return alt.replace(signal, '').trim();
  }));

  return this;
}

// 获取证书信息
Tunnel.prototype.visit = function (data, callback) {
  var that = this,
      req;

  if (this.visited) {
    return this;
  }

  this.visited = true;

  if (data) {
    return this.serve(data);
  }

  callback = (callback || noop).bind(this);

  req          = https.request({
    hostname: this.hostname,
    port:     this.port,
    path:     '/',
    method:   'HEAD'
  }, (function(res){
    var socket = res.socket,
        peer;

    if (socket.getPeerCertificate) {
      peer = socket.getPeerCertificate(true);

      this.altname(peer.subjectaltname);
    }

    callback(peer, this.hostname, this.port);
  }).bind(this));

  req.end();

  return this;
}

// 关闭服务
Tunnel.prototype.close = function () {
  if(this.httpsServer){
    this.httpsServer.close();
  }

  return this;
}

// 创建服务器
Tunnel.prototype.serve = function (options) {
  var server,
      emit   = this.emit,
      that   = this;

  this.configure = {
    hostname: '127.0.0.1',
    port:     0,
    protocol: this.protocol
  };

  options = options || {};

  server = https.createServer({
    key:   options.key,
    cert:  options.cert
  });

  server.setTimeout(0);

  server.listen(0,(function(){
    var addr = server.address();

    this.configure.port = addr.port;
  }).bind(this));

  server.on('listening', (function(){
    this.run();
  }).bind(this));

  server.on('request', (function (req, res) {
    this.emit('request', req, res);
  }).bind(this));

  server.on('clientError', (function (err, socket) {
    //debugger;

  }).bind(this));

  server.on('checkExpectation', (function (req, res) {
    debugger;
  }).bind(this));

  server.on('checkContinue', (function (req, res) {
    debugger;
  }).bind(this));

  server.on('error', function () {
    debugger;
  })


  this.httpsServer = server;

  return this
}

Tunnel.prototype.keep = function(req, soc, head){
  if (this.connected) {
    return this.connect(req, soc, head);
  }

  this.connections.push({
    request:  req,
    socket:   soc,
    head:     head
  });

  return this;
}

Tunnel.prototype.connect = function (req, sock, head) {
  var text      = 'HTTP/1.1 200 Connection Established\r\n\r\n',
      that      = this,
      config    = this.configure,
      emit      = this.emit,
      soc;

  soc = net.connect(config.port, config.hostname, function(){
    sock.write(text);
    sock.write(head);

    soc.pipe(sock);
  });

  // soc.on('data', function (data) {
  //   console.log(data.toString())
  // });

  // sock.on('data', function (data) {
  //   console.log(data.toString())
  // });

  sock.pipe(soc);
}

Tunnel.prototype.run = function () {
  var service = this.connections || [],
      el;

  while(el = service.pop()){
    this.connect(el.request, el.socket, el.head);
  }

  this.connected = true;

  return this;
}
