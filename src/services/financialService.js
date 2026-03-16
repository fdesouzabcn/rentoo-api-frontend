import api from './api'

export async function getFinancialSummary(uuid) {
  const response = await api.get(`/users/${uuid}/financial-summary`)
  return response.data.data
}