import * as api from '../../api'
import createFetchTransition from './createFetchTransition'
import createStaticTransition from './createStaticTransition'

export const home = createStaticTransition({
  title: 'Home'
})

export const about = createStaticTransition({
  title: 'About'
})

export const users = createFetchTransition({
  title: 'Users',
  apiRequest: api.usersPageApiRequest
})

export const notFound = createStaticTransition({
  status: 404,
  title: 'Not Found'
})

export const error = createStaticTransition({
  status: 500,
  title: 'Application Error'
})
