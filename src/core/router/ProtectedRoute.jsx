import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@modules/customer-portal-service/hooks/useAuth.js'

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return children
}
