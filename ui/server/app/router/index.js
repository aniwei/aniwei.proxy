import express from 'express';
import getssl from './getssl';


const router = express.Router();


router.get('/aniwei.proxy-ssl.pem', getssl);
router.get('/', function (req, res) {
  const app   = req.app,
        root  = app.root,
        env   = process.env.NODE_ENV;

  const initialState = root.store.all();
  let   port         = app.get('webpackServerPort');
  
  if (!(env == 'dev')) {
    port = 8888; 
  }


  res.send(
    `
    <!doctype html>
    <html>
      <head>
        <title>aniwei.proxy</title>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState, null, 2)}
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script src="http://127.0.0.1:${port}/dist/app.js"></script>
    </html>
    `
  );
});

export default router;

