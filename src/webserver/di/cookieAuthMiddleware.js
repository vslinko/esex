import orientoDb from './orientoDb'
// import mapObjectToResource from '../db/mapObjectToResource'

export default async function cookieAuthMiddleware(request, response, next) {
  if (!request.cookies.accessToken) {
    return next()
  }

  try {
    const token = await orientoDb
      .select()
      .from('AccessToken')
      .where({hash: request.cookies.accessToken})
      .one()

    if (!token) {
      return
    }

    if (tokenResource.relationships.user.data.length < 1) {
      return
    }

    const user = await orientoDb
      .select()
      .from('User')
      .where({
        '@rid': tokenResource.relationships.user.data[0].id
      })
      .one()

    if (!user) {
      return
    }

    request.token = token
    request.user = user
  } catch (error) {
    return next(error)
  }

  next()
}
