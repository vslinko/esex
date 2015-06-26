/* eslint-disable no-var */

require('babel-core/register')

var webpack = require('webpack')
var webpackKarmaConfig = require('./build/webpack/karma')

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],

    files: [
      'test/**/*Test.js'
    ],

    preprocessors: {
      'test/**/*Test.js': ['webpack']
    },

    reporters: ['progress', 'coverage'],

    browsers: ['Chrome'],

    singleRun: true,

    coverageReporter: {
      type: 'lcov',
      subdir: '.'
    },

    webpack: webpackKarmaConfig,

    webpackMiddleware: {
      quiet: true
    }
  })
}
