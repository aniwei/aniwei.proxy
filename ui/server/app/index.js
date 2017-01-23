var express = require('express'),
    path    = require('path'),
    router  = express.Router(),
    WebpackIsomorphicTools,
    WebpackIsomorphicToolsConfig;

WebpackIsomorphicTools = require('webpack-isomorphic-tools'),
WebpackIsomorphicToolsConfig =  require('./webpack.isomorphic.tools');

new WebpackIsomorphicTools(WebpackIsomorphicToolsConfig)
  .server(__dirname, () => {
    router.use(require('./router/index'));
    router.use(express.static(path.join(__dirname,'./static')));
  });

module.exports = router;
