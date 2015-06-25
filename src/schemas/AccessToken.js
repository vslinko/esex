import {constraints} from 'strulidator'

const {
  combineConstraints,
  notNull,
  notEmpty,
  string
} = constraints

export default {
  type: 'AccessToken',
  attributes: {
    hash: combineConstraints({
      notNull,
      notEmpty,
      string
    })
  },
  relationships: {
    user: {
      class: 'User',
      reverseThroughEdge: 'UserToken'
    }
  }
}
