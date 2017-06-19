var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    hbs           = require('hbs'),
    webpackConfig = require('../webpack.config.js'),
    routes        = require('./routes'),
    webpackMiddleware,
    webpackHotMiddle,
    router,
    app;

webpackMiddleware = require('webpack-dev-middleware');
webpackHotMiddle  = require("webpack-hot-middleware");
app               = express();
router            = express.Router();

app.use(router);
app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


router.use(function (req, res, next) {
  var app        = req.app,
      plugins    = app.plugins,
      router     = express.Router(),
      isComplied = false;

  if (plugins.isUpdated()) {
    complier = webpack(webpackConfig, function () {
      isComplied = true;
    });

    if (process.env.NODE_ENV == 'dev') {
      webpackMiddleware(complier, {
        publicPath: webpackConfig.output.publicPath
      })(req, res, next);
    } else {
      
    }
  } else {
    next();
  }
});

if (process.env.NODE_ENV == 'dev') {
  complier = webpack(webpackConfig, function () {});

  router.use(webpackMiddleware(complier, {
    publicPath: webpackConfig.output.publicPath
  }));
} else {
  router.use(function (req, res, next) {
    complier = webpack(webpackConfig, function (err, state) {
      if (err) {
        throw err;
      }

      next();
    });
  });
}


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
      status: err.status || 5000,
      stack: err.stack
  });
});

module.exports = app;