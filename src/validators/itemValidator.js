import {constraints} from 'strulidator'

const {
  createObjectConstraint,
  combineConstraints,
  notNull,
  notEmpty,
  string,
  number,
  createMinConstraint,
  createMinLengthConstraint
} = constraints

export default createObjectConstraint({
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
})
