import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCcw, Search, Shield } from 'lucide-react'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getAuditLogs } from '../api/userApi.js'
import { formatDateTime } from '../services/userFormatters.js'

const PAGE_SIZE = 15

export function AuditLogPage() {
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const logsQuery = useQuery({
    queryKey: ['audit-logs', appliedSearch, actionFilter],
    queryFn: () => {
      const params = { page: 0, size: 500 }
      if (appliedSearch) params.userId = appliedSearch
      if (actionFilter !== 'ALL') params.action = actionFilter
      return getAuditLogs(params)
    },
  })

  const logs = useMemo(() => logsQuery.data?.data || [], [logsQuery.data?.data])
  
  // Local filtering & pagination
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = !appliedSearch || 
        String(log.userId).includes(appliedSearch) || 
        String(log.targetId).includes(appliedSearch) ||
        (log.description || '').toLowerCase().includes(appliedSearch.toLowerCase())
      
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter
      
      return matchSearch && matchAction
    })
  }, [logs, appliedSearch, actionFilter])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredLogs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // Derive unique actions for filter options
  const actionOptions = useMemo(() => {
    const actions = new Set(logs.map(l => l.action))
    return Array.from(actions).sort()
  }, [logs])

  function handleSearch(e) {
    e.preventDefault()
    setAppliedSearch(searchInput)
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Nhật ký hệ thống</h1>
            <p className="page-description">
              Theo dõi và kiểm toán các hoạt động bảo mật, đăng nhập và quản lý người dùng.
            </p>
          </div>
        </header>

        <section className="card" aria-labelledby="audit-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="audit-filter-title">Bộ lọc</h2>
            </div>
          </div>

          <form className="card-body toolbar" onSubmit={handleSearch} style={{ gridTemplateColumns: 'minmax(250px, 1fr) 200px auto auto' }}>
            <label className="field">
              <span className="field-label">Tìm theo ID hoặc mô tả</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="User ID, Target ID, hoặc nội dung..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Loại hoạt động</span>
              <select
                className="select"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả hoạt động</option>
                {actionOptions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm kiếm
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => logsQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Kết quả truy xuất</h2>
              <p className="card-subtitle">{filteredLogs.length} sự kiện phù hợp.</p>
            </div>
          </div>

          {logsQuery.isLoading ? (
            <div className="empty-state">Đang tải nhật ký...</div>
          ) : logsQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(logsQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy dữ liệu nhật ký phù hợp.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                      <th>User ID (Người thao tác)</th>
                      <th>Target ID (Đối tượng)</th>
                      <th>IP Address</th>
                      <th>Mô tả chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map(log => (
                      <tr key={log.id}>
                        <td>{formatDateTime(log.createdAt)}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--ink-700)', fontWeight: 500, background: 'var(--ink-100)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
                            <Shield size={12} />
                            {log.action}
                          </span>
                        </td>
                        <td className="mono">{log.userId}</td>
                        <td className="mono">{log.targetId || '—'}</td>
                        <td className="mono">{log.ipAddress || '—'}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'normal', lineHeight: 1.5 }}>
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="card-subtitle">
                  Trang {safePage}/{totalPages}
                </span>
                <div className="pagination-actions" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) => p === '...' ? (
                      <span key={`dots-${i}`} style={{ padding: '0 8px', color: 'var(--ink-500)' }}>...</span>
                    ) : (
                      <button
                        key={p}
                        className={p === safePage ? "btn btn-primary" : "btn btn-outline"}
                        style={p === safePage ? {} : { borderColor: 'var(--ink-200)', color: 'var(--ink-700)' }}
                        type="button"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))
                  }

                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
