const Router  = require('koa-router');
const compose = require('koa-compose');

module.exports = async function (app, options) {
  const { tunnel } = app;
  const router     = Router();

  app.ctrl = function (...args) {
    return router.use(...args);
  }

  app.ctrl.dispatch = function (ctx) {
    const func = compose([
      router.allowedMethods(),
      function (ctx) {
        tunnel(ctx.req, ctx.socket, ctx.head);
      },
    ]);

    ctx.status = 200;

    func(ctx);
  }
}