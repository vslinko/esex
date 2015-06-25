import {constraints} from 'strulidator'

const {
  combineConstraints,
  notNull,
  number,
  createMinConstraint
} = constraints

export default {
  type: 'OrderPosition',
  attributes: {
    amount: combineConstraints({
      notNull,
      number,
      min: createMinConstraint(0)
    })
  },
  relationships: {
    item: {
      class: 'Item',
      throughEdge: 'OrderPosition'
    }
  }
}
