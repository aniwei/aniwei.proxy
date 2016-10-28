var EventEmitter = require('events').EventEmitter,
    https        = require('https'),
    net          = require('net'),
    slice        = [].slice,
    defer,
    toArgv;

module.exports = Tunnel;

defer = typeof setImmediate === 'function'
  ? setImmediate
  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

toArgv = function (argv, head) {
  var res = slice.call(argv);

  res.unshift(head);

  return res;
}

function Tunnel (hostname, port) {
  this.hostname     = hostname;
  this.port         = port     || 443;
  this.connected    = false;
  this.visited      = false;
  this.connections  = [];
  this.protocol     = 'https:';
  this.dns          = [hostname];
  this.tunnelConfig = {
    port:     port,
    hostname: hostname,
    protocol: 'https:'
  }
}

Tunnel.prototype.__proto__ = EventEmitter.prototype;

// 获取证书信息
Tunnel.prototype.visit = function (callback) {
  var that = this,
      req

  if (this.visited) {
    return this;
  }

  this.visited = true;

  var t = new Date;

  req = https.request({
    hostname: this.hostname,
    port:     this.port,
    path:     '/',
    method:   'HEAD'
  },function(res){
    var socket = res.socket,
        peer;

    if (socket.getPeerCertificate) {
      peer = socket.getPeerCertificate(true);
    }

    if (typeof callback == 'function') {
      callback.call(that, peer);
    }
  });

  req.on('error',function(err){
    that.emit('visit.error', err);
  })

  req.end();

  this.closed = false;

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
Tunnel.prototype.serve = function (cert, key) {
  var server,
      emit   = this.emit,
      that   = this;

  this.tunnelConfig = {
    hostname: '127.0.0.1',
    port:     0,
    protocol: this.protocol
  }

  server = https.createServer({
    key:   key,
    cert:  cert
  });

  server.setTimeout(0);

  server.listen(0,function(){
    var addr = server.address();

    that.tunnelConfig.port = addr.port;
  });

  server.on('listening', function(){
    that.run();
  });

  ['listening', 'close', 'error', 'request', 'connect'].forEach(function(type){
    server.on(type, function(){
      emit.apply(that, toArgv(arguments, 'server.' + type));
    });
  });

  this.httpsServer = server;

  return this
}

Tunnel.prototype.keep = function(request, socket, head){
  if (this.connected) {
    return this.connect(request, socket, head);
  }

  this.connections.push({
    request:  request,
    socket:   socket,
    head:     head
  });

  return this;
}

Tunnel.prototype.connect = function (req, sock, head) {
  var text      = 'HTTP/1.1 200 Connection Established\r\n\r\n',
      that      = this,
      tunnel    = this.tunnelConfig,
      emit      = this.emit,
      soc;

  soc = net.connect(tunnel.port, tunnel.hostname, function(){
    sock.write(text);
    sock.write(head);

    soc.pipe(sock);
  });

  ['error', 'close'].forEach(function(type){
    soc.on(type, function () {
      emit.apply(that, toArgv(arguments, 'connect.' + type))
    });
  });

  sock.pipe(soc);
}

Tunnel.altname = function (subjectAltName) {
  var altname,
      dns    = [],
      alts   = [],
      signal = 'DNS:',
      subject;

  subjectAltName = subjectAltName || '';
  subject        = subjectAltName.split(',');

  altname = subject.filter(function(alt){
    if(alt.indexOf(signal) > -1){
      return true
    }
  }).map(function(alt){
    var alt = alt.replace(signal, '').trim()

    return alt;
  });

  if (altname.length > 0) {
    return altname;
  }
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


// tunnel cache array
Tunnel.tunnels = [];

Tunnel.createTunnel = function(hostname, port){
  return new Tunnel(hostname, port)
}

Tunnel.enumerate = function (hostname) {
  var enumeration = [hostname],
      host        = hostname.split('.');

  host.forEach(function(piece, i){
      host[i] = '*';
      enumeration.push(host.join('.'));
  });

  return enumeration;
}

Tunnel.get = function (hostname, port) {
  var tunnel,
      tunnels   = Tunnel.tunnels,
      enumerate = Tunnel.enumerate(hostname);

    if (tunnels.some(function(t) {
      var dns = t.dns;

      if (dns) {
        if (dns.length > 0) {
          tunnel = t;

          if(enumerate.some(function(host){
            if(dns.indexOf(host) > -1){
              return true;
            }
          })) {
            return true;
          }
        }
      }
    })) {
      if (tunnel) {
        return tunnel;
      }
    }

    tunnel = Tunnel.createTunnel(hostname, port);
    Tunnel.tunnels.push(tunnel);

    return tunnel;
}
