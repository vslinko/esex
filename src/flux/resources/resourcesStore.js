import {findIndex, merge} from 'ramda'
import createStore from '../../utilities/createStore'

import {
  RESOURCES_UPDATE
} from './resourcesConstants'

const initialState = []

function mergeResources(resources, action) {
  resources = resources.concat()

  function mergeResource(resource) {
    const {type, id} = resource

    const index = findIndex(
      r => r.type === type && r.id === id,
      resources
    )

    if (index === -1) {
      resources.push(resource)
      return
    }

    const previousResource = resources[index]

    const attributes = merge(
      previousResource.attributes || {},
      resource.attributes || {}
    )
    const relationships = merge(
      previousResource.relationships || {},
      resource.relationships || {}
    )

    resources.splice(index, 1, {
      type,
      id,
      attributes,
      relationships
    })
  }

  action.resources.forEach(mergeResource)

  return resources
}

export default createStore(initialState, {
  [RESOURCES_UPDATE]: mergeResources
})
