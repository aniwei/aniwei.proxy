const Koa = require('koa');

// extensions
const nedb     = require('./extensions/nedb');
const http     = require('./extensions/http');
const settings = require('./extensions/settings');
const forger   = require('./extensions/forger');
const tunnel   = require('./extensions/tunnel');


module.exports = async function (options) {
  const app = new Koa();


  app.extension = async function (extension) {
    if (typeof extension == 'function') {
      await extension(app, options);
    }
  };

  await app.extension(settings);
  await app.extension(forger);
  await app.extension(tunnel);
  await app.extension(nedb);
  await app.extension(http);

  return app;
}