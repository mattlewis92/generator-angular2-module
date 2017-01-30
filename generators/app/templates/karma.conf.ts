import * as webpack from 'webpack';
import * as path from 'path';

export default config => {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'test/entry.ts'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/entry.ts': ['webpack', 'sourcemap']
    },

    webpack: {
      resolve: {
        extensions: ['.ts', '.js'],
        alias: {
          sinon: 'sinon/pkg/sinon'
        }
      },
      module: {
        rules: [{
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: /node_modules/,
          enforce: 'pre'
        }, {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: /node_modules/
        }, {
          test: /sinon.js$/,
          loader: 'imports-loader?define=>false,require=>false'
        }, {
          test: /src\/.+\.ts$/,
          exclude: /(node_modules|\.spec\.ts$)/,
          loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true',
          enforce: 'post'
        }]
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        }),
        new webpack.LoaderOptionsPlugin({
          options: {
            tslint: {
              emitErrors: config.singleRun,
              failOnHint: false
            }
          }
        }),
        new webpack.ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
          path.join(__dirname, 'src')
        ),
        ...(config.singleRun ? [new webpack.NoEmitOnErrorsPlugin()] : [])
      ]
    },

    remapIstanbulReporter: {
      reports: {
        html: 'coverage/html',
        'text-summary': null,
        lcovonly: 'coverage/lcov.info'
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-remap-istanbul'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS']
  });

};
