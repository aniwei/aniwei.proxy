import http from 'http';

export default function (app, options) {
  const server = http.createServer();

  // http
  server.on('request', app.callback());

  // https socket
  server.on('connect', function (req, soc, head) {
    // 
    // water.run([req, soc, head, app], function () {
    //   tunnel(req, soc, head, app);
    // });
  });

  app.listen = async function (port) {
    port = port || options.port || process.env.PROXY_PORT || 888;

    return new Promise((accept, reject) => {
      server.listen(port, () => {
        accept();
      });
    });
  }

  app.server = server;
}