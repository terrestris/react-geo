const webpack = require('webpack');

const basePath = '/build/examples/';

const config = {
  entry: {
    'Container/AddWmsPanel/AddWmsPanel': './src/Container/AddWmsPanel/AddWmsPanel.example.jsx',
    'Button/SimpleButton/SimpleButton': './src/Button/SimpleButton/SimpleButton.example.jsx',
    'Button/ToggleButton/ToggleButton': './src/Button/ToggleButton/ToggleButton.example.jsx',
    'Button/ToggleGroup/ToggleGroup': './src/Button/ToggleGroup/ToggleGroup.example.jsx',
    'Button/MeasureButton/MeasureButton': './src/Button/MeasureButton/MeasureButton.example.jsx',
    'Button/DigitizeButton/DigitizeButton': './src/Button/DigitizeButton/DigitizeButton.example.jsx',
    'Button/UploadButton/UploadButton': './src/Button/UploadButton/UploadButton.example.jsx',
    'CircleMenu/CircleMenu': './src/CircleMenu/CircleMenu.example.jsx',
    'Field/CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo': './src/Field/CoordinateReferenceSystemCombo/CoordinateReferenceSystemCombo.example.jsx',
    'Field/NominatimSearch/NominatimSearch': './src/Field/NominatimSearch/NominatimSearch.example.jsx',
    'Field/ScaleCombo/ScaleCombo': './src/Field/ScaleCombo/ScaleCombo.example.jsx',
    'Grid/FeatureGrid/FeatureGrid': './src/Grid/FeatureGrid/FeatureGrid.example.jsx',
    'Grid/FeatureGrid/FeatureGridWfs': './src/Grid/FeatureGrid/FeatureGridWfs.example.jsx',
    'Grid/PropertyGrid/PropertyGrid': './src/Grid/PropertyGrid/PropertyGrid.example.jsx',
    'Map/FloatingMapLogo/FloatingMapLogo': './src/Map/FloatingMapLogo/FloatingMapLogo.example.jsx',
    'Map/MapComponent/MapComponent': './src/Map/MapComponent/MapComponent.example.jsx',
    'Legend/Legend': './src/Legend/Legend.example.jsx',
    'LayerTree/LayerTree': './src/LayerTree/LayerTree.example.jsx',
    'Panel/Panel/Panel': './src/Panel/Panel/Panel.example.jsx',
    'Panel/Titlebar/Titlebar': './src/Panel/Titlebar/Titlebar.example.jsx',
    'Slider/LayerTransparencySlider': './src/Slider/LayerTransparencySlider.example.jsx',
    'Toolbar/Toolbar': './src/Toolbar/Toolbar.example.jsx',
    'UserChip/UserChip': './src/UserChip/UserChip.example.jsx',
    'Window/Window': './src/Window/Window.example.jsx',
    'HigherOrderComponent/VisibleComponent/VisibleComponent': './src/HigherOrderComponent/VisibleComponent/VisibleComponent.example.jsx'
  },

  output: {
    filename: '[name].js',
    path: __dirname + basePath
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      loaders: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader'
        }
      ]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      loaders: [{
        loader: 'url-loader',
        options: {
          limit: 0
        }
      }
      ]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/font-woff',
        outputPath: 'resources/',
        name: '[hash].[ext]',
        publicPath: '/react-geo/examples/'
      }
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
      options: {
        outputPath: 'resources/',
        name: '[hash].[ext]',
        publicPath: '/react-geo/examples/'
      }
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js'
    })
  ]
};

module.exports = config;
