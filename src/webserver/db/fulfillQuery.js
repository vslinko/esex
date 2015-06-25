import {uniqWith, flatten} from 'ramda'
import {ParametersError} from './errors'
import mapObjectToResource from './mapObjectToResource'
import * as schemas from '../../schemas'

function objectToResource(db, object, fields) {
  return mapObjectToResource(db, object, fields[object['@class']])
}

function reduceOuts({schema, queryPath}, field) {
  if (!schema.relationships || !schema.relationships[field]) {
    throw new ParametersError(`Class "${schema.type}" haven't relationship "${field}"`)
  }

  const relationship = schema.relationships[field]

  if (relationship.throughEdge === schema.type) {
    queryPath.pop()
    queryPath.push(`OUT('${relationship.throughEdge}')`)

  } else if (relationship.throughEdge) {
    queryPath.push(`OUT('${relationship.throughEdge}')`)

  } else if (relationship.class) {
    queryPath.push(`OUTE('${relationship.class}')`)

  } else {
    throw new Error(`Invalid relationship definition "${field}" in class "${schema.type}"`)
  }

  return {
    schema: schemas[relationship.class],
    queryPath
  }
}

async function fetchInclude({db, object, path, fields}) {
  const type = object['@class']
  const id = object['@rid']
  const classSchema = schemas[type]

  const queryPath = path
    .reduce(reduceOuts, {schema: classSchema, queryPath: []})
    .queryPath
    .join('.')

  const query = `SELECT EXPAND(${queryPath}) FROM ${type} WHERE @rid = ${id}`
  const objects = await db.query(query)
  const resources = await* objects.map(object => objectToResource(db, object, fields))

  return resources
}


export default async function fulfillQuery(db, root, {fields, include}) {
  if (!root) {
    return {data: null} // null-reasonable
  }

  const data = Array.isArray(root)
    ? (await * root.map(object => objectToResource(db, object, fields)))
    : (await objectToResource(db, root, fields))

  const response = {
    data
  }

  const objects = Array.isArray(root) ? root : [root]
  let included = []

  for (const oneInclude of include) {
    const path = oneInclude.split('.')

    const includeResources = await* objects.map(object =>
      fetchInclude({db, object, path, fields})
    )

    included = included.concat(flatten(includeResources))
  }

  included = uniqWith(
    (a, b) => a.type === b.type && a.id === b.id,
    included
  )

  if (included.length > 0) {
    response.included = included
  }

  return response
}
