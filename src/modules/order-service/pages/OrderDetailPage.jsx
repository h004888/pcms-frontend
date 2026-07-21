import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getOrder, updateOrderStatus } from '../api/orderApi.js'

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

const STATUS_BADGE = {
  PENDING_PAYMENT: 'badge badge-warning',
  APPROVED: 'badge badge-info',
  PAID: 'badge badge-success',
  COMPLETED: 'badge badge-success',
  REJECTED: 'badge badge-muted',
  CANCELLED: 'badge badge-muted',
}

const STATUS_LABEL = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  APPROVED: 'Đã duyệt',
  PAID: 'Đã thanh toán',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
}

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const orderQuery = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  })

  const order = orderQuery.data?.data || orderQuery.data || null

  const cancelMutation = useMutation({
    mutationFn: () => updateOrderStatus(id, 'CANCELLED'),
    onSuccess: () => {
      toast.success('Đã hủy đơn hàng.')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const items = order?.items || order?.orderItems || []
  const subtotal = items.reduce((sum, item) => {
    const line = (item.unitPrice ?? 0) * (item.quantity ?? item.qty ?? 0)
    return sum + line
  }, 0)
  const discount = order?.discount ?? order?.discountAmount ?? 0
  const total = order?.total ?? order?.totalAmount ?? subtotal - discount

  const isPending = order?.status === 'PENDING_PAYMENT'
  const isCancellable = isPending || order?.status === 'APPROVED'

  if (orderQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="page-stack">
          <div className="empty-state">Đang tải chi tiết đơn hàng...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (orderQuery.isError) {
    return (
      <DashboardLayout>
        <div className="page-stack">
          <div className="error-state" role="alert">{getApiErrorMessage(orderQuery.error)}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/orders')}
              style={{ marginBottom: 8 }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Quay lại danh sách
            </button>
            <h1 className="page-title">
              Đơn hàng {order?.orderNumber || id}
            </h1>
            {order?.status && (
              <span className={STATUS_BADGE[order.status] || 'badge badge-muted'} style={{ marginTop: 4, display: 'inline-block' }}>
                {STATUS_LABEL[order.status] || order.status}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isPending && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/payments?orderId=${id}`)}
              >
                <CreditCard size={16} aria-hidden="true" />
                Thanh toán
              </button>
            )}
          </div>
        </header>

        {/* Order Info */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Thông tin đơn hàng</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Mã đơn hàng</p>
                <p style={{ fontWeight: 600, fontFamily: 'monospace' }}>{order?.orderNumber || '--'}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Ngày tạo</p>
                <p>{formatDateTime(order?.createdAt)}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Chi nhánh</p>
                <p>{order?.branchId || '--'}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Nhân viên</p>
                <p>{order?.staffId || order?.createdBy || '--'}</p>
              </div>
              {order?.customerId && (
                <div>
                  <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Khách hàng</p>
                  <p>{order?.customerName || order?.customerId}</p>
                </div>
              )}
              {order?.couponCode && (
                <div>
                  <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Mã giảm giá</p>
                  <p style={{ fontFamily: 'monospace' }}>{order.couponCode}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Chi tiết sản phẩm</h2>
          </div>
          {items.length === 0 ? (
            <div className="empty-state">Không có sản phẩm.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thuốc</th>
                    <th style={{ textAlign: 'right' }}>Số lượng</th>
                    <th style={{ textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const qty = item.quantity ?? item.qty ?? 0
                    const price = item.unitPrice ?? 0
                    const line = qty * price
                    return (
                      <tr key={item.id || idx}>
                        <td>{item.medicineName || item.name || item.medicineId}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{qty}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatVND(price)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatVND(line)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="card-body" style={{ borderTop: '1px solid var(--ink-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ minWidth: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--ink-500)' }}>Tạm tính:</span>
                  <span style={{ fontFamily: 'monospace' }}>{formatVND(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'var(--ink-500)' }}>Giảm giá:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--color-error)' }}>- {formatVND(discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--ink-200)', fontWeight: 700 }}>
                  <span>TỔNG CỘNG:</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{formatVND(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/orders')}
          >
            Quay lại
          </button>
          {isCancellable && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={cancelMutation.isPending}
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                  cancelMutation.mutate()
                }
              }}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
