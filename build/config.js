import path from 'path'
import fs from 'fs'

const rootDirectory = path.join(__dirname, '..')
const sourceDirectory = path.join(rootDirectory, 'src')
const publicDirectory = path.join(rootDirectory, 'public')
const destinationDirectory = path.join(rootDirectory, '.app')
const destinationPublicDirectory = path.join(destinationDirectory, 'public')

const production = process.env.NODE_ENV === 'production'
const development = !production
const hotReload = development && process.env.HOT_RELOAD === 'react-hot-loader'

const nodeModulesExternals = fs.readdirSync(path.join(rootDirectory, 'node_modules'))
  .filter(dir => dir !== '.bin')
  .reduce((acc, name) => (acc[name] = `commonjs ${name}`, acc), {})

export default {
  rootDirectory,
  sourceDirectory,
  publicDirectory,
  destinationDirectory,
  destinationPublicDirectory,

  production,
  development,
  hotReload,

  nodeModulesExternals
}
