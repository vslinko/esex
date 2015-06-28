import createObservableComponent from 'react-observable'
import {defineSchema, attribute, relationship} from 'components-data-tree'
import Position, {schema as positionSchema} from './Position'

export const schema = defineSchema({
  id: attribute,
  positions: relationship(positionSchema)
})

function Order({order: {id, positions}}) {
  return (
    <div>
      <h2>Order #{id}</h2>
      {positions.map((position, index) => <Position key={index} position={position} />)}
    </div>
  )
}

export default createObservableComponent(Order)
