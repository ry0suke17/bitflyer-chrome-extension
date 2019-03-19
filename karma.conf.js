// Karma configuration
// Generated on Wed Feb 13 2019 15:58:00 GMT+0900 (JST)

// テストファイルの配置についてはtestディレクトリを作成するか、ソースファイルの隣に置くかで
// 意見が分かれている。webpackでbundleとして吐き出すのでテストファイルの除外を考えてデプロイ
// するとかではないのでソースファイルの隣に置く方式でいく。そういsた方が見やすいと思うので。
// ref. https://stackoverflow.com/questions/42385701/should-a-test-file-be-placed-in-the-same-folder-as-the-source-file

const path = require('path');

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: ['src/**/*.spec.ts'],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'],
    },

    // webpack の設定ファイルを指定する。
    // ref. https://github.com/webpack/docs/wiki/usage-with-karma
    webpack: require(__dirname + '/webpack.config.dev.js'),

    // webpack でビルドしたものを出力をしないようにする。
    // ref. https://github.com/webpack/docs/wiki/usage-with-karma
    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false,
      },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // CORS 通信は手動で付与するヘッダーが制限されている。許可されているもの以外は false で設定される。
    // ref. https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#Examples_of_access_control_scenarios
    // ref. https://fetch.spec.whatwg.org/#cors-safelisted-request-header
    // なのでセキュリティレベルを下げて Chrome を立ち上げる。
    // ref. https://github.com/karma-runner/karma/blob/master/docs/config/03-browsers.md#configured-launchers
    customLaunchers: {
      chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security', '--load-extension=./'],
        displayName: 'Chrome w/o security',
      },
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['chrome_without_security'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
