import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt
} from 'graphql'
import db from '../di/orientoDb'
import {query as userQuery} from './user'
import accessTokenAccessRule from '../../accessRules/accessTokenAccessRule'
import userAccessRule from '../../accessRules/userAccessRule'


export const query = new GraphQLObjectType({
  name: 'AccessToken',
  fields: {
    hash: {type: GraphQLString},
    user: {
      type: userQuery,
      resolve: async (token, args, context) => {
        if (!(await userAccessRule(userQuery, context.user, 'OP_GET'))) {
          throw new Error('Access Denied')
        }

        const user = await db
          .select('EXPAND(IN("UserToken"))')
          .from(token['@rid'])
          .limit(1)
          .one()

        if (!(await userAccessRule(user, context.user, 'OP_GET'))) {
          throw new Error('Access Denied')
        }

        return user
      }
    }
  }
})

export const mutation = new GraphQLObjectType({
  name: 'AccessTokenMutation',
  fields: {
    delete: {
      type: GraphQLInt,
      resolve: async (token, args, context) => {
        if (!(await accessTokenAccessRule(query, context.user, 'OP_DELETE'))) {
          throw new Error('Access Denied')
        }

        if (!(await accessTokenAccessRule(token, context.user, 'OP_DELETE'))) {
          throw new Error('Access Denied')
        }

        return await db
          .delete('VERTEX')
          .from('AccessToken')
          .where({'@rid': token['@rid']})
          .limit(1)
          .scalar()
      }
    }
  }
})
