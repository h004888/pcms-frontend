import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pcms_access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiErrorMessage(error) {
  const data = error?.response?.data

  if (typeof data === 'string') {
    return data
  }

  return (
    data?.message ||
    data?.error ||
    error?.message ||
    'Không thể kết nối đến hệ thống.'
  )
}
