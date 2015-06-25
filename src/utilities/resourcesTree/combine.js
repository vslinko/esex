import {intersection, difference, mergeAll} from 'ramda'

function mergeGetterResults(left, right) {
  if (!left) {
    return right
  }

  if (!right) {
    return left
  }

  if (left === right) {
    return right
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.lenght !== right.lenght) {
      throw new Error('Unable to merge two arrays with different length')
    }

    return left.map((l, index) => mergeGetterResults(l, right[index]))
  }

  if (typeof left === 'object' && typeof right === 'object') {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)

    const intersectionKeys = intersection(leftKeys, rightKeys)
    const leftDifferenceKeys = difference(leftKeys, rightKeys)
    const rightDifferenceKeys = difference(rightKeys, leftKeys)

    return mergeAll([
      intersectionKeys.reduce((acc, key) => {
        acc[key] = mergeGetterResults(left[key], right[key])
        return acc
      }, {}),

      leftDifferenceKeys.reduce((acc, key) => {
        acc[key] = left[key]
        return acc
      }, {}),

      rightDifferenceKeys.reduce((acc, key) => {
        acc[key] = right[key]
        return acc
      }, {})
    ])
  }

  throw new Error(`Unable to merge "${JSON.stringify(left)}" and "${JSON.stringify(right)}"`)
}

export default function combine(...getters) {
  return (resource, key, follow) => {
    return getters.reduce((result, getter) => {
      return mergeGetterResults(
        result,
        getter(resource, key, follow)
      )
    }, null) // null-reasonable
  }
}
