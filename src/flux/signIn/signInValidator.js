import {constraints} from 'strulidator'
import User from '../../schemas/User'

const {createObjectConstraint} = constraints

export default createObjectConstraint({
  email: User.attributes.email,
  password: User.attributes.password
})
