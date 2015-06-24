import 'source-map-support/register'

import webserver from '../webserver'
import config from '../webserver/di/config'

webserver.listen(
  config.webserver.port,
  config.webserver.host
)
