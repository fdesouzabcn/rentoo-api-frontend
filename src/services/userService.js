import api from './api'

export async function getUser(uuid) {
  const response = await api.get(`/users/${uuid}`)
  return response.data.data
}

export async function getUsers() {
  const response = await api.get('/users')
  return response.data.data
}

export async function deleteUser(uuid) {
  await api.delete(`/users/${uuid}`)
}