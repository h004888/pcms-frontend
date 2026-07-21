export function DeleteUserDialog({ user, isPending, onClose, onConfirm }) {
  if (!user) return null

  return (
    <div className="modal-backdrop" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
      <div className="card" role="dialog" aria-modal="true" style={{ width: '400px', backgroundColor: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--ink-200)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--ink-200)', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--ink-900)' }}>
            Xóa người dùng
          </h2>
        </div>
        
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '16px', color: 'var(--ink-700)', lineHeight: '1.5' }}>
            Bạn có chắc chắn muốn xóa<br />người dùng này không?
          </p>
        </div>
        
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isPending}
            style={{ minWidth: '100px' }}
          >
            {isPending ? 'Đang xóa...' : 'Xác nhận'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isPending}
            style={{ minWidth: '100px' }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
