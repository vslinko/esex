import createObservableComponent from 'react-observable'
import {fulfillTree} from '../../utilities/resourcesTree'
import getCurrentUser from '../../utilities/getCurrentUser'
import {defineSchema, attribute} from '../../utilities/resourcesTree'
import bindAction from '../../utilities/bindAction'
import preventEvent from '../../utilities/preventEvent'
import {deauthorize} from '../../flux/token/tokenActions'
import Link from '../Link'
import SignIn from '../SignIn'

const currentUserSchema = defineSchema({
  email: attribute
})

function DumbHomePage({dispatcher, currentUser, onSignOut}) {
  return (
    <div>
      <h1>Welcome</h1>
      <SignIn dispatcher={dispatcher} />
      <div>
        {currentUser && `You are signed in as ${currentUser.email}`}
        {currentUser && <button onClick={preventEvent(onSignOut)}>Sign Out</button>}
      </div>
      <div>
        <Link dispatcher={dispatcher} href="/about">About</Link>
      </div>
      <div>
        <Link dispatcher={dispatcher} href="/users">Users</Link>
      </div>
    </div>
  )
}

function HomePage({dispatcher}) {
  return dispatcher.observable
    .map(state => ({
      dispatcher,
      onSignOut: bindAction(dispatcher, deauthorize),
      currentUser: fulfillTree(
        state.resources,
        getCurrentUser(
          state.resources,
          state.token
        ),
        currentUserSchema
      )
    }))
    .map(DumbHomePage)
}

export default createObservableComponent(HomePage)
