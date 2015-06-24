import createObservableComponent from 'react-observable'
import {setCurrentUser} from '../../flux/currentUser/currentUserActions'
import bindAction from '../../utilities/bindAction'

function DumbApplication({currentUser, onCurrentUserChange}) {
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
    </div>
  )
}

function Application({dispatcher}) {
  return dispatcher.observable
    .map(state => ({
      currentUser: state.currentUser,
      onCurrentUserChange: bindAction(dispatcher, setCurrentUser)
    }))
    .map(DumbApplication)
}

export default createObservableComponent(Application)
