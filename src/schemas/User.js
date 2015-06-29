import {constraints} from 'strulidator'
import {merge} from 'ramda'
import bcrypt from 'bcryptjs' // TODO: use only in webserver environment
import {authorized} from 'access-rule'
import config from '../config'

const {
  combineConstraints,
  notNull,
  notEmpty,
  string,
  email,
  createMinLengthConstraint,
  createMaxLengthConstraint
} = constraints

export default {
  type: 'User',
  attributes: {
    email: combineConstraints({
      notNull,
      notEmpty,
      string,
      email
    }),
    password: combineConstraints({
      notNull,
      notEmpty,
      string,
      minLength: createMinLengthConstraint(5),
      maxLength: createMaxLengthConstraint(18)
    })
  },
  relationships: {
    orders: {
      class: 'Order',
      throughEdge: 'UserOrder'
    }
  },
  schemaAccessRule: authorized,
  resourceAccessRule: authorized,
  normalize: user => {
    if (!user.attributes.password) {
      return user
    }

    const password = bcrypt.hashSync(user.attributes.password, config.bcrypt.rounds)

    return merge(user, {
      attributes: merge(user.attributes, {password})
    })
  }
}
