import apiRequest from '../../utilities/apiRequest'
import getParamsFromRequest from '../utilities/getParamsFromRequest'

export async function loginHandler(request) {
  const {fields, include} = getParamsFromRequest(request)

  const response = await apiRequest('/api/v1/tokens/', {
    method: 'POST',
    fields,
    include,
    headers: {
      'Authorization': request.headers.authorization
    }
  })

  return {
    cookies: [
      {
        name: 'accessToken',
        value: response.data.attributes.hash,
        httpOnly: true
      }
    ],
    body: response
  }
}

export async function logoutHandler(request) {
  const token = request.cookies.accessToken

  const response = await apiRequest(`/api/v1/tokens/?filter[hash]=${token}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return {
    body: response
  }
}
