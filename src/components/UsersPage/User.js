import createObservableComponent from 'react-observable'
import {defineSchema, attribute, relationship} from '../../utilities/resourcesTree'
import Order, {schema as orderSchema} from './Order'

export const schema = defineSchema({
  id: attribute,
  email: attribute,
  password: attribute,
  orders: relationship(orderSchema)
})

function User({user: {id, email, password, orders}}) {
  return (
    <div>
      <h1>User #{id}</h1>
      <div><b>email</b> {email}</div>
      <div><b>password</b> {password}</div>
      {orders.map((order, index) => <Order key={index} order={order} />)}
    </div>
  )
}

export default createObservableComponent(User)
