const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');

commonConfig.devtool = 'cheap-module-source-map';
commonConfig.plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: 'source-map',
    mangle: true,
    compress: {
      warnings: false,
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true
    },
    output: {
      comments: false
    }
  })
];

module.exports = commonConfig;
