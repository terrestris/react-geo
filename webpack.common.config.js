const path = require('path');

module.exports = {
  entry: {
    reactgeo: [
      './src/index.js'
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    // publicPath: '/build/', // mostly relevant for the webpack-debug server
    library: 'ReactGeo',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(less|css)$/,
      loaders: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      loaders: [
        'file-loader?name=img/[name].[ext]',
        'image-webpack-loader'
      ]
    }]
  }
};
