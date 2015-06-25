import {range, xprod} from 'ramda'

export default async function(db, {users}) {
  const orders = await* xprod(users, range(1, 4))
    .map(async ([user, i]) => {
      const contactEmail = `${i}+${user.email}`

      const order = await db.insert().into('Order').set({contactEmail}).one()

      await db.create('EDGE', 'UserOrder').from(user['@rid']).to(order['@rid']).one()

      return order
    })

  return {
    orders
  }
}
