import {everyRule, authorized} from 'access-rule'

function isAdmin(object, subject) {
  return subject.role === 'ADMIN'
}

import {GraphQLObjectType} from 'graphql'
function byObjectType(schema) {
  return function(object, subject, operation) {
    if (object instanceof GraphQLObjectType) {
      return schema.schemaType(object, subject, operation)
    } else {
      return schema.resource(object, subject, operation)
    }
  }
}

export default byObjectType({
  schemaType: everyRule([
    authorized,
    // isAdmin
  ]),
  resource: everyRule([
    authorized,
    // isAdmin
  ])
})
