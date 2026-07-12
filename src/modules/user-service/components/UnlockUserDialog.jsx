export function UnlockUserDialog({ user, isPending, onClose, onConfirm }) {
  if (!user) return null

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="unlock-dialog-title">
        <div className="modal-header">
          <h2 className="modal-title" id="unlock-dialog-title">Mở khóa tài khoản</h2>
        </div>
        
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
            Tài khoản <strong>{user.fullName}</strong> đã bị khóa do nhập sai mật khẩu quá 5 lần (hoặc bị khóa thủ công).
            Bạn có muốn mở khóa tài khoản này ngay bây giờ?
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
            {isPending ? 'Đang xử lý...' : 'Mở khóa ngay'}
          </button>
        </div>
      </div>
    </div>
  )
}
