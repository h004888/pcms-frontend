import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { CartItem } from '../components/CartItem'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function CartPage() {
  const { cart, cartTotal, updateQty, removeItem } = useCart()

  if (cart.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '48px 16px' }}>
        <ShoppingCart size={48} style={{ color: 'var(--ink-300)', marginBottom: 16 }} />
        <p>Giỏ hàng trống</p>
        <p style={{ fontSize: 13, color: 'var(--ink-400)', marginTop: 8 }}>
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
        </p>
        <Link to={ROUTES.SEARCH} className="btn btn-primary" style={{ marginTop: 16 }}>
          Mua sắm ngay
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-800)', marginBottom: 20 }}>
        Giỏ hàng ({cart.length} sản phẩm)
      </h1>

      <div>
        {cart.map((item) => (
          <CartItem
            key={item.medicineId}
            item={item}
            onUpdateQty={(medicineId, delta) => updateQty(medicineId, delta)}
            onRemove={(medicineId) => removeItem(medicineId)}
          />
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Tạm tính</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <div className="cart-summary-row" style={{ fontSize: 13, color: 'var(--ink-400)' }}>
          <span>Phí vận chuyển</span>
          <span>Tính ở bước sau</span>
        </div>
        <div className="cart-summary-total">
          <span>Tổng cộng</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <Link to={ROUTES.SEARCH} className="btn btn-outline">
          <ArrowLeft size={16} aria-hidden="true" />
          Tiếp tục mua sắm
        </Link>
        <Link to={ROUTES.CHECKOUT} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          Tiến hành đặt hàng
        </Link>
      </div>
    </div>
  )
}
