const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  devServer: {
    https: true
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.json'
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, './tsconfig.json')
      })
    ]
  },
  module: {
    rules: [
    // Compile .tsx?
    {
      test: /\.(ts|tsx)$/,
      use: 'babel-loader'
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }
      ]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      }]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }]
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'file-loader'
    }]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: path.join(__dirname, './src'),
      tsconfig: path.join(__dirname, './tsconfig.json'),
      tslint: path.join(__dirname, './tslint.json'),
    })
  ]
  // Uncomment the following lines if you're working with a linked
  // @terrestris/ol-util package (or any other package that requires ol
  // itself).
  // resolve: {
  //   alias: {
  //     'ol': path.join(__dirname, './node_modules', 'ol')
  //   }
  // }
};
