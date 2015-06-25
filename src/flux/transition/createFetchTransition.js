import {mergeResources} from '../resources/resourcesActions'
import collectResources from '../../utilities/collectResources'

export default function createFetchTransition({status = 200, title, apiRequest}) {
  return function transition(queryParams) {
    return async dispatch => {
      const result = {
        status,
        queryParams
      }

      try {
        result.apiResponse = (await apiRequest(queryParams)) || {}

        dispatch(mergeResources(collectResources(result.apiResponse)))

      } catch (error) {
        if (error.message === 'Not Found') {
          result.status = 404
        } else {
          result.status = 500
          result.errorMessage = error.message
          result.errorStack = error.stack
        }
      }

      // TODO: 404 500 error title
      result.title = typeof title === 'function'
        ? title(result)
        : title

      return result
    }
  }
}
