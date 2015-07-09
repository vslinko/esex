import {
  GraphQLObjectType,
  GraphQLInt
} from 'graphql'
import db from '../di/orientoDb'
import item from './item'


export default new GraphQLObjectType({
  name: 'OrderPosition',
  fields: {
    amount: {type: GraphQLInt},
    item: {
      type: item,
      resolve: (orderPosition) => {
        return db
          .select()
          .from(orderPosition['in'])
          .one()
      }
    }
  }
})
