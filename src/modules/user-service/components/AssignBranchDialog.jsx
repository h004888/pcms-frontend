import { useState, useEffect } from 'react'

export function AssignBranchDialog({ user, branches, isPending, onClose, onConfirm }) {
  const [branchId, setBranchId] = useState('')

  useEffect(() => {
    if (user) {
      setBranchId(user.branchId || '')
    }
  }, [user])

  if (!user) return null

  function handleSubmit(e) {
    e.preventDefault()
    onConfirm(branchId || null)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="assign-branch-title">
        <div className="modal-header">
          <h2 className="modal-title" id="assign-branch-title">Gán chi nhánh</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="card-subtitle" style={{ margin: '0 0 16px' }}>
              Phân công <strong>{user.fullName}</strong> ({user.role}) làm việc tại chi nhánh.
            </p>

            <label className="field">
              <span className="field-label">Chọn chi nhánh</span>
              <select
                className="select"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                <option value="">-- Không gán chi nhánh (Toàn hệ thống) --</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
            </label>
            <p className="field-hint" style={{ marginTop: '8px' }}>
              Lưu ý: Admin và CEO thường không gắn với một chi nhánh cụ thể. Quản lý chi nhánh và dược sĩ bắt buộc phải gắn với 1 chi nhánh để có thể thao tác với tồn kho và đơn hàng.
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
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Đang lưu...' : 'Cập nhật phân công'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
