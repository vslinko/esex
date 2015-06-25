import createObservableComponent from 'react-observable'
import {setCurrentUser} from '../../flux/currentUser/currentUserActions'
import bindAction from '../../utilities/bindAction'
import Link from '../Link'

function DumbHomePage({dispatcher, currentUser, onCurrentUserChange}) {
  const currentUserLink = {
    value: currentUser,
    requestChange: onCurrentUserChange
  }

  return (
    <div>
      <h1>Hello {currentUser}!</h1>
      <div>
        <input valueLink={currentUserLink} />
      </div>
      <div>
        <Link dispatcher={dispatcher} href="/about">About</Link>
      </div>
    </div>
  )
}

function HomePage({dispatcher}) {
  return dispatcher.observable
    .map(state => ({
      dispatcher,
      currentUser: state.currentUser,
      onCurrentUserChange: bindAction(dispatcher, setCurrentUser)
    }))
    .map(DumbHomePage)
}

export default createObservableComponent(HomePage)
