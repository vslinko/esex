import {constraints} from 'strulidator'

const {
  createObjectConstraint,
  combineConstraints,
  notNull,
  number,
  createMinConstraint
} = constraints

export default createObjectConstraint({
  amount: combineConstraints({
    notNull,
    number,
    min: createMinConstraint(0)
  })
})
