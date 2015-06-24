import 'source-map-support/register'

import Migration from 'oriento/lib/migration'
import MigrationManager from 'oriento/lib/migration/manager'

import orientoDb from '../webserver/di/orientoDb'

const migrations = require.context('../migrations', false, /\.js$/)

class EsexMigrationManager extends MigrationManager {
  listAvailable() {
    return migrations
      .keys()
      .map(file => file.replace(/^\.\//, ''))
      .map(file => file.replace(/\.js$/, ''))
  }

  loadMigration(name) {
    return new Migration(migrations(`./${name}.js`))
  }
}

async function main() {
  let code = 0

  try {
    const manager = new EsexMigrationManager({
      db: orientoDb,
      dir: ''
    })

    const applied = await manager.up()

    applied.forEach(name => console.log(`Applied migration ${name}`)) // eslint-disable-line no-console

  } catch (error) {
    code = 1
    console.error(error.stack) // eslint-disable-line no-console
  }

  process.exit(code) // eslint-disable-line no-process-exit
}

main()
