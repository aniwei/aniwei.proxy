const http    = require('http');

module.exports = async function (app, options) {
  const { pipe }  = app;
  const server    = http.createServer();
  const port      = await app.get('port');

  // http
  server.on('request', app.callback());

  // https socket
  server.on('connect', function (req, soc, head) {
    app.ctrl.dispatch({
      req,
      socket: soc,
      head
    });
  });

  server.listen(port);

  app.server = server;
}