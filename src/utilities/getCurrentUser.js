export default function getCurrentUser(resources, token) {
  if (!token) {
    return
  }

  const tokenResource = resources
    .filter(resource => resource.type === 'AccessToken')
    .filter(resource => resource.attributes.hash === token)
    .shift()

  if (!tokenResource) {
    return
  }

  const userId = tokenResource.relationships.user.data[0].id // TODO: fix

  const userResource = resources
    .filter(resource => resource.type === 'User' && resource.id === userId)
    .shift()

  return userResource
}
