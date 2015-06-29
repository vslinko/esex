import orientoDb from './orientoDb'
import mapObjectToResource from '../db/mapObjectToResource'

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

    const tokenResource = await mapObjectToResource(orientoDb, token)

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

    const userResource = await mapObjectToResource(orientoDb, user)

    request.tokenResource = tokenResource
    request.userResource = userResource
  } catch (error) {
    return next(error)
  }

  next()
}
