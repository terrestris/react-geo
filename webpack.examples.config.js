const commonConfig = require('./webpack.common.config.js');
const basePath = '/build/examples/';

commonConfig.entry = {
  'Button/SimpleButton/SimpleButton': './src/Button/SimpleButton/SimpleButton.example.jsx',
  'Button/ToggleButton/ToggleButton': './src/Button/ToggleButton/ToggleButton.example.jsx',
  'Button/ToggleGroup/ToggleGroup': './src/Button/ToggleGroup/ToggleGroup.example.jsx',
  'Toolbar/Toolbar': './src/Toolbar/Toolbar.example.jsx',
  'UserChip/UserChip': './src/UserChip/UserChip.example.jsx'
};

commonConfig.output = {
  filename: '[name].js',
  path: __dirname + basePath
};

commonConfig.module = {
  loaders: [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }, {
    test: /\.(less|css)$/,
    loaders: [
      'style-loader',
      'css-loader',
      'less-loader'
    ]
  }, {
    test: /\.(jpe?g|png|gif|ico)$/i,
    loaders: [
      'file-loader?name=img/[name].[ext]',
      'image-webpack-loader'
    ]
  }, {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      mimetype: 'application/font-woff',
      outputPath: 'resources/',
      name: '[hash].[ext]',
      publicPath: '/react-geo/' + basePath
    }
  }, {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
    options: {
      outputPath: 'resources/',
      name: '[hash].[ext]',
      publicPath: '/react-geo/' + basePath
    }
  }]
};

module.exports = commonConfig;
