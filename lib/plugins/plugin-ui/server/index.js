require('babel-register')({
  ignore: function (filename) {
    if (
      filename.indexOf('controls-context') > -1 ||
      filename.indexOf('plugin-ui/server/routes') > -1 ||
      filename.indexOf('plugin-ui/src') > -1
    ) {
      return false
    }

    return true;
  }
});

var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    hbs           = require('hbs'),
    urlParser     = require('url'),
    webpackConfig = require('../webpack.config.js'),
    routes        = require('./routes'),
    complie       = require('./complie');

webpackMiddleware = require('webpack-dev-middleware');
webpackHotMiddle  = require("webpack-hot-middleware");
app               = express();
router            = express.Router();

app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(router);

router.use(complie);
router.use(express.static(path.join(__dirname, '..' ,'static')));
router.use(routes);

router.use(function(req, res, next){
  var err = new Error('Not Found');
  
  err.status = 404;

  next(err);
});

router.use(function(err, req, res, next){
  
  res.render('error', {
      message: err.message,
      status: err.status || 500,
      stack: err.stack
  });
});

module.exports = app;