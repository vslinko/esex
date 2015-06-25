import {ParametersError} from './errors'
import * as schemas from '../../schemas'

function prepareId(id) {
  return id.toString().replace(/^#/, '')
}

async function fetchRelationshipDataThroughIn({db, relationship, type, id}) {
  const links = await db.query(`SELECT in FROM ${type} WHERE @rid = ${id}`)

  if (!links[0]) {
    return
  }

  return {type: relationship.class, id: prepareId(links[0].in)}
}

async function fetchRelationshipDataThroughEdge({db, relationship, type, id, reverse = false}) {
  const edgeClass = reverse ? relationship.reverseThroughEdge : relationship.throughEdge
  const fn = reverse ? 'IN' : 'OUT'

  const links = await db.query(`SELECT ${fn}('${edgeClass}') FROM ${type} WHERE @rid = ${id}`)

  if (!links[0]) {
    return []
  }

  return links[0][fn].map(linkId => ({type: relationship.class, id: prepareId(linkId)}))
}

async function fetchRelationshipDataEdge({db, relationship, type, id}) {
  const links = await db.query(`SELECT OUTE('${relationship.class}') FROM ${type} WHERE @rid = ${id}`)

  if (!links[0]) {
    return []
  }

  return links[0].OUTE.map(linkId => ({type: relationship.class, id: prepareId(linkId)}))
}

async function fetchRelationshipData({db, relationship, type, id, field}) {
  if (relationship.throughEdge === type) {
    return await fetchRelationshipDataThroughIn({db, relationship, type, id})
  }

  if (relationship.throughEdge) {
    return await fetchRelationshipDataThroughEdge({db, relationship, type, id})
  }

  if (relationship.reverseThroughEdge) {
    return await fetchRelationshipDataThroughEdge({db, relationship, type, id, reverse: true})
  }

  if (relationship.class) {
    return await fetchRelationshipDataEdge({db, relationship, type, id})
  }

  throw new Error(`Invalid relationship definition "${field}" in class "${type}"`)
}

export default async function mapObjectToResource(db, obj, fields) {
  const type = obj['@class']
  const id = obj['@rid']
  const classSchema = schemas[type]

  if (!classSchema) {
    throw new Error(`Schema for class "${type}" is not defined`)
  }

  if (!fields) {
    fields = Object.keys(classSchema.attributes || {})
      .concat(Object.keys(classSchema.relationships || {}))
  }

  const attributes = {}
  const relationships = {}

  for (const field of fields) {
    if (field === 'id' || field === 'type') {
      continue

    } else if (classSchema.attributes[field]) {
      attributes[field] = obj[field]

    } else if (classSchema.relationships[field]) {
      relationships[field] = {
        data: await fetchRelationshipData({
          db,
          relationship: classSchema.relationships[field],
          type,
          id,
          field
        })
      }

    } else {
      throw new ParametersError(`Class "${type}" haven't field "${field}"`)
    }
  }

  const resource = {
    type,
    id: prepareId(id),
    attributes,
    relationships
  }

  return resource
}
