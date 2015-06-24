import {
  CURRENT_USER
} from './currentUserConstants'

export function setCurrentUser(user) {
  return {
    type: CURRENT_USER,
    user
  }
}
