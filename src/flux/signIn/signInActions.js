import {authorize} from '../token/tokenActions'

import {
  SIGN_IN_EMAIL_CHANGE,
  SIGN_IN_PASSWORD_CHANGE,
  SIGN_IN_VALIDATION_MESSAGES_VISIBLE,
  SIGN_IN_ERROR,
  SIGN_IN_DISABLED,
  SIGN_IN_RESET
} from './signInConstants'

export function setEmail(email) {
  return {
    type: SIGN_IN_EMAIL_CHANGE,
    email
  }
}

export function setPassword(password) {
  return {
    type: SIGN_IN_PASSWORD_CHANGE,
    password
  }
}

export function setValidationMessagesVisible(visible) {
  return {
    type: SIGN_IN_VALIDATION_MESSAGES_VISIBLE,
    visible
  }
}

export function setError(error) {
  return {
    type: SIGN_IN_ERROR,
    error
  }
}

export function setDisabled(disabled) {
  return {
    type: SIGN_IN_DISABLED,
    disabled
  }
}

export function reset() {
  return {
    type: SIGN_IN_RESET
  }
}

export function submit() {
  return async (dispatch, getState) => {
    const {signIn} = getState()
    const {disabled, validation: {valid}, data} = signIn
    const {email, password} = data

    if (disabled) {
      return
    }

    if (!valid) {
      dispatch(setValidationMessagesVisible(true))
      return
    }

    dispatch(setDisabled(true))
    dispatch(setError(undefined))
    dispatch(setValidationMessagesVisible(false))

    try {
      await dispatch(authorize(
        email,
        password
      ))
      dispatch(reset())
    } catch (error) {
      dispatch(setError(error))
    } finally {
      dispatch(setDisabled(false))
    }
  }
}
