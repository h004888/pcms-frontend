import { apiClient } from '@core/http/apiClient.js'

/** POST /auth/login */
export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

/** POST /auth/register */
export async function register(payload) {
  const response = await apiClient.post('/auth/register', payload)
  return response.data
}

/** POST /auth/forgot-password */
export async function forgotPassword(email) {
  const response = await apiClient.post('/auth/forgot-password', { email })
  return response.data
}

/** POST /auth/reset-password */
export async function resetPassword(token, newPassword) {
  const response = await apiClient.post('/auth/reset-password', {
    token,
    newPassword,
  })
  return response.data
}

/** POST /auth/refresh */
export async function refreshToken(refreshTokenValue) {
  const response = await apiClient.post('/auth/refresh', {
    refreshToken: refreshTokenValue,
  })
  return response.data
}

/** POST /auth/logout */
export async function logout(refreshTokenValue) {
  const token = localStorage.getItem('pcms_access_token')
  await apiClient.post('/auth/logout', {
    refreshToken: refreshTokenValue,
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

/** GET /auth/me */
export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me')
  return response.data
}

/** PUT /auth/password */
export async function changePassword(currentPassword, newPassword, confirmPassword) {
  const response = await apiClient.put('/auth/password', {
    currentPassword,
    newPassword,
    confirmPassword,
  })
  return response.data
}

/** POST /auth/verify-email */
export async function verifyEmail(token) {
  const response = await apiClient.post('/auth/verify-email', { token })
  return response.data
}

/** POST /auth/resend-verification */
export async function resendVerification(email) {
  const response = await apiClient.post('/auth/resend-verification', { email })
  return response.data
}
