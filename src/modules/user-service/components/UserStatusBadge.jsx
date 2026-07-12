import { ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react'

export function UserStatusBadge({ status }) {
  if (status === 'ACTIVE') {
    return (
      <span className="badge badge-success">
        <ShieldCheck size={13} aria-hidden="true" />
        Đang hoạt động
      </span>
    )
  }

  if (status === 'LOCKED') {
    return (
      <span className="badge badge-danger">
        <ShieldAlert size={13} aria-hidden="true" />
        Đã khóa
      </span>
    )
  }

  return (
    <span className="badge badge-muted">
      <ShieldOff size={13} aria-hidden="true" />
      Ngưng hoạt động
    </span>
  )
}
