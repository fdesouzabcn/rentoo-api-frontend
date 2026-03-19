import api from './api'

/**
 * GET /api/v1/users/{uuid}/financial-summary
 * Returns the financial summary for the given user.
 * @param {string} uuid
 */
export async function getFinancialSummary(uuid) {
  const response = await api.get(`/users/${uuid}/financial-summary`)
  return response.data.data
}
