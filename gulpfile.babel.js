import gulp from 'gulp'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import nodemon from 'nodemon'
import path from 'path'

import loadGulpPlugins from 'gulp-load-plugins'
import runSequence from 'run-sequence'
import del from 'del'

import {webpackCallback} from './build/utilities'
import config from './build/config'

const webpackFrontendConfig = () => require('./build/webpack/frontend')
const webpackWebserverConfig = () => require('./build/webpack/webserver')
const webpackMigrateConfig = () => require('./build/webpack/migrate')
const webpackFixturesConfig = () => require('./build/webpack/fixtures')
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

gulp.task('_build-compile-migrate', callback => {
  webpack(webpackMigrateConfig())
    .run(webpackCallback({onReady: callback}))
})

gulp.task('_build-compile-fixtures', callback => {
  webpack(webpackFixturesConfig())
    .run(webpackCallback({onReady: callback}))
})

gulp.task('build', callback => {
  runSequence(
    '_build-clean',
    [
      '_build-copy-package-json',
      '_build-copy-public-files',
      '_build-compile-frontend',
      '_build-compile-webserver',
      '_build-compile-migrate',
      '_build-compile-fixtures'
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

/* WATCH */

gulp.task('_watch-copy-public-files', ['_build-copy-public-files'], () =>
  gulp.watch(`${config.publicDirectory}/**/*`, ['_build-copy-public-files'])
)

gulp.task('_watch-compile-webserver', callback =>
  webpack(webpackWebserverConfig())
    .watch(100, webpackCallback({
      onReady: callback,
      onChange: () => {
        nodemon.restart()
      }
    }))
)

gulp.task('_watch-compile-migrate', callback =>
  webpack(webpackMigrateConfig())
    .watch(100, webpackCallback({
      onReady: callback
    }))
)

gulp.task('_watch-compile-fixtures', callback =>
  webpack(webpackFixturesConfig())
    .watch(100, webpackCallback({
      onReady: callback
    }))
)

gulp.task('_watch-webpack-dev-server', callback => {
  const config = webpackFrontendConfig()

  const server = new WebpackDevServer(
    webpack(config),
    config.devServer
  )

  server.listen(3000, '0.0.0.0', callback)
})

gulp.task('watch-webserver', callback =>
  runSequence(
    '_build-clean',
    [
      '_watch-copy-public-files',
      '_build-compile-frontend',
      '_watch-compile-webserver'
    ],
    '_start-run-webserver',
    callback
  )
)

gulp.task('watch-frontend', callback => {
  process.env.PORT = 3001
  process.env.HOT_RELOAD = 'react-hot-loader'
  config.hotReload = true

  runSequence(
    '_build-clean',
    [
      '_watch-copy-public-files',
      '_build-compile-webserver'
    ],
    '_start-run-webserver',
    '_watch-webpack-dev-server',
    callback
  )
})

gulp.task('watch-migrate', callback =>
  runSequence(
    '_build-clean',
    '_watch-compile-migrate',
    callback
  )
)

gulp.task('watch-fixtures', callback =>
  runSequence(
    '_build-clean',
    '_watch-compile-fixtures',
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
