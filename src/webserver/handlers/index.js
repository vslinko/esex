// import * as xhr from './xhr'
import graphqlHandler from './graphqlHandler'

export default [
  {method: 'post', route: '/_graphql', handler: graphqlHandler},
  // {method: 'post', route: '/xhr/login', handler: xhr.loginHandler},
  // {method: 'post', route: '/xhr/logout', handler: xhr.logoutHandler},
]
