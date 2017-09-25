const Koa = require('koa');

// extensions
const nedb        = require('./extensions/nedb');
const http        = require('./extensions/http');
const forger      = require('./extensions/forger');
const tunnel      = require('./extensions/tunnel');
const settings    = require('./extensions/settings');
const initialize  = require('./extensions/initialize');


module.exports = async function (options) {
  const app = new Koa();

  options = options || {};

  app.extension = async (extension) => {
    if (typeof extension == 'function') {
      await extension(app, options);
    }
  };

  await app.extension(initialize);
  await app.extension(nedb);
  await app.extension(settings);
  await app.extension(forger);
  await app.extension(tunnel);
  await app.extension(http);

  return app;
}