var path    = require('path'),
    webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      // 'webpack-hot-middleware/client',
      __dirname + '/src/index.jsx'
    ]
  },
  output: { 
    path: __dirname + '/static/dist', 
    filename: 'bundle.js',
    publicPath: '/dist/' 
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.json?$/,
        loaders: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        loaders: 'babel-loader'
      }, {
        test: /\.css$/,
        loaders: 'style-loader!css-loader'
      }, {
        test: /\.less$/,
        loaders: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.(png|jpg|ttf|woff)$/,
        loaders: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '\'DEV\''
      }
    })
  ]
};

