import gulp from 'gulp'
import webpack from 'webpack'
import nodemon from 'nodemon'
import path from 'path'

import loadGulpPlugins from 'gulp-load-plugins'
import runSequence from 'run-sequence'
import del from 'del'

import {webpackCallback} from './build/utilities'
import config from './build/config'

const webpackFrontendConfig = () => require('./build/webpack/frontend')
const webpackWebserverConfig = () => require('./build/webpack/webserver')
const plugins = loadGulpPlugins()

/* BUILD */

gulp.task('_build-clean', callback => {
  del(config.destinationDirectory, callback)
})

gulp.task('_build-copy-package-json', () =>
  gulp.src('package.json')
    .pipe(gulp.dest(config.destinationDirectory))
)

gulp.task('_build-copy-public-files', () =>
  gulp.src(`${config.publicDirectory}/**/*`)
    .pipe(gulp.dest(config.destinationPublicDirectory))
)

gulp.task('_build-compile-frontend', callback => {
  webpack(webpackFrontendConfig())
    .run(webpackCallback({onReady: callback}))
})

gulp.task('_build-compile-webserver', callback => {
  webpack(webpackWebserverConfig())
    .run(webpackCallback({onReady: callback}))
})

gulp.task('build', callback => {
  runSequence(
    '_build-clean',
    [
      '_build-copy-package-json',
      '_build-copy-public-files',
      '_build-compile-frontend',
      '_build-compile-webserver'
    ],
    callback
  )
})

/* START */

gulp.task('_start-run-webserver', callback => {
  let first = true

  nodemon({
    script: path.join(config.destinationDirectory, 'webserver'),
    execMap: {
      '': 'node'
    },
    env: {
      PUBLIC_DIR: config.destinationPublicDirectory
    }
  }).on('start', function() {
    if (first) {
      first = false
      callback()
    }
  })
})

gulp.task('start', callback =>
  runSequence(
    'build',
    '_start-run-webserver',
    callback
  )
)

/* ESLINT */

gulp.task('eslint', () =>
  gulp.src([
    'build/**/*.js',
    'src/**/*.js',
    'gulpfile.babel.js',
    'webpack.config.js'
  ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
)

/* GLOBAL */

gulp.task('lint', ['eslint'])
gulp.task('clean', ['_build-clean'])
gulp.task('default', ['start'])
