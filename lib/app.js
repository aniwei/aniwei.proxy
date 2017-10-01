const Koa = require('koa');

// extensions
const nedb        = require('./extensions/nedb');
const http        = require('./extensions/http');
const tunnel      = require('./extensions/tunnel');
const plugin      = require('./extensions/plugin');
const forger      = require('./extensions/forger');
const control     = require('./extensions/control');
const settings    = require('./extensions/settings');
const initialize  = require('./extensions/initialize');

const noop = (() => {});

const createApplication = async function (options, callback) {
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
  await app.extension(control);
  await app.extension(http);
  await app.extension(plugin);

  await app.plugin(require('./plugins/formatter'));

  process.on('uncaughtException', (err) => {
    switch (err.code) {
      case 'ETIMEDOUT':
      case 'ECONNREFUSED':
      case 'ECONNRESET':
      case 'HPE_INVALID_CONSTANT':
        break;
    }
  });
}

module.exports = createApplication;
