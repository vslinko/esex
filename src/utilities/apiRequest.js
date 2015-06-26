export default async function apiRequest(url, spec) {
  const {method = 'GET', body} = spec
  const {fields = {}, include = []} = spec
  const {token} = spec
  const {headers = {}} = spec

  let queryParams = Object.keys(fields)
    .reduce((acc, key) => {
      return [...acc, `fields[${key}]=${fields[key].join(',')}`]
    }, [])

  if (include.length > 0) {
    queryParams = queryParams.concat([`include=${include.join(',')}`])
  }

  let apiUrl = `${process.env.BACKEND_ADDRESS}${url}`

  if (queryParams) {
    if (apiUrl.indexOf('?') === -1) {
      apiUrl = `${apiUrl}?`
    } else {
      apiUrl = `${apiUrl}&`
    }
    apiUrl = `${apiUrl}${queryParams.join('&')}`
  }

  headers['Accept'] = 'application/vnd.api+json'
  headers['Content-Type'] = 'application/vnd.api+json'

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(apiUrl, {
    credentials: 'include',
    method,
    body: body && JSON.stringify(body),
    headers
  })

  if (response.status < 200 || response.status >= 300) {
    let errorMessage
    let errorStack
    let json

    try {
      json = await response.json()
    } catch (error) {
      errorMessage = response.statusText
    }

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].title
      errorStack = json.errors[0].detail
    } else {
      errorMessage = response.statusText
    }

    {
      const error = new Error('API Error: ' + errorMessage)

      error.responseStatus = response.status

      if (errorStack) {
        error.stack = errorStack
      }

      throw error
    }
  }

  const json = await response.json()

  return json
}
