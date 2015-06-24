import createStore from '../../utilities/createStore'

import {
  CURRENT_USER
} from './currentUserConstants'

const initialState = '%username%'

function currentUser(previousUser, {user}) {
  return user
}

export default createStore(initialState, {
  [CURRENT_USER]: currentUser
})
