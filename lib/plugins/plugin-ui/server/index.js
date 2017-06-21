var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    hbs           = require('hbs'),
    webpackConfig = require('../webpack.config.js'),
    routes        = require('./routes'),
    webpackMiddleware,
    webpackHotMiddle,
    complier,
    router,
    app;


webpackMiddleware = require('webpack-dev-middleware');
webpackHotMiddle  = require("webpack-hot-middleware");
complier          = webpack(webpackConfig, function () {});
app               = express();
router            = express.Router();

app.use(router);
app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// router.use(webpackHotMiddle(complier, {
//   log: console.log, path: '/__webpack_hmr', 
//   heartbeat: 10 * 1000
// }));

router.use(webpackMiddleware(complier, {
  publicPath: webpackConfig.output.publicPath,
  serverSideRender: true
}));

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