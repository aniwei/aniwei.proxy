var path    = require('path'),
    entry   = path.join(__dirname, './src/app.jsx'),
    static  = path.join(__dirname, './static/dist/js/');

module.exports = {
    entry: entry,
    output: {
        path: static,
        filename: 'app.js',
        publicPath:'./dist/js/',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        root: path.join(__dirname, 'midway'),
        extensions: ['', '.js', '.jsx', '.json']
    },
    devtool: 'source-map',
    module: {
        loaders: [
          {
            loader: 'babel-loader',   //加载babel模块
            include:[
                path.resolve(__dirname,'src'),
            ],
            exclude:[
                path.resolve(__dirname,'node_module')
            ],
            test:/\.(json|jsx)$/,
            query:{
                presets:['es2015','stage-0','react']
            }
          },{
            loader: 'style!css',
            test: /\.css$/
          }, {
            loader: 'url',
            test: /\.png|jpg|gif|jpeg|eot|ttf|woff$/
          }
        ]
    }
}
