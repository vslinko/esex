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

    const tokenResource = await mapObjectToResource(orientoDb, token)

    const user = await orientoDb
      .select()
      .from('User')
      .where({
        '@rid': request.tokenResource.relationships.user.data[0].id // TODO: fix
      })
      .one()

    const userResource = await mapObjectToResource(orientoDb, user)

    request.tokenResource = tokenResource
    request.userResource = userResource
  } finally {
    next()
  }
}
