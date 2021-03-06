// Karma configuration
// Generated on Thu May 12 2016 12:21:48 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // libs
        'public/js/jquery-2.2.3.min.js',
        'public/js/angular.min.js',
        'public/js/angular-mocks.js',
        'public/js/angular-route.min.js',
        'public/js/bootstrap.min.js',
        'public/js/ui-bootstrap-tpls-1.2.1.min.js',
        'public/js/ng-tags-input.min.js',
        'public/js/smart-table.min.js',
        'public/js/ng-file-upload.min.js',
        'public/js/ng-file-upload-shim.min.js',
        'public/js/checklist-model.js',
        'public/js/ng-infinite-scroll.min.js',
        'public/js/angular-material.min.js',
        'public/js/angular-messages.min.js',
        'public/js/angular-animate.min.js',
        'public/js/angular-aria.min.js',

        // app
        'app_client/index.controller.js',

        'app_client/**/*.js',

        'test/controllers/*.js'

    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app_client/**/!(*spec).js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
