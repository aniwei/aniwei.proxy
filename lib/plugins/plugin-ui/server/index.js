var express       = require('express'),
    path          = require('path'),
    webpack       = require('webpack'),
    webpackConfig = require('../webpack.config.js'),
    webpackMiddleware,
    complier,
    router;


webpackMiddleware = require('webpack-dev-middleware');

complier = webpack(webpackConfig, function () {});

router = express.Router();

router.use(webpackMiddleware(complier, function () {
}));
router.use(express.static(path.join(__dirname, '..' ,'static')));

module.exports = router;