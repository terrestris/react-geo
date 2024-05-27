const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    server: 'https'
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
    ],
    fallback: {
      buffer: require.resolve('buffer/'),
    }
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      use: 'babel-loader'
    }, {
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false
      }
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
      type: 'asset/resource',
      generator: {
        filename: 'img/[name].[ext]'
      }
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      type: 'asset/resource'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      type: 'asset/resource'
    }]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'node_modules/@camptocamp/inkmap/dist/inkmap-worker.js',
    //       to: 'build'
    //     }
    //   ]
    // })
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
