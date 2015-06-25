export default async function apiRequest(url, {fields = {}, include = [], method = 'GET', body}) {
  const queryParams = Object.keys(fields)
    .reduce((acc, key) => {
      return [...acc, `fields[${key}]=${fields[key].join(',')}`]
    }, [])
    .concat([`include=${include.join(',')}`])

  const apiUrl = `${process.env.BACKEND_ADDRESS}${url}?${queryParams.join('&')}`

  const response = await fetch(apiUrl, {
    credentials: 'include',
    method,
    body: body && JSON.stringify(body),
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    }
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

      if (errorStack) {
        error.stack = errorStack
      }

      throw error
    }
  }

  const json = await response.json()

  return json
}
