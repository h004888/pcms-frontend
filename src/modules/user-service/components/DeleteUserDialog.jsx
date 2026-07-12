export function DeleteUserDialog({ user, isPending, onClose, onConfirm }) {
  if (!user) return null

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
        <div className="modal-header">
          <h2 className="modal-title" id="delete-dialog-title">Xác nhận xóa tài khoản</h2>
        </div>
        
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
            Bạn có chắc chắn muốn xóa tài khoản <strong>{user.fullName}</strong> ({user.email})? 
            Hành động này sẽ xóa quyền truy cập của người dùng nhưng vẫn giữ lại lịch sử hoạt động liên quan.
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
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Đang xóa...' : 'Xóa tài khoản'}
          </button>
        </div>
      </div>
    </div>
  )
}
