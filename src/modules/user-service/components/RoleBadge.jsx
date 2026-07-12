import { getRoleLabel } from '../services/userFormatters'

export function RoleBadge({ role }) {
  const label = getRoleLabel(role)
  
  if (role === 'ADMIN' || role === 'CEO') {
    return (
      <span className="badge badge-info">
        {label}
      </span>
    )
  }
  
  return (
    <span className="badge badge-muted">
      {label}
    </span>
  )
}
