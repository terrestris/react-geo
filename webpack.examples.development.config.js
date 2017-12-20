const merge = require('webpack-merge');
const WebpackShellPlugin = require('webpack-shell-plugin');

const examplesCommonConfig = require('./webpack.examples.common.config.js');

module.exports = merge(examplesCommonConfig, {
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './build/examples/',
    inline: true,
    host: '0.0.0.0',
    port: 9090,
    publicPath: 'http://localhost:9090/',
    disableHostCheck: true
  },
  plugins: [
    new WebpackShellPlugin({
      dev: false,
      onBuildStart: ['node ./tasks/build-examples.js']
    })
  ],
});
