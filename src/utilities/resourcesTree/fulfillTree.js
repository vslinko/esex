import {find} from 'ramda'

function fulfillObject(resources, rootLink, schema) {
  const resource = find(r => r.id === rootLink.id, resources)

  if (!resource) {
    return {}
  }

  const follow = (relationshipLink, relationshipSchema) => {
    return fulfillTree(resources, relationshipLink, relationshipSchema)
  }

  return schema(resource, follow)
}

function fulfillArray(resources, rootLinks, schema) {
  return rootLinks.map(rootLink => fulfillObject(resources, rootLink, schema))
}

export default function fulfillTree(resources, rootLink, schema) {
  if (Array.isArray(rootLink)) {
    return fulfillArray(resources, rootLink, schema)
  }

  if (rootLink) {
    return fulfillObject(resources, rootLink, schema)
  }
}
