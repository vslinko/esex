import {
  RESOURCES_UPDATE
} from './resourcesConstants'

export function mergeResources(resources) {
  return {
    type: RESOURCES_UPDATE,
    resources
  }
}
