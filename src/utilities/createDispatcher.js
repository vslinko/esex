import {createRedux} from 'redux'
import * as stores from '../flux/stores'
import Rx from 'rx'

export default function createDispatcher(initialState) {
  const dispatcher = createRedux(stores, initialState)
  const {subscribe, dispatch, getState} = dispatcher

  const observable = Rx.Observable.create(observer => {
    const listener = () => observer.onNext(getState())
    const unsubscribe = subscribe(listener)

    listener()

    return unsubscribe
  })

  return {
    observable,
    dispatch,
    getState
  }
}
