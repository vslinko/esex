import oriento from 'oriento'
import config from './config'

export default oriento({
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password
})
