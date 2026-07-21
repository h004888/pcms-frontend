import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, RefreshCcw, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listPayments } from '../api/paymentApi.js'

function formatVND(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '--'
  return d.toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

const METHOD_LABEL = {
  CASH: 'Tiền mặt',
  CARD: 'Thẻ',
  QR: 'QR',
  LOYALTY_POINTS: 'Điểm tích lũy',
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Đang xử lý' },
  { value: 'SUCCESS', label: 'Thành công' },
  { value: 'FAILED', label: 'Thất bại' },
  { value: 'PARTIALLY_REFUNDED', label: 'Hoàn tiền một phần' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
]

const STATUS_BADGE = {
  PENDING: 'badge badge-warning',
  SUCCESS: 'badge badge-success',
  FAILED: 'badge badge-muted',
  PARTIALLY_REFUNDED: 'badge badge-info',
  REFUNDED: 'badge badge-muted',
}

const STATUS_LABEL = {
  PENDING: 'Đang xử lý',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  PARTIALLY_REFUNDED: 'Hoàn một phần',
  REFUNDED: 'Đã hoàn tiền',
}

const PAGE_SIZE = 20

export function PaymentListPage() {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const paymentsQuery = useQuery({
    queryKey: ['payments', statusFilter],
    queryFn: () => listPayments({ page: 0, size: 200 }),
  })

  const allPayments = useMemo(
    () => paymentsQuery.data?.data || paymentsQuery.data?.content || [],
    [paymentsQuery.data],
  )

  const payments = useMemo(() => {
    if (statusFilter === 'ALL') return allPayments
    return allPayments.filter((p) => p.status === statusFilter)
  }, [allPayments, statusFilter])

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = payments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleReset() {
    setStatusFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý giao dịch</h1>
            <p className="page-description">
              Theo dõi lịch sử thanh toán và trạng thái giao dịch.
            </p>
          </div>
        </header>

        <section className="card" aria-labelledby="payment-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="payment-filter-title">Bộ lọc</h2>
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
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => paymentsQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </div>
        </section>

        <section className="card" aria-labelledby="payment-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="payment-list-title">Danh sách giao dịch</h2>
              <p className="card-subtitle">{payments.length} giao dịch</p>
            </div>
          </div>

          {paymentsQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách giao dịch...</div>
          ) : paymentsQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(paymentsQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không có giao dịch nào.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã hóa đơn</th>
                      <th>Phương thức</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((payment) => (
                      <tr key={payment.id}>
                        <td className="mono">
                          <strong>{payment.invoiceNumber || '--'}</strong>
                        </td>
                        <td>{METHOD_LABEL[payment.paymentMethod] || payment.paymentMethod}</td>
                        <td className="mono">{formatVND(payment.amount)}</td>
                        <td>
                          <span className={STATUS_BADGE[payment.status] || 'badge badge-muted'}>
                            {STATUS_LABEL[payment.status] || payment.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--ink-500)', fontSize: 13 }}>
                          {formatDateTime(payment.createdAt)}
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/payments/${payment.id}`}
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết giao dịch ${payment.invoiceNumber}`}
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
                <span className="card-subtitle">Trang {safePage}/{totalPages}</span>
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
