const commonConfig = require('./webpack.common.config.js');
const webpack = require('webpack');
const basePath = '/build/examples/';

commonConfig.entry = {
  'Button/SimpleButton/SimpleButton': './src/Button/SimpleButton/SimpleButton.example.jsx',
  'Button/ToggleButton/ToggleButton': './src/Button/ToggleButton/ToggleButton.example.jsx',
  'Button/ToggleGroup/ToggleGroup': './src/Button/ToggleGroup/ToggleGroup.example.jsx',
  'Map/FloatingMapLogo/FloatingMapLogo': './src/Map/FloatingMapLogo/FloatingMapLogo.example.jsx',
  'Map/ScaleCombo/ScaleCombo': './src/Map/ScaleCombo/ScaleCombo.example.jsx',
  'Panel/Panel/Panel': './src/Panel/Panel/Panel.example.jsx',
  'Panel/Titlebar/Titlebar': './src/Panel/Titlebar/Titlebar.example.jsx',
  'Toolbar/Toolbar': './src/Toolbar/Toolbar.example.jsx',
  'UserChip/UserChip': './src/UserChip/UserChip.example.jsx',
  'VisibleComponent/VisibleComponent': './src/VisibleComponent/VisibleComponent.example.jsx'
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
    loaders: [{
      loader: 'file-loader?name=img/[name].[ext]',
      options: {
        outputPath: 'resources/',
        name: '[hash].[ext]',
        publicPath: basePath
      }
    },
    'image-webpack-loader']
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

// commonConfig.devtool = 'cheap-module-source-map';
// commonConfig.plugins = [
//   ...commonConfig.plugins || [],
//   new webpack.DefinePlugin({
//     'process.env': {
//       NODE_ENV: JSON.stringify('production')
//     }
//   }),
//   new webpack.optimize.UglifyJsPlugin({
//     sourceMap: 'source-map',
//     mangle: true,
//     compress: {
//       warnings: false,
//       pure_getters: true,
//       unsafe: true,
//       unsafe_comps: true,
//       screw_ie8: true
//     },
//     output: {
//       comments: false
//     }
//   })
// ];

module.exports = commonConfig;
