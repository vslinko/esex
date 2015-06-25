export default function collectResources(apiResponse) {
  let resources = []

  if (Array.isArray(apiResponse.data)) {
    resources = resources.concat(apiResponse.data)
  } else if (apiResponse.data) {
    resources.push(apiResponse.data)
  }

  if (apiResponse.included) {
    resources = resources.concat(apiResponse.included)
  }

  return resources
}
