import {DefinePlugin, HotModuleReplacementPlugin} from 'webpack'
import path from 'path'

import {useIf, prepareArray, mergeArrays, mergeObjects} from '../utilities'
import config from '../config'
import base from './base'

export default mergeObjects(base, {
  entry: prepareArray([
    useIf(config.hotReload, `webpack-dev-server/client?`),
    useIf(config.hotReload, 'webpack/hot/dev-server'),
    path.join(config.sourceDirectory, 'frontend')
  ]),

  output: {
    path: config.destinationPublicDirectory,
    filename: 'frontend.js',
    publicPath: '/',
    library: 'frontend'
  },

  module: mergeObjects(base.module, {
    loaders: mergeArrays(
      [
        {
          test: /\.js$/,
          include: [config.sourceDirectory],
          loaders: ['react-hot-loader']
        },
        {
          test: /\.css$/,
          loaders: ['style', 'css']
        }
      ],
      base.module.loaders
    )
  }),

  plugins: mergeArrays(
    prepareArray([
      new DefinePlugin({
        'process.env.BACKEND_ADDRESS': JSON.stringify(process.env.BACKEND_ADDRESS || '')
      }),
      useIf(config.hotReload, new HotModuleReplacementPlugin())
    ]),
    base.plugins
  ),

  devServer: {
    contentBase: config.destinationPublicDirectory,
    filename: 'frontend.js',
    publicPath: '/',
    hot: config.hotReload,
    proxy: {
      '*': `http://localhost:${process.env.PORT}`
    }
  }
})
