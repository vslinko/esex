export function defineSchema(attributes) {
  const keys = Object.keys(attributes)

  return (resource, follow) => {
    return keys.reduce((result, key) => {
      const getter = attributes[key]

      result[key] = getter(resource, key, follow)

      return result
    }, {})
  }
}

export function attribute(resource, key) {
  if (key === 'id' || key === 'type') {
    return resource[key]
  } else if (resource.attributes && key in resource.attributes) {
    return resource.attributes[key]
  } else if (resource.relationships && key in resource.relationships) {
    throw new Error(`Key "${key}" is relationship but not attribute`)
  } else {
    throw new Error(`No attribute "${key}" found in "${JSON.stringify(resource)}"`)
  }
}

export function relationship(schema) {
  return (resource, key, follow) => {
    if (!resource.relationships || !resource.relationships[key]) {
      throw new Error(`No relationship "${key}" found in "${JSON.stringify(resource)}"`)
    }

    return follow(resource.relationships[key].data, schema)
  }
}
