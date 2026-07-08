import { useState, useEffect } from 'react'
import { ROLE_OPTIONS } from '../services/userFormatters'

export function ChangeRoleDialog({ user, isPending, onClose, onConfirm }) {
  const [role, setRole] = useState('')

  useEffect(() => {
    if (user) {
      setRole(user.role)
    }
  }, [user])

  if (!user) return null

  function handleSubmit(e) {
    e.preventDefault()
    onConfirm(role)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="role-dialog-title">
        <div className="modal-header">
          <h2 className="modal-title" id="role-dialog-title">Thay đổi vai trò</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="card-subtitle" style={{ margin: '0 0 16px' }}>
              Thay đổi vai trò cho người dùng <strong>{user.fullName}</strong> ({user.email}).
            </p>

            <div className="radio-list">
              {ROLE_OPTIONS.map((option) => (
                <label key={option.value} className="radio-row">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending || role === user.role}
            >
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
