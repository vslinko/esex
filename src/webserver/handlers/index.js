import * as users from './users'
import * as tokens from './tokens'

export default [
  {method: 'post', route: '/api/v1/tokens/', handler: tokens.postHandler},
  {method: 'get', route: '/api/v1/users/', handler: users.indexHandler},
  {method: 'post', route: '/api/v1/users/', handler: users.postHandler},
  {method: 'get', route: '/api/v1/users/:id', handler: users.getHandler},
  {method: 'patch', route: '/api/v1/users/:id', handler: users.patchHandler},
  {method: 'delete', route: '/api/v1/users/:id', handler: users.deleteHandler}
]
