import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql'
import bcrypt from 'bcryptjs'
import config from '../../config'
import db from '../di/orientoDb'
import {randomBytes} from 'crypto'

import userAccessRule from '../../accessRules/userAccessRule'
import userValidator from '../../validators/userValidator'
import accessTokenAccessRule from '../../accessRules/accessTokenAccessRule'

import * as user from './user'
import * as accessToken from './accessToken'
import item from './item'
import order from './order'
import orderPosition from './orderPosition'

function allResources({queryType, mutationType, accessRule}) {
  const type = mutationType || queryType

  return {
    type: new GraphQLList(type),
    args: {
      limit: {type: GraphQLInt, defaultValue: 20}
    },
    resolve: async (root, {limit}, {user}) => {
      if (accessRule && !(await accessRule(queryType, user, 'OP_GET'))) {
        throw new Error('Access Denied')
      }

      const resources = await db
        .select()
        .from(queryType.name)
        .limit(limit)
        .all()

      if (!accessRule) {
        return resources
      }

      const filteredResources = []
      for (const resource of resources) {
        if (await accessRule(resource, user, 'OP_GET')) {
          filteredResources.push(resource)
        }
      }

      return filteredResources
    }
  }
}

function resourceRoot({queryType, mutationType, idKey = '@rid', accessRule}) {
  const type = mutationType || queryType

  return {
    type: type,
    args: {
      id: {type: GraphQLString}
    },
    resolve: async (root, {id}, {user}) => {
      if (accessRule && !(await accessRule(queryType, user, 'OP_GET'))) {
        throw new Error('Access Denied')
      }

      const resource = await db
        .select()
        .from(queryType.name)
        .where({[idKey]: id})
        .limit(1)
        .one()

      if (!resource) {
        return
      }

      if (accessRule && !(await accessRule(resource, user, 'OP_GET'))) {
        throw new Error('Access Denied')
      }

      return resource
    }
  }
}


export const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: allResources({queryType: user.query, accessRule: userAccessRule}),
    user: resourceRoot({queryType: user.query, accessRule: userAccessRule}),

    accessTokens: allResources({queryType: accessToken.query, accessRule: accessTokenAccessRule}),
    accessToken: resourceRoot({queryType: accessToken.query, idKey: 'hash', accessRule: accessTokenAccessRule}),

    items: allResources({queryType: item}),
    item: resourceRoot({queryType: item}),

    orders: allResources({queryType: order}),
    order: resourceRoot({queryType: order}),

    orderPositions: allResources({queryType: orderPosition}),
    orderPosition: resourceRoot({queryType: orderPosition}),
  }
})

export const mutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    me: {
      type: user.mutation,
      resolve: (root, args, context) => context.user
    },

    createAccessToken: {
      type: accessToken,
      resolve: (root, args, context) => {
        if (!context.user) {
          throw new Error('Just nope')
        }

        const hash = randomBytes(128).toString('hex')

        return db
          .let('token', $ =>
            $.insert().into('AccessToken').set({hash})
          )
          .let('userToken', $ =>
            $.create('EDGE', 'UserToken').from(context.user['@rid']).to('$token')
          )
          .commit()
          .return('$token')
          .one()
      }
    },

    accessTokens: allResources({queryType: accessToken.query, mutationType: accessToken.mutation, accessRule: accessTokenAccessRule}),
    accessToken: resourceRoot({queryType: accessToken.query, mutationType: accessToken.mutation, idKey: 'hash', accessRule: accessTokenAccessRule}),

    users: allResources({queryType: user.query, mutationType: user.mutation, accessRule: userAccessRule}),
    user: resourceRoot({queryType: user.query, mutationType: user.mutation, accessRule: userAccessRule}),

    createUser: {
      type: user.query,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve: async (root, user, context) => {
        if (!(await userAccessRule(user.query, context.user, 'OP_POST'))) {
          throw new Error('Access Denied')
        }

        const validation = userValidator(user)

        if (!validation.valid) {
          throw new Error('Invalid')
        }

        const hash = 'bcrypt:' + bcrypt.hashSync(user.password, config.bcrypt.rounds + 1)

        return await db
          .insert()
          .into('User')
          .set({email: user.email, password: hash})
          .one()
      }
    }
  }
})
