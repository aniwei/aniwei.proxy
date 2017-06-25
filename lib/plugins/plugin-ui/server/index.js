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

function complierFactory (config, done) {
  var list = 'watch-run compile done'.split(' '),
      complier;

  complieProgress = {
    steps: list.length,
    current: 0,
    text: '',
  };

  complier = webpack(config, done);

  // list.forEach(function (evt, i) {
  //   complier.plugin(evt, function () {
  //     console.log(evt);
  //     complieProgress.text    = evt;
  //     complieProgress.current = i;
  //   });
  // });
  
  return complier;
}