import {range, xprod} from 'ramda'

export default async function(db, {orders, items}) {
  const orderPositions = await* xprod(orders, items)
    .map(([order, item]) => {
      const amount = Math.round(Math.random() * 99) + 1 // between 1 and 100

      return db.create('EDGE', 'OrderPosition').from(order['@rid']).to(item['@rid']).set({amount}).one()
    })

  return {
    orderPositions
  }
}
