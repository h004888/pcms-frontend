import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Truck, CreditCard } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { saveOrder } from '../services/orderStorage'
import { formatPrice } from '../utils/formatPrice'
import './CheckoutPage.css'

const PROVINCES = {
  'Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Thạnh', 'Tân Bình', 'Tân Phú', 'Gò Vấp', 'Phú Nhuận', 'Thủ Đức'],
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Tây Hồ', 'Hà Đông'],
  'Đà Nẵng': ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Liên Chiểu', 'Ngũ Hành Sơn', 'Cẩm Lệ'],
}

const BRANCHES = [
  { id: 'LC001', name: 'LC-001 - 123 Nguyễn Huệ, Quận 1, HCM' },
  { id: 'LC002', name: 'LC-002 - 456 Lê Lợi, Quận 1, HCM' },
  { id: 'LC003', name: 'LC-003 - 789 Trần Hưng Đạo, Quận 1, HCM' },
]

const PAYMENT_METHODS = [
  { id: 'cod', icon: '💵', title: 'COD', desc: 'Thanh toán khi nhận hàng' },
  { id: 'transfer', icon: '🏦', title: 'Chuyển khoản', desc: 'Qua ngân hàng' },
  { id: 'vnpay', icon: '📱', title: 'VNPay', desc: 'Quét mã QR' },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const [form, setForm] = useState({
    customerName: user?.fullName || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    address: user?.address || '',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [shippingMethod, setShippingMethod] = useState('delivery')
  const [pickupBranch, setPickupBranch] = useState('LC001')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (cart.length === 0 && isAuthenticated) {
      navigate(ROUTES.CART, { replace: true })
    }
  }, [cart, navigate, isAuthenticated])

  if (!isAuthenticated) return null
  if (cart.length === 0) return null

  const shippingFee = shippingMethod === 'delivery' ? 15000 : 0
  const total = cartTotal + shippingFee

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    if (field === 'province') setForm(prev => ({ ...prev, province: value, district: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.customerName.trim()) newErrors.customerName = 'Họ tên không được để trống'
    if (!form.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống'
    else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại phải có 10 số, bắt đầu bằng 0'
    if (shippingMethod === 'delivery') {
      if (!form.province) newErrors.province = 'Vui lòng chọn tỉnh/thành'
      if (!form.district) newErrors.district = 'Vui lòng chọn quận/huyện'
      if (!form.address.trim()) newErrors.address = 'Địa chỉ không được để trống'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const orderData = {
      userId: user?.id,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: shippingMethod === 'delivery'
        ? `${form.address.trim()}, ${form.district}, ${form.province}`
        : `Nhận tại ${BRANCHES.find(b => b.id === pickupBranch)?.name}`,
      note: form.note.trim(),
      items: cart.map(item => ({
        medicineId: item.medicineId,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      subtotal: cartTotal,
      shippingFee,
      total,
      shippingMethod: shippingMethod === 'delivery' ? 'Giao hàng tận nơi' : 'Nhận tại nhà thuốc',
      paymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod === 'transfer' ? 'Chuyển khoản' : 'VNPay',
    }

    const saved = saveOrder(orderData)
    clearCart()
    navigate(ROUTES.ORDER_SUCCESS(saved.orderNumber))
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page-title">📋 Thông tin đặt hàng</h1>

      {user && (
        <div className="checkout-account-banner">
          👤 Đặt hàng với tài khoản: <strong style={{ color: 'var(--shop-text)' }}>{user.fullName}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ═══ SECTION 1: Customer Info ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title">📍 Thông tin người nhận</div>
          <hr className="checkout-section-divider" />

          <div className="checkout-field">
            <span className="checkout-field-label">Họ và tên *</span>
            <input className="checkout-input" value={form.customerName} onChange={e => handleChange('customerName', e.target.value)} placeholder="Nguyễn Văn A" />
            {errors.customerName && <p className="checkout-field-error">{errors.customerName}</p>}
          </div>

          <div className="checkout-field">
            <span className="checkout-field-label">Số điện thoại *</span>
            <input className="checkout-input" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="0912 345 678" />
            {errors.phone && <p className="checkout-field-error">{errors.phone}</p>}
          </div>

          {shippingMethod === 'delivery' && (
            <>
              <div className="checkout-field-row">
                <div className="checkout-field">
                  <span className="checkout-field-label">Tỉnh/Thành *</span>
                  <select className="checkout-select" value={form.province} onChange={e => handleChange('province', e.target.value)}>
                    <option value="">-- Chọn --</option>
                    {Object.keys(PROVINCES).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="checkout-field-error">{errors.province}</p>}
                </div>
                <div className="checkout-field">
                  <span className="checkout-field-label">Quận/Huyện *</span>
                  <select className="checkout-select" value={form.district} onChange={e => handleChange('district', e.target.value)} disabled={!form.province}>
                    <option value="">-- Chọn --</option>
                    {(PROVINCES[form.province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <p className="checkout-field-error">{errors.district}</p>}
                </div>
              </div>

              <div className="checkout-field">
                <span className="checkout-field-label">Địa chỉ *</span>
                <input className="checkout-input" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Số nhà, tên đường, phường/xã" />
                {errors.address && <p className="checkout-field-error">{errors.address}</p>}
              </div>
            </>
          )}

          <div className="checkout-field">
            <span className="checkout-field-label">Ghi chú</span>
            <textarea className="checkout-textarea" value={form.note} onChange={e => handleChange('note', e.target.value)} placeholder="Giao hàng trong giờ hành chính..." rows={2} />
          </div>
        </div>

        {/* ═══ SECTION 2: Shipping ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title"><Truck size={18} /> Phương thức nhận hàng</div>
          <div className="checkout-radio-group">
            <label className={`checkout-radio-card ${shippingMethod === 'delivery' ? 'checkout-radio-card--active' : ''}`}>
              <input type="radio" name="shipping" checked={shippingMethod === 'delivery'} onChange={() => setShippingMethod('delivery')} />
              <div>
                <div className="checkout-radio-title">Giao hàng tận nơi</div>
                <div className="checkout-radio-desc">15.000đ · Dự kiến 3-5 ngày</div>
              </div>
            </label>
            <label className={`checkout-radio-card ${shippingMethod === 'pickup' ? 'checkout-radio-card--active' : ''}`}>
              <input type="radio" name="shipping" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} />
              <div>
                <div className="checkout-radio-title">Nhận tại nhà thuốc</div>
                <div className="checkout-radio-desc">Miễn phí</div>
              </div>
            </label>
          </div>
          {shippingMethod === 'pickup' && (
            <div className="checkout-field" style={{ marginTop: 12 }}>
              <span className="checkout-field-label">Chọn nhà thuốc</span>
              <select className="checkout-select" value={pickupBranch} onChange={e => setPickupBranch(e.target.value)}>
                {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* ═══ SECTION 3: Payment ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title"><CreditCard size={18} /> Phương thức thanh toán</div>
          <div className="checkout-payment-grid">
            {PAYMENT_METHODS.map(pm => (
              <label key={pm.id} className={`checkout-radio-card checkout-radio-card--payment ${paymentMethod === pm.id ? 'checkout-radio-card--active' : ''}`}>
                <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                <span style={{ fontSize: 24 }}>{pm.icon}</span>
                <div className="checkout-radio-title">{pm.title}</div>
                <div className="checkout-radio-desc">{pm.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {/* ═══ SECTION 4: Order Summary ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title"><ShoppingCart size={18} /> Tổng kết đơn hàng</div>
          <hr className="checkout-section-divider" />

          {cart.map((item) => (
            <div key={item.medicineId} className="checkout-summary-item">
              <span className="checkout-summary-item-name">{item.name}</span>
              <span className="checkout-summary-item-qty">x{item.qty}</span>
              <span className="checkout-summary-item-price">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}

          <hr className="checkout-divider" />

          <div className="checkout-summary-row">
            <span>Tạm tính</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>
          <hr className="checkout-divider" />

          <div className="checkout-summary-total">
            <span className="checkout-summary-total-label">Tổng cộng</span>
            <span className="checkout-summary-total-price">{formatPrice(total)}</span>
          </div>
        </div>

        <p className="checkout-policy">Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.</p>

        <button type="submit" className="checkout-submit-btn">
          <ShoppingCart size={20} /> Xác nhận đặt hàng · {formatPrice(total)}
        </button>
      </form>
    </div>
  )
}
