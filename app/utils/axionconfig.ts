import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        alert('Sessão expirada. Faça login novamente.')
        Cookies.remove('token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api