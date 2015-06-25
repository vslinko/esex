import apiRequest from '../utilities/apiRequest'

export default async function usersPageApiRequest() {
  const data = await apiRequest(`/api/v1/users`, {
    include: [
      'orders',
      'orders.positions',
      'orders.positions.item'
    ]
  })

  return data
}
