import path from 'path'

import {mergeObjects} from '../utilities'
import config from '../config'
import base from './base'

export default mergeObjects(base, {
  entry: path.join(config.sourceDirectory, 'commands', 'migrate'),

  output: {
    path: path.join(config.destinationDirectory),
    filename: 'migrate.js'
  },

  target: 'node',
  node: {
    console: false,
    process: false,
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  externals: [
    config.nodeModulesExternals,
    {
      'oriento/lib/migration': 'commonjs oriento/lib/migration',
      'oriento/lib/migration/manager': 'commonjs oriento/lib/migration/manager'
    }
  ]
})
