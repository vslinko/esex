import express from 'express'
import morgan from 'morgan'
import wrapHandler from '../utilities/wrapHandler'
import renderPage from '../utilities/renderPage'
import config from './config'

// Setup

const app = express()

app.use(morgan('combined'))

// Front end

if (config.webserver.publicDir) {
  app.use(express.static(config.webserver.publicDir, {
    index: false
  }))
}

app.get('*', wrapHandler(renderPage))

export default app
