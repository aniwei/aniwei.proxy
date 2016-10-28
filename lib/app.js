var express     = require('express'),
    path        = require('path'),
    http        = require('http'),
    net         = require('net'),
    fs          = require('fs'),
    _           = require('lodash'),
    urlParser   = require('url'),
    project     = require('../package'),
    core        = require('./core'),
    assist      = require('./assist'),
    init        = require('./init'),
    app;

module.exports = createApplication;

function createApplication (config) {
  var app = express();

  _.assign(app, core)
  _.assign(app, assist);
  _.assign(app, init);

  app.init(config);

  return app;
}
