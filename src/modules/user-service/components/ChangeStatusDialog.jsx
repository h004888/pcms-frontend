import { useState, useEffect } from 'react'
import { STATUS_OPTIONS } from '../services/userFormatters'

export function ChangeStatusDialog({ user, isPending, onClose, onConfirm }) {
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (user) {
      setStatus(user.status)
    }
  }, [user])

  if (!user) return null

  function handleSubmit(e) {
    e.preventDefault()
    onConfirm(status)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="status-dialog-title">
        <div className="modal-header">
          <h2 className="modal-title" id="status-dialog-title">Đổi trạng thái hoạt động</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="card-subtitle" style={{ margin: '0 0 16px' }}>
              Thay đổi trạng thái cho người dùng <strong>{user.fullName}</strong>.
            </p>

            <div className="radio-list">
              {STATUS_OPTIONS.map((option) => (
                <label key={option.value} className="radio-row">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={(e) => setStatus(e.target.value)}
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
              disabled={isPending || status === user.status}
            >
              {isPending ? 'Đang lưu...' : 'Cập nhật trạng thái'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
