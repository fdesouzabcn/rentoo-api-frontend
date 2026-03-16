import api from './api'

export async function login(email, password) {
  const response = await api.post('/login', { email, password })
  return response.data
}

export async function register(data) {
  const response = await api.post('/register', data)
  return response.data
}

export async function logout() {
  const response = await api.post('/logout')
  return response.data
}