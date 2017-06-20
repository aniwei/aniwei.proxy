var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    hbs           = require('hbs'),
    webpackConfig = require('../webpack.config.js'),
    routes        = require('./routes'),
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

router.get('/complie-progress', function (req, res) {
  if (complieState === 1) {
    return res.send({
      code: 0,
      progress: complieProgress
    });
  }

  res.send({
    code: 1000,
    progress: {}
  })
})

router.use(function (req, res, next) {
  var app        = req.app,
      plugins    = app.plugins;

  // 有更新扩展
  if (process.env.NODE_ENV != 'dev' && plugins.isNew()) {
    // extension(plugins.listing());

    if (complieState === 0) {
      complier = complierFactory(webpackConfig, function () {
        complieState = 2;
        plugins.updated();
      });

      complieState = 1;
    }

    if (complieState < 2) {
      return res.render('updating');
    } 

    return next();
  }

  // 如果是开发环境
  if (process.env.NODE_ENV == 'dev') {
    // extension(plugins.listing());

    if (complieState === 0) {
      complier = complier = complierFactory(webpackConfig, function () {
        complieState = 2;
        plugins.updated();
      });

      complieState = 1;

      if (!complieRouter) {
        complieRouter = express.Router();

        complieRouter.use(webpackMiddleware(complier, {
          publicPath: webpackConfig.output.publicPath
        }));
      }
    }

    if (complieState < 2) {
      return res.render('compiling');
    }

    return complieRouter.handle(req, res, next);
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

