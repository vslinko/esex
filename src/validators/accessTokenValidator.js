import {constraints} from 'strulidator'

const {
  createObjectConstraint,
  combineConstraints,
  notNull,
  notEmpty,
  string
} = constraints

export default createObjectConstraint({
  hash: combineConstraints({
    notNull,
    notEmpty,
    string
  })
})
