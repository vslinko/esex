import {ProvidePlugin} from 'webpack'

import {mergeObjects, mergeArrays} from '../utilities'
import config from '../config'
import base from './base'

export default mergeObjects(base, {
  module: mergeObjects(base.module, {
    loaders: mergeArrays(
      base.module.loaders,
      [
        {
          test: /\.js$/,
          include: [config.testDirectory],
          loaders: ['babel']
        }
      ]
    ).map(loaderConfig => {
      if (loaderConfig.include && loaderConfig.include.indexOf(config.sourceDirectory) >= 0) {
        loaderConfig = mergeObjects(loaderConfig, {
          loaders: ['isparta']
        })
      }

      return loaderConfig
    })
  }),

  devtool: undefined
})
