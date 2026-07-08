import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'

export function MedicineStatusDialog({
  medicine,
  isPending,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const willActivate = medicine?.status !== 'ACTIVE'

  if (!medicine) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!reason.trim()) {
      setError('Vui lòng nhập lý do thay đổi trạng thái.')
      return
    }

    onConfirm({ medicine, reason: reason.trim() })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="medicine-status-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <div>
              <h2 className="modal-title" id="medicine-status-title">
                {willActivate ? 'Kích hoạt thuốc' : 'Ngưng kinh doanh thuốc'}
              </h2>
              <p className="card-subtitle">
                {medicine.name} · <span className="mono">{medicine.sku}</span>
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
            <div className="detail-item" style={{ marginBottom: 16 }}>
              <span className="detail-label">Trạng thái hiện tại</span>
              <StatusBadge status={medicine.status} />
            </div>

            <div className="error-state" role="alert">
              <AlertTriangle size={20} aria-hidden="true" />
              <span>
                {willActivate
                  ? 'Thuốc sẽ hiển thị lại trong danh mục đang hoạt động.'
                  : 'Thuốc sẽ tạm ngưng kinh doanh và không còn được ưu tiên chọn trong thao tác mới.'}
              </span>
            </div>

            <label className="field" style={{ marginTop: 16 }}>
              <span className="field-label">Lý do</span>
              <textarea
                className="textarea"
                maxLength={255}
                value={reason}
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
