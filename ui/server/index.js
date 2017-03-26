var express  = require('express'),
    path     = require('path'),
    fs       = require('fs'),
    Mustache = require('mustache');

module.exports = function (root) {
  var app     = express(),
      router  = require('./app'),
      store   = root.store,
      water   = root.water;

  app.code    = require('./common/code');
  app.format  = require('./common/format') ;
  app.root    = root;

  app.use(uiRouter(store));
  app.use(router);

  if (process.env.NODE_ENV == 'dev') {
    dev(app, water);
  }

  return app;
}

function uiRouter (store) {
  var router     = express.Router(),
      components = store.get('components'),
      isMake     = false,
      componentsName,
      currentName,
      plistPath,
      plistData,
      plistName,
      list;

  plistPath = path.join(__dirname, 'ui.plist');
  jsxPath   = path.join(__dirname, './app/ui/classes.jsx');
  jsxTpl    = [
    '{{#components}}',
    'import {{name}} from \'{{&uri}}\';',
    '{{/components}}',
    '\n',
    'export default {',
    '{{#components}}',
    '\t{{name}},',
    '{{/components}}',
    '}'
  ].join('\n');

  if (fs.existsSync(plistPath)) {
    plistData = plist.parse(fs.readFileSync(plistPath).toString()) || {};
    plistName = Object.keys(plistData).sort().join(',');
  }

  router.use(function (req, res, next) {
    var cmps, 
        jsx;

    if (isMake) {
      return next();
    }

    if (!componentsName) {
      componentsName = Object.keys(components).filter(function (name) {
        var cmp   = components[name],
            brief = cmp.brief || {},
            cmpPath;

        if (brief.uri) {
          cmpPath = path.join(brief.uri, 'ui');

          if (fs.existsSync(cmpPath)) {
            return true;
          }
        }
      });

      currentName  = componentsName.sort().join(',');
    }

    isMake = currentName == plistName;

    if (!isMake) {
      cmps = {};
      jsx  = [];

      componentsName.forEach(function (name) {
        var cmp     = components[name],
            brief   = cmp.brief;

        jsx.push({
          name: brief.className,
          uri:  path.join(brief.uri, 'ui')
        });

        cmps[name] = cmp;
      });

      fs.writeFileSync(plistPath, plist.build(cmps));
      fs.writeFileSync(jsxPath, Mustache.render(jsxTpl, {
        components: jsx
      }));

      isMake = true;
    }

    next();
  });

  return router;
}

function dev (app, water) {
  var server    = require('./app/webpack.config.js'),
      urlParser = require('url'),
      net       = require('net'),
      port      = 8887;

  server.listen(port);

  app.set('webpackServerPort', port);

  water.fall(function (done, req, socket, head) {
    var url = urlParser.parse('aniwei://' + req.url),
        sock;

    if (url.hostname == 'localhost' || url.hostname == '127.0.0.1') {
      if (parseInt(url.port) === 9091) {
        sock = net.connect(url.port, url.hostname, function () {
          socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
          socket.write(head);

          sock.pipe(socket);
        });

        socket.pipe(sock);

        return this;
      }
    }

    done();
  });
}
