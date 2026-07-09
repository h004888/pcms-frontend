import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { getManagerName, normalizeSearch } from '../services/branchFormatters.js'

export function AssignManagerDialog({
  branch,
  managers,
  isPending,
  onClose,
  onConfirm,
}) {
  const [search, setSearch] = useState('')
  const [selectedManagerId, setSelectedManagerId] = useState(
    branch?.managerId || '',
  )
  const [error, setError] = useState('')
  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  )
  const filteredManagers = useMemo(() => {
    const keyword = normalizeSearch(search)

    if (!keyword) {
      return managers
    }

    return managers.filter((manager) =>
      [manager.fullName, manager.email, manager.phone]
        .filter(Boolean)
        .some((value) => normalizeSearch(String(value)).includes(keyword)),
    )
  }, [managers, search])

  if (!branch) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedManagerId) {
      setError('Vui lòng chọn quản lý chi nhánh.')
      return
    }

    onConfirm(selectedManagerId)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-manager-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <div>
              <h2 className="modal-title" id="assign-manager-title">
                Gán quản lý chi nhánh
              </h2>
              <p className="card-subtitle">
                Hiện tại: {getManagerName(branch, managersById)}
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
            <label className="field">
              <span className="field-label">Tìm nhân sự</span>
              <span style={{ position: 'relative' }}>
                <Search
                  size={16}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                    color: 'var(--ink-400)',
                  }}
                />
                <input
                  className="input"
                  style={{ paddingLeft: 36 }}
                  value={search}
                  placeholder="Tên, email hoặc số điện thoại"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </span>
            </label>

            <div className="radio-list">
              {filteredManagers.map((manager) => (
                <label className="radio-row" key={manager.id}>
                  <input
                    type="radio"
                    name="managerId"
                    value={manager.id}
                    checked={selectedManagerId === manager.id}
                    onChange={(event) => {
                      setSelectedManagerId(event.target.value)
                      setError('')
                    }}
                  />
                  <span>
                    <strong>{manager.fullName || manager.email}</strong>
                    <span className="card-subtitle">
                      {manager.email} · {manager.phone || 'Chưa có số điện thoại'}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {filteredManagers.length === 0 ? (
              <div className="empty-state">Không tìm thấy quản lý phù hợp.</div>
            ) : null}
            {error ? <p className="field-error">{error}</p> : null}
          </div>

          <footer className="modal-footer">
            <button className="btn btn-outline" type="button" onClick={onClose}>
              Hủy
            </button>
            <button className="btn btn-primary" type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu phân công'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
