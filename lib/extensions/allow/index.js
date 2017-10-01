const Router = require('koa-router');
const Allow  = require('./allow');

module.exports = async function (app, options) {
  const { nedb } = app;
  const store    = new debd('allow');
  const router   = Router();

  app.allow = async function (factory) {    
    await factory.call(plugin, manager, app, store);

    const plg = new Allow(plugin);

    manager.set(plg);
  };
}