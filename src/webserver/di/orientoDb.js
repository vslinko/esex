import orientoServer from './orientoServer'
import config from './config'

export default orientoServer.use({
  name: config.database.dbname,
  username: config.database.dbuser,
  password: config.database.dbpassword
})
