import api from './api'

export async function getContracts() {
  const response = await api.get('/contracts')
  return response.data.data
}

export async function getContract(uuid) {
  const response = await api.get(`/contracts/${uuid}`)
  return response.data.data
}

export async function createContract(data) {
  const response = await api.post('/contracts', data)
  return response.data.data
}

export async function updateContract(uuid, data) {
  const response = await api.put(`/contracts/${uuid}`, data)
  return response.data.data
}

export async function deleteContract(uuid) {
  await api.delete(`/contracts/${uuid}`)
}