import api from '@/services/api'

export async function getProperties() {
  const response = await api.get('/properties')
  return response.data.data
}

export async function getProperty(uuid) {
  const response = await api.get(`/properties/${uuid}`)
  return response.data.data
}

export async function createProperty(data) {
  const response = await api.post('/properties', data)
  return response.data.data
}

export async function updateProperty(uuid, data) {
  const response = await api.put(`/properties/${uuid}`, data)
  return response.data.data
}

export async function deleteProperty(uuid) {
  const response = await api.delete(`/properties/${uuid}`)
  return response
}