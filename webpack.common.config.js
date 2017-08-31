const path = require('path');

module.exports = {
  entry: {
    sol: [
      './src/index.js'
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    // publicPath: '/build/', // mostly relevant for the webpack-debug server
    library: 'Sol',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
