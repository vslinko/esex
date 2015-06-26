import {ParametersError} from '../db/errors'

function getErrorMetaInformation(error) {
  const errorMeta = {
    status: 500,
    title: error.message,
    detail: error.stack
  }

  if (error.responseStatus) {
    errorMeta.status = error.responseStatus

    if (error.responseStatus < 500) {
      delete errorMeta.detail
    }
  }

  if (error instanceof ParametersError) {
    errorMeta.status = 400
  }

  if (error.type === 'com.orientechnologies.orient.core.storage.ORecordDuplicatedException') {
    const matches = /key \'(.*)\' in index \'(.*)\' previously/.exec(error.message)

    if (matches) {
      const value = matches[1]
      const dbIndex = matches[2].split('.')
      const className = dbIndex[0]
      const fields = dbIndex[1].split('_')

      delete errorMeta.detail

      errorMeta.status = 409
      errorMeta.title = `Found duplicated key "${value}" in index "${matches[2]}"`
      errorMeta.meta = {value, dbIndex, className, fields}

      if (fields.length === 1) {
        errorMeta.source = {
          pointer: `/data/attributes/${fields[0]}`
        }
      }
    }
  }

  return errorMeta
}

export default function wrapHandler(handler) {
  return async (request, response) => {
    const isApiRequest = /^\/api\//.test(request.originalUrl)
    const isAjaxRequest = /^\/xhr\//.test(request.originalUrl)

    let contentType
    let status = 200
    let body

    try {
      const responseMeta = await handler(request)

      if (responseMeta.location) {
        response.location(responseMeta.location)
      }

      if (responseMeta.headers) {
        Object.keys(responseMeta.headers)
          .forEach(key => {
            response.set(key, responseMeta.headers[key])
          })
      }

      if (responseMeta.cookies) {
        responseMeta.cookies
          .forEach(({name, value, ...options}) => {
            response.cookie(name, value, options)
          })
      }

      if (responseMeta.contentType) {
        contentType = responseMeta.contentType
      }

      if (responseMeta.status) {
        status = responseMeta.status
      }

      if (responseMeta.body) {
        body = responseMeta.body
      }
    } catch (error) {
      const errorMeta = getErrorMetaInformation(error)

      status = errorMeta.status

      if (isApiRequest || isAjaxRequest) {
        body = {errors: [errorMeta]}
      } else {
        contentType = 'text/plain'
        body = errorMeta.detail || errorMeta.title
      }
    }

    if (!contentType && isAjaxRequest) {
      contentType = 'application/json'
    }

    if (!contentType && isApiRequest) {
      contentType = 'application/vnd.api+json'
    }

    if (contentType) {
      response.header('Content-Type', contentType)
    }

    if (typeof body === 'number') {
      body = String(body)
    }

    response.status(status)
    response.send(body)
  }
}
