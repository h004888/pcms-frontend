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

const REFRESH_URL = '/auth/refresh'
const EXCLUDED_URLS = ['/auth/login', '/auth/register', REFRESH_URL]

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    const errorData = error.response.data
    if (errorData?.code !== 'MSG01') {
      return Promise.reject(error)
    }

    if (EXCLUDED_URLS.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshTokenValue = localStorage.getItem('pcms_refresh_token')
    if (!refreshTokenValue) {
      clearAuthAndRedirect()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          originalRequest.headers.Authorization =
            `Bearer ${localStorage.getItem('pcms_access_token')}`
          return apiClient(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const response = await axios.post(
        `${API_BASE_URL}${REFRESH_URL}`,
        { refreshToken: refreshTokenValue },
        { headers: { 'Content-Type': 'application/json' } },
      )

      const { accessToken, refreshToken: newRefreshToken } = response.data
      localStorage.setItem('pcms_access_token', accessToken)
      if (newRefreshToken) {
        localStorage.setItem('pcms_refresh_token', newRefreshToken)
      }

      processQueue(null, accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      clearAuthAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

function clearAuthAndRedirect() {
  localStorage.removeItem('pcms_access_token')
  localStorage.removeItem('pcms_refresh_token')
  localStorage.removeItem('pcms_user')
  window.location.href = '/login'
}

export function getApiErrorMessage(error) {
  const data = error?.response?.data

  if (typeof data === 'string') {
    return data
  }

  return (
    data?.messageVi ||
    data?.message ||
    data?.error ||
    error?.message ||
    'Không thể kết nối đến hệ thống.'
  )
}
