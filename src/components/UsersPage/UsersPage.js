import createObservableComponent from 'react-observable'
import {fulfillTreeSchema} from 'components-data-tree'
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
      users: fulfillTreeSchema(
        state.resources,
        apiResponse.data,
        userSchema
      )
    }))
    .map(DumbUsersPage)
}

export default createObservableComponent(UsersPage)
