const Emitter   = require('events').EventEmitter;
const urlParser = require('url');
const https     = require('https');


const Tunnel    = require('./tunnel');

const noop = (() => {});
const type = {
  HOSTNAME_LIST: 'HOSTNAME_LIST',
  TUNNEL_LIST:   'TUNNEL_LIST'
};

module.exports = function (app, options) {
  const { forger, nedb } = app;
  const store = new nedb('tunnel');

  const manager = {
    tunnels: [],

    async getHostnameList (hostname) {
      const res = await store.findOne({
        type: type.HOSTNAME_LIST,
        hostname
      });

      if (res) {
        return res.list;
      }

      hosts = (hostname || '').split('.');

      let list = [hostname];

      list = list.concat(hosts.map((pie, i) => {
        hosts[i] = '*';

        return hosts.join('.');
      })).slice(0, -2);

      await store.insert({
        type: type.HOSTNAME_LIST,
        hostname,
        list
      });

      return list;
    },

    async getTunnel (req, sock, head) {
      const url     = urlParser.parse(`aniwei://${req.url}`);
      const tunnels = this.tunnels;
      const list    = await this.getHostnameList(url.hostname);
      let tunnel;
      
      const exist = tunnels.some((tun) => {
        const dnses = tun.dnses;

        tunnel = tun;

        return list.some(host => dnses.indexOf(host) > -1);
      });

      if (!exist) {
        tunnel = this.create(url.hostname, url.port);
        tunnel.on('request', app.callback());
      }

      tunnel.keep(req, sock, head);

      return tunnel;
    },

    create (hostname, port) {
      const tun = new Tunnel(hostname, port);

      this.tunnels.push(tun);

      return tun;
    },
  }

  app.tunnel = async function (req, socket, head, app) {
    const url = urlParser.parse('aniwei://' + req.url);

    const tun  = await manager.getTunnel(req, socket, head ,app);

    switch (tun.sniffing) {
      case 0:
        let cert = await forger.get(url.hostname);

        if (cert === undefined) {
          const peer = await tun.sniff();

          pem = await forger.set(peer, tun.dnses, tun.hostname);
          
          tun.serve({
            key: pem.privatePem,
            cert: pem.publicPem
          });
        }
        break;
    }

    return tun;
  }
}

