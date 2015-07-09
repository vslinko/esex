import {
  graphql,
  GraphQLSchema
} from 'graphql'
import {query, mutation} from '../schema/root'

var schema = new GraphQLSchema({
  query,
  mutation
})

export default async function graphqlHandler(request) {
  const query = request.body
  const {user} = request

  const body = await graphql(schema, query, {user})

  return {
    body
  }
}
