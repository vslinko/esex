require('babel-core/register')

module.exports = [
  require('./build/webpack/frontend'),
  require('./build/webpack/webserver'),
  require('./build/webpack/migrate'),
  require('./build/webpack/fixtures')
]
