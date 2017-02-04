import express from 'express';
import getssl from './getssl';


const router = express.Router();


router.get('/aniwei.proxy-ssl.pem', getssl);
router.get('/', function (req, res) {
  const app   = req.app,
        root  = app.root;

  const initialState = root.store.all();

  res.send(
    `
    <!doctype html>
    <html>
      <head>
        <title>Fie Proxy</title>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState, null, 2)}

          ;new WebSocket('ws://127.0.0.1:8888');
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script src="http://127.0.0.1:${initialState.webpackServerPort}/dist/app.js"></script>
    </html>
    `
  );
});

export default router;

