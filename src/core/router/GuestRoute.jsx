import { Navigate } from 'react-router-dom'
import { useAuth } from '@modules/customer-portal-service/hooks/useAuth.js'

function getDefaultRoute(role) {
  if (role === 'ADMIN' || role === 'CEO') return '/user-dashboard'
  if (role === 'CUSTOMER') return '/'
  return '/branches'
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute(user?.role)} replace />
  }

  return children
}
