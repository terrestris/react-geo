const commonConfig = require('./webpack.common.config.js');

commonConfig.devServer = {
  inline: true,
  host: '0.0.0.0',
  port: 4809
};
commonConfig.devtool = 'inline-source-map';

module.exports = commonConfig;
