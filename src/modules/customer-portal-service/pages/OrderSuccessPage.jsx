import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getOrderByNumber } from '../api/shopApi'
import { formatPrice } from '../utils/formatPrice'
import './OrderSuccessPage.css'

export function OrderSuccessPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      getOrderByNumber(orderNumber)
        .then(data => setOrder(data))
        .catch(() => setOrder(null))
        .finally(() => setLoading(false))
    }
  }, [orderNumber])

  if (loading) {
    return (
      <div className="order-success">
        <div className="order-success-detail" style={{ textAlign: 'center' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--ink-400)', marginBottom: 12 }} />
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-success">
        <div className="order-success-detail" style={{ textAlign: 'center' }}>
          <p>Không tìm thấy thông tin đơn hàng</p>
          <p style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 8 }}>
            Vui lòng kiểm tra lại mã đơn hàng
          </p>
          <Link to={ROUTES.HOME} className="btn btn-primary" style={{ marginTop: 16 }}>
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const items = order.items || []

  return (
    <div className="order-success">
      <div className="order-success-icon">
        <CheckCircle2 size={64} />
      </div>
      <h1 className="order-success-title">Đặt hàng thành công!</h1>
      <p className="order-success-order-number">{order.orderNumber}</p>

      <div className="order-success-detail">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: 4 }}>Thông tin đơn hàng</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-700)' }}>Mã đơn: {order.orderNumber}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>Trạng thái: {order.status === 'PENDING_PAYMENT' ? 'Chờ thanh toán' : order.status}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>Tổng tiền: {formatPrice(order.total)}</div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-600)', marginBottom: 6 }}>
            <span>{item.medicineName || item.name} x{item.quantity || item.qty}</span>
            <span>{formatPrice((item.unitPrice || item.price || 0) * (item.quantity || item.qty || 0))}</span>
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

        <div className="cart-summary-total" style={{ marginTop: 8 }}>
          <span>Tổng cộng</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="order-success-actions">
        <Link to={ROUTES.ORDER_TRACKING} className="btn btn-primary">
          📦 Theo dõi đơn hàng
        </Link>
        <Link to={ROUTES.HOME} className="btn btn-outline">
          🏠 Về trang chủ
        </Link>
      </div>
    </div>
  )
}
