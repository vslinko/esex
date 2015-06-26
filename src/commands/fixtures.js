import 'source-map-support/register'

import orientoServer from '../webserver/di/orientoServer'
import orientoDb from '../webserver/di/orientoDb'

const fixtures = require.context('../fixtures', false, /\.js$/)

async function cleanDatabase() {
  const classNames = (await orientoDb.class.list())
    .map(cls => cls.name)
    .filter(name =>
      name !== 'V' && name !== 'E'
      && !/^O[A-Z]/.test(name) && !/^_/.test(name)
      && name !== 'Migration'
    )

  await* classNames
    .map(name => orientoDb.exec(`TRUNCATE CLASS ${name}`))
}

async function applyFixtures() {
  const files = fixtures.keys()
  let stash = {}

  for (const file of files) {
    const fixture = fixtures(file)
    const stashChanges = (await fixture(orientoDb, stash)) || {}

    stash = {...stash, ...stashChanges}
  }
}

async function main() {
  try {
    await cleanDatabase()
    await applyFixtures()
  } catch (error) {
    console.log(error.stack) // eslint-disable-line no-console
  } finally {
    orientoServer.close()
  }
}

main()
