const Emitter = require('events').EventEmitter;
const urlParser = require('url');
const https = require('https');
const net = require('net');

const manager = require('./manager');

const noop = (() => {});


module.exports = function (app, options) {
  const { forger } = app;


  return async function (req, socket, head, app) {
    const url = urlParser.parse('aniwei://' + req.url);

    const tun  = manager.get(req, socket, head ,app);
    let cert = forger.get(url.hostname);

    if (cert === undefined) {
      const res = await tun.sniff();

      cert = forger.forge(res);
    } 

    tun.serve(cert);
  }
}

