import passport from './passport'

export default function wrapPassportMiddleware(name) {
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
