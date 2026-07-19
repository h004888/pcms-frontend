import { useMemo } from 'react'

export function useAuth() {
  const token = localStorage.getItem('pcms_access_token')
  const userRaw = localStorage.getItem('pcms_user')

  const user = useMemo(() => {
    try { return userRaw ? JSON.parse(userRaw) : null }
    catch { return null }
  }, [userRaw])

  return {
    isAuthenticated: !!token,
    token,
    user,
  }
}
