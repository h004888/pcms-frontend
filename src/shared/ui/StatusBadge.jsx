import { CheckCircle2, CircleSlash2 } from 'lucide-react'

export function StatusBadge({ status }) {
  const active = status === 'ACTIVE'

  return (
    <span className={`badge ${active ? 'badge-success' : 'badge-muted'}`}>
      {active ? (
        <CheckCircle2 size={13} aria-hidden="true" />
      ) : (
        <CircleSlash2 size={13} aria-hidden="true" />
      )}
      {active ? 'Đang hoạt động' : 'Ngưng hoạt động'}
    </span>
  )
}
