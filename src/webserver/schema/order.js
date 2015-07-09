import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql'
import db from '../di/orientoDb'
import orderPosition from './orderPosition'


export default new GraphQLObjectType({
  name: 'Order',
  fields: {
    positions: {
      type: new GraphQLList(orderPosition),
      resolve: (order) => {
        return db
          .select('EXPAND(OUTE("OrderPosition"))')
          .from(order['@rid'])
          .all()
      }
    }
  }
})
