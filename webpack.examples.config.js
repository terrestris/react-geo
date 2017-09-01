const commonConfig = require('./webpack.common.config.js');

commonConfig.entry = {
  userChip: './examples/userChip.js'
};

commonConfig.output = {
  filename: '[name].js',
  path: __dirname + '/build/examples/'
};

module.exports = commonConfig;
