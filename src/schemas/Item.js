import {constraints} from 'strulidator'

const {
  combineConstraints,
  notNull,
  notEmpty,
  string,
  number,
  createMinConstraint,
  createMinLengthConstraint
} = constraints

export default {
  type: 'Item',
  attributes: {
    title: combineConstraints({
      notNull,
      notEmpty,
      string,
      minLength: createMinLengthConstraint(3)
    }),
    price: combineConstraints({
      notNull,
      number,
      min: createMinConstraint(0)
    })
  },
  relationships: {
  }
}
