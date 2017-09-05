const commonConfig = require('./webpack.common.config.js');

commonConfig.entry = {
  UserChip: './src/UserChip/UserChip.example.jsx'
};

commonConfig.output = {
  filename: '[name]/[name].js',
  path: __dirname + '/build/examples/'
};

module.exports = commonConfig;
