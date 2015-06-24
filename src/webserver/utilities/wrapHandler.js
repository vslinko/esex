function getErrorMetaInformation(error) {
  const errorMeta = {
    status: 500,
    title: error.message,
    detail: error.stack
  }

  return errorMeta
}

export default function wrapHandler(handler) {
  return async (request, response) => {
    let contentType
    let status = 200
    let body

    try {
      const responseMeta = await handler(request)

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

      contentType = 'text/plain'
      body = errorMeta.detail || errorMeta.title
    }

    if (contentType) {
      response.header('Content-Type', contentType)
    }

    response.status(status)
    response.send(body)
  }
}
