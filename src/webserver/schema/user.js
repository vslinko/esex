import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql'
import db from '../di/orientoDb'
import order from './order'
import userValidator from '../../validators/userValidator'
import userAccessRule from '../../accessRules/userAccessRule'

export const query = new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {type: GraphQLString},
    password: {
      type: GraphQLString,
      resolve: () => undefined
    },
    orders: {
      type: new GraphQLList(order),
      resolve: (user) => {
        return db
          .select('EXPAND(OUT("UserOrder"))')
          .from(user['@rid'])
          .all()
      }
    }
  }
})

export const mutation = new GraphQLObjectType({
  name: 'UserMutation',
  fields: {
    delete: {
      type: GraphQLInt,
      resolve: async (user, {email}, context) => {
        if (!(await userAccessRule(query, context.user, 'OP_DELETE'))) {
          throw new Error('Access Denied')
        }

        if (!(await userAccessRule(user, context.user, 'OP_DELETE'))) {
          throw new Error('Access Denied')
        }

        return await db
          .delete('VERTEX')
          .from('User')
          .where({'@rid': user['@rid']})
          .limit(1)
          .scalar()
      }
    },
    setEmail: {
      type: query,
      args: {
        email: {type: GraphQLString}
      },
      resolve: async (user, {email}, context) => {
        if (!(await userAccessRule(query, context.user, 'OP_PATCH'))) {
          throw new Error('Access Denied')
        }

        if (!(await userAccessRule(user, context.user, 'OP_PATCH'))) {
          throw new Error('Access Denied')
        }

        const validation = userValidator.email(email)

        if (!validation.valid) {
          throw new Error(validation.message)
        }

        await db
          .update(user['@rid'])
          .set({email})
          .scalar()

        return db.select().from(user['@rid']).one()
      }
    }
  }
})
