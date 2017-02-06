export default function htmlPage (html, initialState) {
   return  `
    <!doctype html>
    <html>
      <head>
        <title>aniwei.proxy</title>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState, null, 2)}

          ;new WebSocket('ws://127.0.0.1:8888');
        </script>
        <script src="/dist/app.js"></script>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
    `
}