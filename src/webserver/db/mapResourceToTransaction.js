export default function mapResourceToTransaction(resource, schema) {
  if (!resource) {
    return
  }

  const className = resource.type

  if (className !== schema.type) {
    throw new Error(`Unexpected resource type "${className}", expected "${schema.type}"`)
  }

  const id = resource.id && `#${resource.id}`
  const resourceAttributes = resource.attributes || {}
  const resourceRelationships = resource.relationships || {}
  const steps = []

  const attributes = Object.keys(schema.attributes)
    .reduce((acc, key) => {
      if (resourceAttributes[key]) {
        acc[key] = resourceAttributes[key]
      }

      return acc
    }, {})

  steps.push({
    key: 'object',
    type: id ? 'updateVertex' : 'createVertex',
    class: className,
    id,
    attributes
  })

  Object.keys(schema.relationships)
    .filter(key => resourceRelationships[key])
    .forEach(key => {
      const relationshipSchema = schema.relationships[key]
      const data = resourceRelationships[key].data

      if (relationshipSchema.throughEdge && data.length > 0) {
        data
          .forEach(link => {
            if (link.type !== relationshipSchema.class) {
              throw new Error(`Unexpected relationships type "${link.type}", expected "${relationshipSchema.class}"`)
            }

            const key1 = 'relationshipClean' + steps.length
            const key2 = 'relationshipFind' + steps.length
            const key3 = 'relationshipEdge' + steps.length

            if (id) {
              steps.push({
                key: key1,
                type: 'removeEdges',
                class: relationshipSchema.throughEdge,
                from: id
              })
            }

            steps.push({
              key: key2,
              type: 'findOne',
              class: relationshipSchema.class,
              id: `#${link.id}`
            })

            steps.push({
              key: key3,
              type: 'createEdge',
              class: relationshipSchema.throughEdge,
              from: id ? id : '$object',
              to: `\$${key2}`
            })
          })
      }
    })

  let returnKey = '$object'

  if (id) {
    returnKey = '$result'
    steps.push({
      key: 'result',
      type: 'findOne',
      class: schema.type,
      id
    })
  }

  return {steps, returnKey, returnType: 'one'}
}
