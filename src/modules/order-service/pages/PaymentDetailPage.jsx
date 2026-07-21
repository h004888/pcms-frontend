import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { createPayment, getOrderForPayment, getPayment } from '../api/paymentApi.js'

function formatVND(amount) {
  if (amount == null || isNaN(Number(amount))) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const METHOD_OPTIONS = [
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'CARD', label: 'Thẻ' },
  { value: 'QR', label: 'QR' },
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

export function PaymentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const paymentQuery = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(id),
    enabled: Boolean(id),
  })

  const payment = paymentQuery.data

  const orderQuery = useQuery({
    queryKey: ['order-for-payment', payment?.orderId],
    queryFn: () => getOrderForPayment(payment.orderId),
    enabled: Boolean(payment?.orderId),
  })

  const order = orderQuery.data
  const isPending = payment?.status === 'PENDING'

  // Editable state — only used when status is PENDING
  const [method, setMethod] = useState('CASH')
  const [tendered, setTendered] = useState('')
  const [reference, setReference] = useState('')

  const total = Number(payment?.amount || 0)
  const tenderedNum = Number(tendered) || 0
  const change = method === 'CASH' && tenderedNum >= total ? tenderedNum - total : 0

  const confirmMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success('Xác nhận thanh toán thành công!')
      navigate('/payments')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function handleConfirm() {
    if (method === 'CASH' && tenderedNum < total) {
      toast.error('Số tiền nhận không đủ.')
      return
    }
    let currentUser = {}
    try { currentUser = JSON.parse(localStorage.getItem('pcms_user') || '{}') } catch { /* ignore */ }
    confirmMutation.mutate({
      orderId: payment.orderId,
      paymentMethod: method,
      amount: total,
      tenderedAmount: method === 'CASH' ? tenderedNum : undefined,
      staffId: currentUser.id || undefined,
      transactionRef: method !== 'CASH' ? (reference || undefined) : undefined,
    })
  }

  const orderLabel = useMemo(() => {
    if (order?.orderNumber) return order.orderNumber
    if (payment?.invoiceNumber) return payment.invoiceNumber
    return payment?.orderId ? String(payment.orderId).slice(0, 8).toUpperCase() : '--'
  }, [order, payment])

  if (paymentQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin giao dịch...</div>
      </DashboardLayout>
    )
  }

  if (paymentQuery.isError || !payment) {
    return (
      <DashboardLayout>
        <div className="page-stack">
          <div className="error-state" role="alert">
            {getApiErrorMessage(paymentQuery.error) || 'Không tìm thấy giao dịch.'}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // For completed payments, use recorded values; for pending, use local state
  const displayMethod = isPending ? method : (payment.paymentMethod || 'CASH')
  const displayTendered = isPending ? tendered : (payment.tenderedAmount ?? '')
  const displayChange = isPending ? change : Number(payment.changeAmount || 0)
  const displayReference = isPending ? reference : (payment.transactionRef || '')

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <span className="page-kicker">Giao dịch</span>
            <h1 className="page-title">THANH TOÁN – Đơn {orderLabel}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {payment.status && (
              <span className={STATUS_BADGE[payment.status] || 'badge badge-muted'}>
                {STATUS_LABEL[payment.status] || payment.status}
              </span>
            )}
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => navigate('/payments')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Quay lại
            </button>
          </div>
        </header>

        <div className="card">
          <div className="card-body form-grid">
            {/* Tổng tiền */}
            <label className="field">
              <span className="field-label">Tổng tiền</span>
              <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
                <strong className="mono" style={{ fontSize: 18 }}>{formatVND(total)}</strong>
              </div>
            </label>

            {/* Phương thức */}
            <label className="field">
              <span className="field-label">Phương thức</span>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', height: 40 }}>
                {METHOD_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: isPending ? 'pointer' : 'default',
                      fontWeight: displayMethod === opt.value ? 600 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={opt.value}
                      checked={displayMethod === opt.value}
                      onChange={() => isPending && setMethod(opt.value)}
                      disabled={!isPending}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </label>

            {/* Tiền nhận (chỉ cho Tiền mặt) */}
            {displayMethod === 'CASH' && (
              <label className="field">
                <span className="field-label">Tiền nhận</span>
                {isPending ? (
                  <input
                    type="number"
                    className="input mono"
                    placeholder="VD: 100000"
                    min={total}
                    value={tendered}
                    onChange={(e) => setTendered(e.target.value)}
                    style={{ maxWidth: 220 }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
                    <span className="mono">{formatVND(displayTendered)}</span>
                  </div>
                )}
              </label>
            )}

            {/* Tiền thối (chỉ cho Tiền mặt) */}
            {displayMethod === 'CASH' && (
              <label className="field">
                <span className="field-label">Tiền thối</span>
                <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
                  <span className="mono" style={{ color: displayChange > 0 ? 'var(--color-success)' : 'var(--ink-500)' }}>
                    {formatVND(displayChange)}
                  </span>
                </div>
              </label>
            )}

            {/* Mã tham chiếu */}
            <label className="field">
              <span className="field-label">
                Mã tham chiếu
                {displayMethod !== 'CASH' && (
                  <span style={{ fontWeight: 400, color: 'var(--ink-400)', marginLeft: 6, fontSize: 12 }}>
                    (tự động cho Thẻ/QR)
                  </span>
                )}
              </span>
              {isPending ? (
                <input
                  type="text"
                  className="input mono"
                  placeholder={displayMethod === 'CASH' ? 'Không bắt buộc' : 'Tự động tạo nếu để trống'}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  style={{ maxWidth: 280 }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
                  <span className="mono">{displayReference || '--'}</span>
                </div>
              )}
            </label>

            {/* Bằng chứng chuyển khoản */}
            {isPending && (
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field-label">Bằng chứng chuyển khoản</span>
                <div style={{ marginTop: 8 }}>
                  <img
                    src="/images/payments/chuyenkhoan.jpg"
                    alt="Bằng chứng chuyển khoản"
                    style={{
                      maxWidth: 400,
                      maxHeight: 300,
                      borderRadius: 8,
                      border: '1px solid var(--ink-200)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className="card-body"
            style={{
              borderTop: '1px solid var(--ink-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              style={{ minWidth: 140 }}
              onClick={() => navigate('/payments')}
            >
              Hủy
            </button>
            {isPending && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ minWidth: 180 }}
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
