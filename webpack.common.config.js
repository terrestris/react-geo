const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
         exclude: /node_modules/,
        use: {
          loader: 'babel-loader', 
          options: {
            plugins:
              [
                [
                  'import', [
                    {
                      'libraryName': 'antd',
                      'libraryDirectory': 'es',
                      'style': true
                    },
                    {
                      'libraryName': 'ag-grid',
                      'libraryDirectory': 'dist/lib',
                      'style': true
                    },
                    {
                      'libraryName': '@turf/turf',
                      'libraryDirectory': '../',
                    }              
                  ]
                ]
              ]
          }
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
};
