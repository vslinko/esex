import createStore from '../../utilities/createStore'

import {
  TOKEN
} from './tokenConstants'

function newToken(previousToken, {token}) {
  return token
}

export default createStore(undefined, {
  [TOKEN]: newToken
})
