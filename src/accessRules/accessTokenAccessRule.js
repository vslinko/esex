import {someRule, authorized, byOperation, OP} from 'access-rule'
import db from '../webserver/di/orientoDb'

function isAdmin(object, subject) {
  return subject.role === 'ADMIN'
}
import {GraphQLObjectType} from 'graphql'

export default async function(object, subject, operation) {
  if (!subject) {
    return false
  }

  if (operation === OP.POST) {
    return true
  }

  if (isAdmin(object, subject, operation)) {
    return true
  }

  if (object instanceof GraphQLObjectType) {
    return true
  }

  const edgesCount = await db
    .select('COUNT(*)')
    .from('UserToken')
    .where({
      out: subject['@rid'],
      in: object['@rid']
    })
    .scalar()

  return edgesCount > 0
}
