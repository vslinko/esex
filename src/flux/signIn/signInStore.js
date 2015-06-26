import {merge} from 'ramda'
import createStore from '../../utilities/createStore'
import signInValidator from './signInValidator'

import {
  SIGN_IN_EMAIL_CHANGE,
  SIGN_IN_PASSWORD_CHANGE,
  SIGN_IN_VALIDATION_MESSAGES_VISIBLE,
  SIGN_IN_ERROR,
  SIGN_IN_DISABLED,
  SIGN_IN_RESET
} from './signInConstants'

const initialData = {
  email: '',
  password: ''
}

const initialState = {
  data: initialData,
  validationMessagesVisible: false,
  validation: signInValidator(initialData),
  error: undefined,
  disabled: false
}

function mergeData(state, changes) {
  const data = merge(state.data, changes)
  const validation = signInValidator(data)

  return merge(state, {data, validation})
}

function email(state, {email}) {
  return mergeData(state, {email})
}

function password(state, {password}) {
  return mergeData(state, {password})
}

function validationMessagesVisible(state, {visible}) {
  return merge(state, {validationMessagesVisible: visible})
}

function error(state, {error}) {
  return merge(state, {error})
}

function disabled(state, {disabled}) {
  return merge(state, {disabled})
}

export default createStore(initialState, {
  [SIGN_IN_EMAIL_CHANGE]: email,
  [SIGN_IN_PASSWORD_CHANGE]: password,
  [SIGN_IN_VALIDATION_MESSAGES_VISIBLE]: validationMessagesVisible,
  [SIGN_IN_ERROR]: error,
  [SIGN_IN_DISABLED]: disabled,
  [SIGN_IN_RESET]: () => initialState
})
