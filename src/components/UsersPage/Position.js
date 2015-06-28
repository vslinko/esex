import createObservableComponent from 'react-observable'
import {defineSchema, attribute, relationship} from 'components-data-tree'
import Item, {schema as itemSchema} from './Item'

export const schema = defineSchema({
  id: attribute,
  amount: attribute,
  item: relationship(itemSchema)
})

function Position({position: {id, amount, item}}) {
  return (
    <div>
      <h3>Position #{id}</h3>
      <div><b>amount</b> {amount}</div>
      <Item item={item} />
    </div>
  )
}

export default createObservableComponent(Position)
