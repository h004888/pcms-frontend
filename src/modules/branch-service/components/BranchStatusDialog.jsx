import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function BranchStatusDialog({
  branch,
  isPending,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const willActivate = branch?.status !== 'ACTIVE'

  useEffect(() => {
    setReason('')
    setError('')
  }, [branch?.id])

  if (!branch) return null

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
        className="modal branch-status-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-status-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <h2 className="modal-title" id="branch-status-title">
              {willActivate ? 'Kích hoạt chi nhánh' : 'Ngưng hoạt động chi nhánh'}
            </h2>
            <button
              className="btn btn-ghost btn-icon"
              type="button"
              aria-label="Đóng"
              onClick={onClose}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="modal-body branch-status-body">
            <p className="branch-status-confirmation">
              {willActivate
                ? 'Bạn có chắc chắn muốn kích hoạt chi nhánh này không? Bạn có thể ngưng hoạt động lại sau.'
                : 'Bạn có chắc chắn muốn ngưng hoạt động chi nhánh này không? Bạn có thể kích hoạt lại sau.'}
            </p>

            <section className="branch-status-selected" aria-labelledby="selected-branch-title">
              <h3 id="selected-branch-title">Chi nhánh được chọn</h3>
              <dl>
                <div>
                  <dt>Mã chi nhánh</dt>
                  <dd className="mono">{branch.code}</dd>
                </div>
                <div>
                  <dt>Tên chi nhánh</dt>
                  <dd>{branch.name}</dd>
                </div>
                <div>
                  <dt>Địa chỉ</dt>
                  <dd>{branch.address}</dd>
                </div>
                <div>
                  <dt>Trạng thái hiện tại</dt>
                  <dd>
                    <span className="branch-status-summary-pill">
                      {branch.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            <label className="field branch-status-reason">
              <span className="field-label">Lý do <span aria-hidden="true">*</span></span>
              <textarea
                className="textarea"
                value={reason}
                maxLength={255}
                placeholder="Vui lòng nhập lý do..."
                onChange={(event) => {
                  setReason(event.target.value)
                  setError('')
                }}
              />
              {error ? <span className="field-error">{error}</span> : null}
            </label>
          </div>

          <footer className="modal-footer branch-status-footer">
            <button className="btn btn-outline" type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Xác nhận'}
            </button>
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Hủy
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
