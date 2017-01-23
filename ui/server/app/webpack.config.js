var path    = require('path'),
    entry   = path.join(__dirname, './ui/main.jsx'),
    statics = path.join(__dirname, './static/dist/'),
    webpack = require('webpack'),
    _       = require('lodash'),
    WebpackIsomorphicToolsPlugin,
    webpackIsomorphicToolsPlugin,
    defaultConfig;

WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools'));

defaultConfig = {
    entry: [
        entry
    ],
    output: {
        path: statics,
        filename: 'app.js',
        publicPath: '/dist/'
    },
    resolve: {
        root: path.join(__dirname, './ui/'),
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        webpackIsomorphicToolsPlugin.development()
    ],
    devtool: 'source-map',
    module: {
        loaders: [{
            loader: 'babel-loader', //加载babel模块
            include: [
                path.resolve(__dirname, 'ui'),
                path.resolve(__dirname, '../../../')
            ],
            exclude: [
                path.resolve(__dirname, 'node_module')
            ],
            test: /\.(json|jsx|js)$/,
            query: {
                presets: ['es2015', 'stage-0', 'react']
            }
        }, {
            loader: 'style!css',
            test: /\.css$/
        }, {
            loader: 'json',
            test: /\.json$/
        }, {
            loader: 'url',
            test: /\.png|jpg|gif|jpeg|eot|ttf|woff|svg$/
        }]
    }
}

module.exports = function (config) {
    return _.clone(defaultConfig, config)
}()
