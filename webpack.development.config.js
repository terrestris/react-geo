const commonConfig = require('./webpack.common.config.js');

commonConfig.output.filename = '[name]-debug.js';

module.exports = commonConfig;
