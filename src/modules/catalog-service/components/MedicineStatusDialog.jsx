import { AlertTriangle, X } from 'lucide-react'

export function MedicineStatusDialog({ medicine, isPending, onClose, onConfirm }) {
  const willActivate = medicine?.status !== 'ACTIVE'

  if (!medicine) return null

  function handleSubmit(event) {
    event.preventDefault()
    onConfirm({ medicine })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal medicine-status-modal" role="dialog" aria-modal="true" aria-labelledby="medicine-status-title">
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <h2 className="modal-title" id="medicine-status-title">{willActivate ? 'Kích hoạt thuốc' : 'Ngừng hoạt động thuốc'}</h2>
            <button className="btn btn-ghost btn-icon" type="button" aria-label="Đóng" onClick={onClose}><X size={18} aria-hidden="true" /></button>
          </header>
          <div className="modal-body">
            <div className="medicine-status-warning" role="alert"><AlertTriangle size={32} aria-hidden="true" /><span>{willActivate ? 'Thuốc sẽ hiển thị lại trong danh mục đang hoạt động.' : 'Thuốc sẽ bị ẩn khỏi danh sách đang hoạt động và không thể chọn khi tạo đơn mới.'}</span></div>
            <div className="medicine-status-summary"><strong>Thuốc: {medicine.name} <span className="mono">({medicine.sku})</span></strong><span>Tồn kho hiện tại: Theo lô</span></div>
            <label className="field" style={{ marginTop: 16 }}><span className="field-label">Lý do (không bắt buộc)</span><textarea className="textarea" maxLength={255} placeholder="Nhập lý do ngừng hoạt động..." /></label>
          </div>
          <footer className="modal-footer"><button className="btn btn-outline" type="button" onClick={onClose}>Hủy</button><button className={willActivate ? 'btn btn-primary' : 'btn btn-danger'} type="submit" disabled={isPending}>{isPending ? 'Đang lưu...' : willActivate ? 'Kích hoạt' : 'Ngừng hoạt động'}</button></footer>
        </form>
      </section>
    </div>
  )
}
