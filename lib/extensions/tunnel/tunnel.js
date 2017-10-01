const EventEmitter = require('events').EventEmitter;
const https        = require('https');
const net          = require('net');

const Tunnel = module.exports = function (hostname, port) {
  this.hostname     = hostname;
  this.port         = port     || 443;
  this.sniffing     = 0;
  this.dnses        = [ hostname ];
  this.list         = [];
  this.protocol     = 'https:';
  this.target       = {
    port,
    hostname: '127.0.0.1',
    protocol: this.protocol
  }
};

Tunnel.prototype = {
  __proto__: EventEmitter.prototype,

  setAltName (altnames) {
    const signal = 'DNS:';
    const dnses  = this.dnses;
    let subject;

    altnames = altnames || '';
    
    this.dnses = dnses
      .concat(altnames.split(','))
      .filter(alt => alt.indexOf(signal) > -1)
      .map(alt => alt.replace(signal, '').trim());
  },

  async sniff (data) {
    this.sniffing = 1;

    const sniff = () => {
      return new Promise((accept, reject) => {
        const url = `https://${this.hostname}:${this.port}`;

        const req = https.get(url, (res) => {
          const soc = res.socket;
          let peer;
            
          if ('getPeerCertificate' in soc)  {
            peer = soc.getPeerCertificate(true);
  
            this.setAltName(peer.subjectaltname);
          }
  
          accept(peer);
        });

        req.end();
      });
    }

    return await sniff();
  },

  async serve (options) {
    options = options || {
      key : this.key,
      cert: this.cert
    };

    const target = this.target;
    const { key, cert } = options;

    const server = https.createServer({ key, cert });
    this.server  = server;
    
    server.setTimeout(0);

    const port = await new Promise((accept, reject) => {

      server.listen(0, () => target.port = server.address().port);
      server.on('listening', () => {
        accept();
      });
    });

    server.on('clientError', () => {});
    server.on('checkExpectation', () => {});
    server.on('checkContinue', () => {});
    server.on('error', () => {});

    server.on('request', (req, res) => {
      this.emit('request', req, res);
    })

    this.run();
  },

  connect (req, sock, head) {
    const text   = 'HTTP/1.1 200 Connection Established\r\n\r\n';
    const target = this.target;
    const soc    = net.connect(target.port, target.hostname, () => {
      sock.write(text);
      sock.write(head);
      soc.pipe(sock);
    });
    
    sock.pipe(soc);
  },

  keep (req, soc, head) {
    this.list.push({
      request:  req,
      socket:   soc,
      head:     head
    });
    
    return this;
  },

  close () {
    this.server.close();
  },

  run () {
    const list = this.list || [];
    let el;
  
    while(el = list.pop()){
      this.connect(el.request, el.socket, el.head);
    }
    
    this.keep = function () {
      if (this.connecting) {
        return this.connect(req, soc, head);
      }
    }

    this.sniffing = 2;
    
    return this;
  }
};
  