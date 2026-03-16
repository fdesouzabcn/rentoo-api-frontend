import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('rentoo_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        sessionStorage.removeItem('rentoo_token')
        sessionStorage.removeItem('rentoo_user')
        window.location.href = '/login'
        return Promise.reject({ status, message: 'Session expired. Please log in again.' })
      }

      const normalised = {
        status,
        message: data?.message ?? 'An unexpected error occurred.',
        errors: data?.errors ?? {},
      }

      return Promise.reject(normalised)
    }

    // Network error — Laravel not running
    return Promise.reject({
      status: 0,
      message: 'Cannot connect to server. Is the API running?',
      errors: {},
    })
  }
)

export default api