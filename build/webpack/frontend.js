import {HotModuleReplacementPlugin} from 'webpack'
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

  plugins: mergeArrays(
    prepareArray([
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
