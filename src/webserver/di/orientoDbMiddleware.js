import orientoDb from './orientoDb'

export default function orientoDbMiddleware(request, response, next) {
  request.db = orientoDb
  next()
}
