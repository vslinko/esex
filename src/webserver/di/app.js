import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import orientoDbMiddleware from './orientoDbMiddleware'
import passport from './passport'
import wrapHandler from '../utilities/wrapHandler'
import renderPage from '../utilities/renderPage'
import config from './config'
import handlers from '../handlers'

// Setup

const app = express()

app.use(morgan('combined'))

// API

function wrapPassportMiddleware(name) {
  return (request, response, next) => {
    const middleware = passport.authenticate(name, {session: false}, (error, user) => {
      if (error) {
        return next(error)
      }

      if (user) {
        request.user = user
      }

      next()
    })

    middleware(request, response, next)
  }
}

app.use('/api/*', wrapPassportMiddleware('basic'))
app.use('/api/*', wrapPassportMiddleware('bearer'))
app.use('/api/*', bodyParser.json())
app.use('/api/*', orientoDbMiddleware)

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

app.get('*', wrapHandler(renderPage))

export default app
