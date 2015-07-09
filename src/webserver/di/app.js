import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import orientoDbMiddleware from './orientoDbMiddleware'
import wrapHandler from '../utilities/wrapHandler'
import renderPage from '../utilities/renderPage'
import config from './config'
import handlers from '../handlers'
import wrapPassportMiddleware from './wrapPassportMiddleware'
import cookieAuthMiddleware from './cookieAuthMiddleware'

// Setup

const app = express()

app.use(morgan('combined'))
app.disable('x-powered-by')

// graphql

app.use('/_graphql', wrapPassportMiddleware('basic'))
app.use('/_graphql', wrapPassportMiddleware('bearer'))
app.use('/_graphql', bodyParser.text())

// API

app.use('/api/*', wrapPassportMiddleware('basic'))
app.use('/api/*', wrapPassportMiddleware('bearer'))
app.use('/api/*', bodyParser.json())
app.use('/api/*', orientoDbMiddleware)

app.use('/xhr/*', cookieParser())

handlers
  .forEach(({method, route, handler}) => {
    app[method](route, wrapHandler(handler))
  })

app.all('/api/*', wrapHandler(() => ({status: 404, body: {data: null}}))) // null-reasonable

// Front end

if (config.webserver.publicDir) {
  app.use(express.static(config.webserver.publicDir, {
    index: false
  }))
}

app.use(cookieParser())
app.use(cookieAuthMiddleware)

app.get('*', wrapHandler(renderPage))

export default app
