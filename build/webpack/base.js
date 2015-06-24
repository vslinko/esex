import {DefinePlugin, optimize} from 'webpack'

import {useIf, prepareArray} from '../utilities'
import config from '../config'

export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [config.sourceDirectory],
        loaders: ['babel']
      }
    ]
  },

  debug: config.development,

  devtool: 'source-map',

  plugins: prepareArray([
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    useIf(config.production, new optimize.UglifyJsPlugin())
  ])
}
