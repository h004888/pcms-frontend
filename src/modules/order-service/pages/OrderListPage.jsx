import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, Plus, RefreshCcw, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listOrders } from '../api/orderApi.js'

function formatVND(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '--'
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'REJECTED', label: 'Từ chối' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

const STATUS_BADGE = {
  PENDING_PAYMENT: 'badge badge-warning',
  APPROVED: 'badge badge-info',
  PAID: 'badge badge-success',
  COMPLETED: 'badge badge-success',
  REJECTED: 'badge badge-muted',
  CANCELLED: 'badge badge-muted',
}

const STATUS_LABEL = {
  PENDING_PAYMENT: 'Chờ TT',
  APPROVED: 'Đã duyệt',
  PAID: 'Đã TT',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
}

const PAGE_SIZE = 20

export function OrderListPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      page: 0,
      size: 200,
    }),
    [statusFilter],
  )

  const ordersQuery = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => listOrders(params),
  })

  const orders = useMemo(
    () => ordersQuery.data?.data || ordersQuery.data?.content || [],
    [ordersQuery.data],
  )

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = orders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleReset() {
    setStatusFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý đơn hàng</h1>
            <p className="page-description">
              Theo dõi và xử lý tất cả đơn hàng tại quầy và trực tuyến.
            </p>
          </div>
          <Link className="btn btn-primary" to="/orders/new">
            <Plus size={16} aria-hidden="true" />
            Tạo đơn hàng
          </Link>
        </header>

        <section className="card" aria-labelledby="order-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="order-filter-title">Bộ lọc</h2>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>
          <div className="card-body toolbar">
            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => ordersQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </div>
        </section>

        <section className="card" aria-labelledby="order-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="order-list-title">Danh sách đơn hàng</h2>
              <p className="card-subtitle">{orders.length} đơn hàng</p>
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách đơn hàng...</div>
          ) : ordersQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(ordersQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không có đơn hàng nào.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                      <th>Ngày tạo</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((order) => (
                      <tr key={order.id}>
                        <td className="mono">
                          <strong>{order.orderNumber}</strong>
                        </td>
                        <td>
                          <span className={STATUS_BADGE[order.status] || 'badge badge-muted'}>
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                        </td>
                        <td className="mono">{formatVND(order.total)}</td>
                        <td style={{ color: 'var(--ink-500)', fontSize: 13 }}>
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/orders/${order.id}`}
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết đơn ${order.orderNumber}`}
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
      </div>
    </DashboardLayout>
  )
}
