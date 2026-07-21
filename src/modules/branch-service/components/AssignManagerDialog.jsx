import { useEffect, useMemo, useState } from 'react'
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
  const [selectedManagerId, setSelectedManagerId] = useState('')
  const [error, setError] = useState('')
  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  )
  const filteredManagers = useMemo(() => {
    const keyword = normalizeSearch(search)

    if (!keyword) return managers

    return managers.filter((manager) =>
      [manager.fullName, manager.email, manager.phone]
        .filter(Boolean)
        .some((value) => normalizeSearch(String(value)).includes(keyword)),
    )
  }, [managers, search])

  useEffect(() => {
    setSearch('')
    setError('')
    setSelectedManagerId(branch?.managerId || '')
  }, [branch?.id, branch?.managerId])

  if (!branch) return null

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedManagerId) {
      setError('Vui lòng chọn quản lý.')
      return
    }

    onConfirm(selectedManagerId)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal assign-manager-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-manager-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <h2 className="modal-title" id="assign-manager-title">
              Gán quản lý
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

          <div className="modal-body assign-manager-body">
            <dl className="assign-manager-context">
              <div>
                <dt>Chi nhánh</dt>
                <dd>{branch.name} ({branch.code})</dd>
              </div>
              <div>
                <dt>Quản lý hiện tại</dt>
                <dd>{getManagerName(branch, managersById)}</dd>
              </div>
            </dl>

            <label className="field assign-manager-search">
              <span className="field-label">Tìm nhân sự</span>
              <span className="input-with-icon">
                <Search size={16} aria-hidden="true" />
                <input
                  className="input"
                  value={search}
                  placeholder="Tìm theo tên, email hoặc số điện thoại..."
                  onChange={(event) => setSearch(event.target.value)}
                />
              </span>
            </label>

            <section aria-labelledby="select-manager-title">
              <h3 className="assign-manager-table-title" id="select-manager-title">
                Chọn quản lý
              </h3>
              <div className="assign-manager-table-wrap">
                <table className="assign-manager-table">
                  <thead>
                    <tr>
                      <th scope="col" aria-label="Chọn quản lý" />
                      <th scope="col">Tên nhân sự</th>
                      <th scope="col">Email</th>
                      <th scope="col">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredManagers.map((manager) => (
                      <tr
                        className={
                          selectedManagerId === manager.id ? 'is-selected' : undefined
                        }
                        key={manager.id}
                      >
                        <td>
                          <input
                            aria-label={`Chọn ${manager.fullName || manager.email}`}
                            type="radio"
                            name="managerId"
                            value={manager.id}
                            checked={selectedManagerId === manager.id}
                            onChange={(event) => {
                              setSelectedManagerId(event.target.value)
                              setError('')
                            }}
                          />
                        </td>
                        <td>{manager.fullName || '--'}</td>
                        <td>{manager.email || '--'}</td>
                        <td className="mono">{manager.phone || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredManagers.length === 0 ? (
                <div className="empty-state">Không tìm thấy nhân sự phù hợp.</div>
              ) : null}
            </section>

            {error ? <p className="field-error">{error}</p> : null}
          </div>

          <footer className="modal-footer assign-manager-footer">
            <button className="btn btn-outline" type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu'}
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
