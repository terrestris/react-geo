// Karma configuration
// Generated on Mon Jul 03 2017 11:12:39 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha'
    ],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/whatwg-fetch/fetch.js',
      './src/**/*.spec.js*'
    ],

    // list of files to exclude
    exclude: [
      '**/TestUtil.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.spec.js*': ['webpack', 'sourcemap']
    },

    client: {
      captureConsole: false
    },
    specReporter: {
      showSpecTiming: true
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        // Reuse the same loaders as declared in webpack.config.js.
        loaders: require('./webpack.common.config.js').module.loaders,
      },
      externals: {
        'react/addons': 'react',
        'react/lib/ReactContext': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react-addons-test-utils': 'react-dom'
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // Timeout for capturing a browser (in ms).
    // Deafault 60000
    captureTimeout: 60000,

    // The number of disconnections tolerated.
    // Default 0
    browserDisconnectTolerance: 3,

    // How long does Karma wait for a browser to reconnect (in ms).
    // Default: 2000
    browserDisconnectTimeout: 2000,

    // How long will Karma wait for a message from a browser before
    // disconnecting from it (in ms).
    // Default 10000
    browserNoActivityTimeout: 30000,

    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'coverage',
          subdir: '.'
        },
        {
          type: 'lcov',
          dir: 'coverage',
          subdir: '.'
        },
        {
          type: 'text-summary'
        }
      ]
    }
  });
};
