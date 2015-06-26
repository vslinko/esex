import apiRequest from '../../utilities/apiRequest'
import collectResources from '../../utilities/collectResources'
import {mergeResources} from '../resources/resourcesActions'
import {
  TOKEN
} from './tokenConstants'

export function setToken(token) {
  return {
    type: TOKEN,
    token
  }
}

export function authorize(username, password) {
  return async dispatch => {
    const response = await apiRequest('/xhr/login?include=user', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}` // TODO: use polyfill?
      }
    })

    dispatch(setToken(response.data.attributes.hash))
    dispatch(mergeResources(collectResources(response)))
  }
}

export function deauthorize() {
  return async (dispatch, getState) => {
    const {token} = getState()

    if (!token) {
      return
    }

    await apiRequest('/xhr/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    dispatch(setToken(undefined))
  }
}
