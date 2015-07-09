import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql'
import db from '../di/orientoDb'


export default new GraphQLObjectType({
  name: 'Item',
  fields: {
    title: {type: GraphQLString},
    price: {type: GraphQLFloat}
  }
})
