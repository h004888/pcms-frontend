import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { CartItem } from '../components/CartItem'
import { formatPrice } from '../utils/formatPrice'
import './CartPage.css'

export function CartPage() {
  const { cart, cartTotal, updateQty, removeItem } = useCart()

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <ShoppingCart size={56} className="cart-empty-icon" />
          <h2 className="cart-empty-title">Giỏ hàng trống</h2>
          <p className="cart-empty-sub">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <Link to={ROUTES.SEARCH} className="cart-empty-cta">
            <Package size={18} /> Mua sắm ngay
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">
        🛒 Giỏ hàng ({cart.length} sản phẩm)
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
        <div className="cart-summary-row">
          <span>Phí vận chuyển</span>
          <span>Miễn phí</span>
        </div>
        <hr className="cart-summary-divider" />
        <div className="cart-summary-total">
          <span>Tổng cộng</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <Link to={ROUTES.SEARCH} className="cart-btn-back">
          <ArrowLeft size={16} /> Tiếp tục mua sắm
        </Link>
        <Link to={ROUTES.CHECKOUT} className="cart-btn-checkout">
          Tiến hành đặt hàng
        </Link>
      </div>
    </div>
  )
}
