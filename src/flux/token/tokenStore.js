import createStore from '../../utilities/createStore'

import {
  TOKEN
} from './tokenConstants'

const initialState = undefined

function newToken(previousToken, {token}) {
  return token
}

export default createStore(initialState, {
  [TOKEN]: newToken
})
