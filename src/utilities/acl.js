// type AccessRule = (object: mixed, subject: Object | void, operation: String) => boolean

export const OP_GET = 'OP_GET'
export const OP_POST = 'OP_POST'
export const OP_PATCH = 'OP_PATCH'
export const OP_DELETE = 'OP_DELETE'

export const OP = {
  GET: OP_GET,
  POST: OP_POST,
  PATCH: OP_PATCH,
  DELETE: OP_DELETE
}

export function authorized(object, subject) {
  return !!subject
}

export function everyRule(rules) {
  return (object, subject, operation) => {
    return rules.every(rule => rule(object, subject, operation))
  }
}

export function someRule(rules) {
  return (object, subject, operation) => {
    return rules.some(rule => rule(object, subject, operation))
  }
}

export function deny() {
  return false
}

export function allow() {
  return true
}

export function byOperation(schema) {
  return (object, subject, operation) => {
    return schema[operation](object, subject, operation)
  }
}
