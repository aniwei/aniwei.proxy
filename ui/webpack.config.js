var path = require('path'),
    entry = path.join(__dirname, './src/app.jsx'),
    static = path.join(__dirname, './static/dist/js/'),
    webpack = require('webpack')

module.exports = {
    entry: [
        //'webpack/hot/dev-server',
        //'webpack/hot/only-dev-server',
        entry
    ],
    output: {
        path: static,
        filename: 'app.js',
        publicPath: '/dist/js'
    },
    resolve: {
        root: path.join(__dirname, './src/common/'),
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
    ],
    devtool: 'source-map',
    module: {
        loaders: [{
            loader: 'babel-loader', //加载babel模块
            include: [
                path.resolve(__dirname, 'src'),
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
            test: /\.png|jpg|gif|jpeg|eot|ttf|woff$/
        }]
    }
}