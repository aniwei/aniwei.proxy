var urlParser = require('url'),
    express   = require('express'),
    assign    = require('lodash').assign,
    router    = express.Router(),
    proto


module.exports = function (pluginManager) {
  var plugin = new pluginManager.Plugin('server-error'),
      router = express.Router();

  plugin.description = {
    text: 'Server Error'
  };

  plugin.defaultSettings = {};

  plugin.router = express.Router();

  plugin.router.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;

    next(err);
  });

  plugin.router.use(function(err, req, res, next){

    res.locals.message = err.message;

    res.locals.error = err;

    res.status(err.status || 500);
    res.send(htmlRender(err));
  });
}

function htmlRender (error) {
  return [
    '<html>' +
      '<head>',
        '<title>',
           error.message + ' - ' + error.status,
        '</title>',
        '<style>',
          'body {padding: 50px;font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;}',
        '</style>',
      '</head>',
      '<body>',
        '<h1>',
          error.message,
        '</h1>',
        '<h2>',
          error.status,
        '</h2>',
        '<pre>',
          error.stack,
        '</pre>',
      '</body>',
    '</html>'
  ].join('');
}