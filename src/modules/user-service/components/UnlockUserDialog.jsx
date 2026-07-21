export function UnlockUserDialog({ user, isPending, onClose, onConfirm }) {
  if (!user) return null

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="unlock-dialog-title">
        <div className="modal-header">
          <h2 className="modal-title" id="unlock-dialog-title">Kích hoạt tài khoản</h2>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-700)' }}>
            Bạn có chắc chắn muốn kích hoạt lại tài khoản <strong>{user.fullName}</strong>?
          </p>
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
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Đang xử lý...' : 'Kích hoạt'}
          </button>
        </div>
      </div>
    </div>
  )
}
