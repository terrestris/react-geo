const webpack = require('webpack');
const merge = require('webpack-merge');
const examplesCommonConfig = require('./webpack.examples.common.config.js');

module.exports = merge(examplesCommonConfig, {
  mode: 'production'
});
