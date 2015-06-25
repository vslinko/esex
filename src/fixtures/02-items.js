import {range} from 'ramda'

export default async function(db) {
  const items = await* range(1, 4)
    .map(i => {
      const title = `Item #${i}`
      const price = i * 1000

      return db.insert().into('Item').set({title, price}).one()
    })

  return {
    items
  }
}
