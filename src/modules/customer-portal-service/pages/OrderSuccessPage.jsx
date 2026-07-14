import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getOrder } from '../services/orderStorage'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function OrderSuccessPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (orderNumber) {
      setOrder(getOrder(orderNumber))
    }
  }, [orderNumber])

  if (!order) {
    return (
      <div className="order-success">
        <div className="order-success-detail" style={{ textAlign: 'center' }}>
          <p>Không tìm thấy thông tin đơn hàng</p>
          <p style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 8 }}>
            Đơn hàng có thể đã bị xóa khỏi bộ nhớ tạm
          </p>
          <Link to={ROUTES.HOME} className="btn btn-primary" style={{ marginTop: 16 }}>
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="order-success">
      <div className="order-success-icon">
        <CheckCircle2 size={64} />
      </div>
      <h1 className="order-success-title">Đặt hàng thành công!</h1>
      <p className="order-success-order-number">{order.orderNumber}</p>

      <div className="order-success-detail">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-400)', marginBottom: 4 }}>Thông tin người nhận</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-700)' }}>{order.customerName}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>{order.phone}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>{order.address}</div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-600)', marginBottom: 6 }}>
            <span>{item.name} x{item.qty}</span>
            <span>{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

        <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 4 }}>Phương thức thanh toán: {order.paymentMethod}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 4 }}>Phương thức giao hàng: {order.shippingMethod}</div>
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
