var webpack = require('webpack'),
    //config  = require('../app/webpack.config.js'),
    isComplied;

module.exports = function (req, res, next) {
  var app     = req.app,
      context = app.context;

  return next();

  if (isComplied) {
    return next();
  }

  isComplied = true;

  if (complie) {
     webpack(config(), function () {
      next();
    })
  }
}