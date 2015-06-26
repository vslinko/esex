import applyTransaction from '../db/applyTransaction'
import fulfillQuery from '../db/fulfillQuery'
import getParamsFromRequest from '../utilities/getParamsFromRequest'
import {randomBytes} from 'crypto'

export async function postHandler(request) {
  const {db, user} = request

  if (!user) {
    return {
      status: 401,
      body: {data: null} // null-reasonable
    }
  }

  const hash = randomBytes(128).toString('hex')

  const token = await applyTransaction(db, {
    steps: [
      {
        key: 'token',
        type: 'createVertex',
        class: 'AccessToken',
        attributes: {
          hash
        }
      },
      {
        key: 'usertoken',
        type: 'createEdge',
        class: 'UserToken',
        from: user['@rid'],
        to: '$token'
      }
    ],
    returnKey: '$token',
    returnType: 'one'
  })

  const body = await fulfillQuery(
    db,
    token,
    getParamsFromRequest(request)
  )

  return {
    status: 201,
    body
  }
}


export async function deleteHandler(request) {
  const {db, query: {filter: {hash}}} = request

  const deletedCount = await db
    .delete('VERTEX', 'AccessToken')
    .where({hash})
    .limit(1)
    .scalar()

  return {
    status: deletedCount > 0 ? 200 : 404,
    body: {data: null} // null-reasonable
  }
}
