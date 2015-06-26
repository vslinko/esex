import apiRequest from '../utilities/apiRequest'

export default async function usersPageApiRequest(queryParams, token) {
  const data = await apiRequest(`/api/v1/users`, {
    token,
    include: [
      'orders',
      'orders.positions',
      'orders.positions.item'
    ]
  })

  return data
}
