import * as users from './users'
import * as tokens from './tokens'
import * as xhr from './xhr'

export default [
  {method: 'post', route: '/xhr/login', handler: xhr.loginHandler},
  {method: 'post', route: '/xhr/logout', handler: xhr.logoutHandler},
  {method: 'post', route: '/api/v1/tokens/', handler: tokens.postHandler},
  {method: 'delete', route: '/api/v1/tokens/', handler: tokens.deleteHandler},
  {method: 'get', route: '/api/v1/users/', handler: users.indexHandler},
  {method: 'post', route: '/api/v1/users/', handler: users.postHandler},
  {method: 'get', route: '/api/v1/users/:id', handler: users.getHandler},
  {method: 'patch', route: '/api/v1/users/:id', handler: users.patchHandler},
  {method: 'delete', route: '/api/v1/users/:id', handler: users.deleteHandler}
]
