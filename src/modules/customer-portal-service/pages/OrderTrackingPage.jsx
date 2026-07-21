import { useState } from 'react'
import { Search, Package } from 'lucide-react'
import { getOrderByNumber } from '../api/shopApi'
import { OrderTimeline } from '../components/OrderTimeline'
import { formatPrice } from '../utils/formatPrice'

const STATUS_ORDER = ['confirmed', 'verified', 'packing', 'handover', 'shipping', 'delivered']

export function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    try {
      const data = await getOrderByNumber(orderNumber.trim())
      setResults([data])
    } catch {
      setResults([])
    }
    setSearched(true)
  }

  const getProgressPercent = (status) => {
    const idx = STATUS_ORDER.indexOf(status)
    if (idx === -1) return 0
    return Math.round((idx / (STATUS_ORDER.length - 1)) * 100)
  }

  return (
    <div className="order-tracking-page">
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-800)', marginBottom: 20 }}>
        Tra cứu đơn hàng
      </h1>

      <form className="tracking-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Mã đơn hàng</span>
          <input
            className="input"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="ORD-..."
          />
        </label>
        <label className="field">
          <span className="field-label">Số điện thoại *</span>
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0912 345 678"
            required
          />
        </label>
        <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
          <Search size={16} aria-hidden="true" />
          Tra cứu đơn hàng
        </button>
      </form>

      {searched && results && results.length === 0 && (
        <div className="empty-state">
          <Package size={32} style={{ color: 'var(--ink-300)', marginBottom: 12 }} />
          <p>Không tìm thấy đơn hàng</p>
          <p style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 4 }}>
            Vui lòng kiểm tra lại mã đơn hàng và số điện thoại
          </p>
        </div>
      )}

      {results && results.length > 0 && (
        <div>
          {results.map(order => (
            <div key={order.orderNumber} className="tracking-result" style={{ marginBottom: 16 }}>
              <div className="tracking-header">
                <div className="tracking-order-number">{order.orderNumber}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 4 }}>
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>

              <div className="tracking-progress">
                <div
                  className="tracking-progress-bar"
                  style={{ width: `${getProgressPercent(order.status)}%` }}
                />
              </div>

              <OrderTimeline timeline={order.timeline} />

              <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '16px 0' }} />

              <div style={{ fontSize: 14, color: 'var(--ink-600)', marginBottom: 12 }}>
                <strong style={{ color: 'var(--ink-700)' }}>Chi tiết đơn hàng</strong>
              </div>

              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-600)', marginBottom: 4 }}>
                  <span>{item.medicineName} x{item.quantity}</span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}

              <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

              <div className="cart-summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="cart-summary-row">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="cart-summary-total">
                <span>Tổng cộng</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--ink-100)', margin: '12px 0' }} />

              {order.couponCode && (
                <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 8 }}>
                  <div>Mã giảm giá: {order.couponCode}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
