export default function htmlPage (html, initialState) {
   return  `
    <!doctype html>
    <html>
      <head>
        <title>Fie Proxy</title>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState, null, 2)}
        </script>
        <script src="/dist/app.js"></script>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
    `
}