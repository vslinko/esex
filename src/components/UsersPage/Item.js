import createObservableComponent from 'react-observable'
import {defineSchema, attribute} from 'components-data-tree'

export const schema = defineSchema({
  id: attribute,
  title: attribute,
  price: attribute
})

function Item({item: {id, title, price}}) {
  return (
    <div>
      <h3>Item #{id}</h3>
      <div><b>title</b> {title}</div>
      <div><b>price</b> {price}</div>
    </div>
  )
}

export default createObservableComponent(Item)
