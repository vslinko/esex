import createObservableComponent from 'react-observable'
import {fulfillTree} from '../../utilities/resourcesTree'
import User, {schema as userSchema} from './User'

function DumbUsersPage({users}) {
  return (
    <div>
      {users.map((user, index) => <User key={index} user={user} />)}
    </div>
  )
}

function UsersPage({dispatcher, apiResponse}) {
  return dispatcher.observable
    .map(state => ({
      dispatcher,
      users: fulfillTree(
        state.resources,
        apiResponse.data,
        userSchema
      )
    }))
    .map(DumbUsersPage)
}

export default createObservableComponent(UsersPage)
