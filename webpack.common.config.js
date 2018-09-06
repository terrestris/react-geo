const path = require('path');

module.exports = {
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!@terrestris)/,
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
            javascriptEnabled: true
          }
        }
      ]
    }, {
      test: /\.(jpe?g|png|gif|ico)$/i,
      use: [
        'file-loader?name=img/[name].[ext]'
      ]
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'file-loader'
    }]
  }
  // Uncomment the following lines if you're working with a linked
  // @terrestris/ol-util package (or any other package that requires ol
  // itself).
  // resolve: {
  //   alias: {
  //     'ol': path.join(__dirname, './node_modules', 'ol')
  //   }
  // }
};
