export default function validateResourceBySchema(resource, schema, force = false) {
  const resourceAttributes = resource && resource.attributes || {}
  const resourceRelationships = resource && resource.relationships || {}
  const schemaAttributes = schema.attributes || {}
  const schemaRelationships = schema.relationships || {}

  const attributeErrors = Object.keys(schemaAttributes)
    .reduce((acc, key) => {
      const constraint = schemaAttributes[key]
      const value = resourceAttributes[key]
      const validationNeeded = key in resourceAttributes || force

      if (validationNeeded) {
        const constraintResult = constraint(value)

        if (!constraintResult.valid) {
          acc.push({
            status: 400,
            title: constraintResult.message,
            source: {
              pointer: `/data/attributes/${key}`
            },
            meta: {
              constraintResult
            }
          })
        }
      }

      return acc
    }, [])

  const relationshipErrors = Object.keys(schemaRelationships)
    .reduce((acc, key) => {
      const relationshipSchema = schemaRelationships[key]
      const relationship = resourceRelationships[key]

      const validateRelationship = ({type, id}, index) => {
        if (type !== relationshipSchema.class) {
          acc.push({
            status: 400,
            title: `Relationship type doesn't match schema`,
            source: {
              pointer: `/data/relationships/${key}`
            },
            meta: {
              actual: type,
              expected: relationshipSchema.class,
              index
            }
          })
        }
      }

      if (relationship) {
        const {data} = relationship

        if (Array.isArray(data)) {
          data.map(validateRelationship)
        } else if (data) {
          validateRelationship(data)
        }
      }

      return acc
    }, [])

  return [...attributeErrors, ...relationshipErrors]
}
