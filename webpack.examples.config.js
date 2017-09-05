const commonConfig = require('./webpack.common.config.js');

commonConfig.entry = {
  Toolbar: './src/Toolbar/Toolbar.example.jsx',
  UserChip: './src/UserChip/UserChip.example.jsx'
};

commonConfig.output = {
  filename: '[name]/[name].js',
  path: __dirname + '/build/examples/'
};

module.exports = commonConfig;
