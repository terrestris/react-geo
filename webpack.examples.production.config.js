const webpack = require('webpack');
const merge = require('webpack-merge');
const examplesCommonConfig = require('./webpack.examples.common.config.js');

module.exports = merge(examplesCommonConfig, {
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      parallel: true
    })
  ]
});
