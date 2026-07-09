import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function BranchStatusDialog({
  branch,
  isPending,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const willActivate = branch?.status !== 'ACTIVE'

  if (!branch) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!reason.trim()) {
      setError('Vui lòng nhập lý do thay đổi trạng thái.')
      return
    }

    onConfirm({ branch, reason: reason.trim() })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-status-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <div>
              <h2 className="modal-title" id="branch-status-title">
                {willActivate ? 'Kích hoạt chi nhánh' : 'Ngưng hoạt động chi nhánh'}
              </h2>
              <p className="card-subtitle">
                {branch.name} · <span className="mono">{branch.code}</span>
              </p>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              type="button"
              aria-label="Đóng"
              onClick={onClose}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="modal-body">
            <div className="error-state" role="alert">
              <AlertTriangle size={20} aria-hidden="true" />
              <span>
                {willActivate
                  ? 'Chi nhánh sẽ được mở lại để vận hành.'
                  : 'Chi nhánh sẽ tạm ngưng vận hành và không còn được chọn trong các thao tác mới.'}
              </span>
            </div>

            <label className="field" style={{ marginTop: 16 }}>
              <span className="field-label">Lý do</span>
              <textarea
                className="textarea"
                value={reason}
                maxLength={255}
                placeholder="Nhập lý do để lưu vết thao tác"
                onChange={(event) => {
                  setReason(event.target.value)
                  setError('')
                }}
              />
              {error ? <span className="field-error">{error}</span> : null}
            </label>
          </div>

          <footer className="modal-footer">
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Hủy
            </button>
            <button
              className={willActivate ? 'btn btn-primary' : 'btn btn-danger'}
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Đang lưu...' : willActivate ? 'Kích hoạt' : 'Ngưng hoạt động'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
