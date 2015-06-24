require('babel-core/register')

module.exports = [
  require('./build/webpack/frontend'),
  require('./build/webpack/webserver')
]
