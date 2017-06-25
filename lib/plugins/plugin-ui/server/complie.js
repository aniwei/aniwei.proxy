var express           = require('express'),
    webpack           = require('webpack'),
    urlParser         = require('url'),
    webpackMiddleware = require('webpack-dev-middleware'),
    // webpackHotMiddle  = require("webpack-hot-middleware"),
    ProgressPlugin    = require('webpack/lib/ProgressPlugin'),
    webpackConfig     = require('../webpack.config.js'),
    routes            = require('./routes'),
    env               = process.env.NODE_ENV,
    router            = express.Router(),
    complie;

module.exports = function (req, res, next) {
  if (complie === undefined) {
    complie = new Complie(webpackConfig, env);  
  }
  
  complie.handle(req, res, next);
}

function Complie (config, env) {  
  this.env            = env;    
  this.config         = config;
  this.progress       = { percent: 0, message: 'Not started.' };
  
  this.routing = (function (req, res, next) {
    this.onRouting(req, res, next);
  }).bind(this);

  this.get('/ui/complie-progress', (function (req, res, next) {
    res.json({
      code: 0,
      progress: this.progress
    });
  }).bind(this));

  this.use(this.routing.bind(this));
}

Complie.prototype = {
  __proto__: router,
  
  onComplied: function () {
    this.onRouting = this.nextRouter;
  },

  createComplier: function () {
    if (this.complier === undefined) {
      this.progressPlugin = new ProgressPlugin(this.onProgressing.bind(this));
      this.complier       = webpack(this.config, this.onComplied.bind(this));

      this.complier.apply(this.progressPlugin);
      
      this.nextRouter     = this.env == 'dev' ? webpackMiddleware(this.complier, {
        publicPath: this.config.output.publicPath
      }) : function (req, res, next) { next () };
    }
  },

  onProgressing: function (percent, message) {
    console.log((percent * 100) + '%', message);

    this.progress = {
      percent: percent,
      message: message
    };
  },

  onRouting: function (req, res, next) {
    var app        = req.app,
        plugins    = app.plugins,
        setting    = app.setting,
        urlParsed  = urlParser.parse(req.url);

    // 临时写法 
    if (req.query.expressway) {
      return next();
    }

    if (app.local(urlParsed)) {
      if ((urlParsed.pathname === '/')) {
        if (this.env === 'dev') {
          this.createComplier();

          return res.render('compiling', {
            progress: this.progress
          });
        }
        
        if (plugins.isNew()) {
          this.createComplier();

          return res.render('updating', {
            progress: this.progress
          })
        } else {
          this.onRouting = function (req, res, next) { next(); }
        }
      }
    }

    next();
  }
}

