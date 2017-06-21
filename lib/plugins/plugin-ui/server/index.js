var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    hbs           = require('hbs'),
    urlParser     = require('url'),
    webpackConfig = require('../webpack.config.js'),
    routes        = require('./routes'),
    env           = process.env.NODE_ENV,
    // 编译状态
    // 0: 未开始
    // 1: 启动编译
    // 2：编译完成
    complieState  = 0,
    complieProgress,
    webpackMiddleware,
    webpackHotMiddle,
    complieRouter,
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


router.get('/complie-state', function (req, res, next) {
  return res.json({
    code: 0,
    state: complieState
  });
});

router.use(function (req, res, next) {
  var app        = req.app,
      plugins    = app.plugins,
      setting    = app.setting,
      urlParsed  = urlParser.parse(req.url);

  if (complieState === 2) {
    if (complieRouter) {
      return complieRouter(req, res, next);
    }
  }

  if (app.local(urlParsed)) {
    if (urlParsed.pathname === '/') {
      if (env === 'dev') {
        if (complieState === 0) {
          complier = complier = complierFactory(webpackConfig, function (err, state) {
            complieState = 2;
            plugins.updated();
          });

          if (!complieRouter) {
            complieRouter = webpackMiddleware(complier, {
              publicPath: webpackConfig.output.publicPath
            });
          }

          complieState = 1;          
        }

        if (complieState === 1) {
          return res.render('compiling');
        }
      } else {
        if (plugins.isNew()) {
          if (complieState === 0) {
            complier = complierFactory(webpackConfig, function (err, state) {
              complieState = 2;
              plugins.updated();
            });

            complieState = 1;
          }

          if (complieState === 1) {
            return res.render('updating');
          } 
        }
      }
    }
  }

  next();
});

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

