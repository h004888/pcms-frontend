import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, Plus, RefreshCcw, RotateCcw, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listCustomers } from '../api/customerApi.js'
import { CreateCustomerModal } from '../components/CreateCustomerModal.jsx'
import {
  formatTierBadgeClass,
  formatTierLabel,
  formatPoints,
  normalizeSearch,
} from '../services/customerFormatters.js'



const PAGE_SIZE = 10

const TIER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả hạng' },
  { value: 'BRONZE', label: 'Đồng' },
  { value: 'SILVER', label: 'Bạc' },
  { value: 'GOLD', label: 'Vàng' },
  { value: 'PLATINUM', label: 'Bạch kim' },
]

export function CustomerListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: () => listCustomers({ page: 0, size: 200 }),
  })

  const customers = useMemo(
    () => customersQuery.data?.data || [],
    [customersQuery.data?.data],
  )

  const filteredCustomers = useMemo(() => {
    const keyword = normalizeSearch(appliedSearch)
    return customers.filter((c) => {
      const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter
      const matchesSearch =
        !keyword ||
        [c.code, c.name, c.phone]
          .filter(Boolean)
          .some((v) => normalizeSearch(String(v)).includes(keyword))
      return matchesTier && matchesSearch
    })
  }, [customers, appliedSearch, tierFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredCustomers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const totalPoints = useMemo(
    () => customers.reduce((sum, c) => sum + (c.points || 0), 0),
    [customers],
  )

  function handleSearch(event) {
    event.preventDefault()
    setAppliedSearch(searchInput)
    setPage(1)
  }

  function handleReset() {
    setSearchInput('')
    setAppliedSearch('')
    setTierFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý khách hàng</h1>
            <p className="page-description">
              Theo dõi danh sách khách hàng, điểm tích lũy, hạng thành viên và lịch sử giao dịch.
            </p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setCreateOpen(true)}>
            <Plus size={16} aria-hidden="true" />
            Thêm khách hàng
          </button>
        </header>

        <section className="card" aria-labelledby="customer-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="customer-filter-title">
                Bộ lọc
              </h2>
              <p className="card-subtitle">Tìm theo mã khách hàng hoặc số điện thoại.</p>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>

          <form className="card-body toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Tìm khách hàng</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="VD: CUST-001, 09xxxxxxxx..."
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Hạng thành viên</span>
              <select
                className="select"
                value={tierFilter}
                onChange={(event) => {
                  setTierFilter(event.target.value)
                  setPage(1)
                }}
              >
                {TIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
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
              onClick={() => customersQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="customer-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="customer-list-title">
                Danh sách khách hàng
              </h2>
              <p className="card-subtitle">{filteredCustomers.length} khách hàng phù hợp.</p>
            </div>
          </div>

          {customersQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách khách hàng...</div>
          ) : customersQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(customersQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy khách hàng.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Họ và tên</th>
                      <th>Số điện thoại</th>
                      <th>Điểm</th>
                      <th>Hạng</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((customer) => (
                      <tr key={customer.id}>
                        <td className="mono">{customer.code}</td>
                        <td>
                          <strong>{customer.name}</strong>
                        </td>
                        <td className="mono">{customer.phone}</td>
                        <td className="mono">{formatPoints(customer.points)}</td>
                        <td>
                          <span className={formatTierBadgeClass(customer.tier)}>
                            {formatTierLabel(customer.tier)}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/customers/${customer.id}`}
                              title="Xem lịch sử"
                              aria-label={`Xem lịch sử ${customer.name}`}
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
                          </div>
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
                <div className="pagination-actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Trước
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }} aria-label="Tổng quan khách hàng">
          <div className="stat-card">
            <div>
              <p className="stat-title">Tổng khách hàng</p>
              <p className="stat-value mono">{formatPoints(customers.length)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Tổng điểm tích lũy</p>
              <p className="stat-value mono">{formatPoints(totalPoints)}</p>
            </div>
          </div>
        </div>
      </div>

      <CreateCustomerModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </DashboardLayout>
  )
}
