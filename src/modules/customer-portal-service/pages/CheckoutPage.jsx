import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Truck, CreditCard } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { saveOrder } from '../services/orderStorage'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

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

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    province: '',
    district: '',
    address: '',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [shippingMethod, setShippingMethod] = useState('delivery')
  const [pickupBranch, setPickupBranch] = useState('LC001')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (cart.length === 0) {
      navigate(ROUTES.CART, { replace: true })
    }
  }, [cart, navigate])

  if (cart.length === 0) return null

  const shippingFee = shippingMethod === 'delivery' ? 15000 : 0
  const total = cartTotal + shippingFee

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    if (field === 'province') {
      setForm(prev => ({ ...prev, province: value, district: '' }))
    }
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
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: shippingMethod === 'delivery'
        ? `${form.address.trim()}, ${form.district}, ${form.province}`
        : `Nhận tại ${BRANCHES.find(b => b.id === pickupBranch)?.name}`,
      note: form.note.trim(),
      items: cart.map(item => ({
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
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-800)', marginBottom: 20 }}>
        Thông tin đặt hàng
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="checkout-section">
          <div className="checkout-section-title">👤 Thông tin người nhận</div>

          <label className="field">
            <span className="field-label">Họ và tên *</span>
            <input className="input" value={form.customerName} onChange={e => handleChange('customerName', e.target.value)} placeholder="Nguyễn Văn A" />
            {errors.customerName && <p className="field-error">{errors.customerName}</p>}
          </label>

          <label className="field">
            <span className="field-label">Số điện thoại *</span>
            <input className="input" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="0912 345 678" />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </label>

          {shippingMethod === 'delivery' && (
            <>
              <div style={{ display: 'flex', gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="field-label">Tỉnh/Thành *</span>
                  <select className="select" value={form.province} onChange={e => handleChange('province', e.target.value)}>
                    <option value="">-- Chọn --</option>
                    {Object.keys(PROVINCES).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="field-error">{errors.province}</p>}
                </label>
                <label className="field" style={{ flex: 1 }}>
                  <span className="field-label">Quận/Huyện *</span>
                  <select className="select" value={form.district} onChange={e => handleChange('district', e.target.value)} disabled={!form.province}>
                    <option value="">-- Chọn --</option>
                    {(PROVINCES[form.province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <p className="field-error">{errors.district}</p>}
                </label>
              </div>

              <label className="field">
                <span className="field-label">Địa chỉ *</span>
                <input className="input" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Số nhà, tên đường, phường/xã" />
                {errors.address && <p className="field-error">{errors.address}</p>}
              </label>
            </>
          )}

          <label className="field">
            <span className="field-label">Ghi chú</span>
            <textarea className="input" value={form.note} onChange={e => handleChange('note', e.target.value)} placeholder="Giao hàng trong giờ hành chính..." rows={2} style={{ resize: 'vertical' }} />
          </label>
        </div>

        <div className="checkout-section">
          <div className="checkout-section-title"><Truck size={18} /> Phương thức nhận hàng</div>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="shipping" checked={shippingMethod === 'delivery'} onChange={() => setShippingMethod('delivery')} />
              <div className="radio-label-content">
                <div className="radio-label-title">Giao hàng tận nơi</div>
                <div className="radio-label-desc">15.000đ - Dự kiến 3-5 ngày</div>
              </div>
            </label>
            <label className="radio-label">
              <input type="radio" name="shipping" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} />
              <div className="radio-label-content">
                <div className="radio-label-title">Nhận tại nhà thuốc</div>
                <div className="radio-label-desc">Miễn phí</div>
              </div>
            </label>
          </div>
          {shippingMethod === 'pickup' && (
            <label className="field" style={{ marginTop: 12 }}>
              <span className="field-label">Chọn nhà thuốc</span>
              <select className="select" value={pickupBranch} onChange={e => setPickupBranch(e.target.value)}>
                {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="checkout-section">
          <div className="checkout-section-title"><CreditCard size={18} /> Phương thức thanh toán</div>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <div className="radio-label-content">
                <div className="radio-label-title">Thanh toán khi nhận hàng (COD)</div>
              </div>
            </label>
            <label className="radio-label">
              <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
              <div className="radio-label-content">
                <div className="radio-label-title">Chuyển khoản ngân hàng</div>
              </div>
            </label>
            <label className="radio-label">
              <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
              <div className="radio-label-content">
                <div className="radio-label-title">VNPay</div>
              </div>
            </label>
          </div>
        </div>

        <div className="checkout-section">
          <div className="checkout-section-title"><ShoppingCart size={18} /> Tổng kết đơn hàng</div>
          {cart.map((item) => (
            <div key={item.medicineId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-600)', marginBottom: 6 }}>
              <span>{item.name} x{item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--ink-100)' }} />
          <div className="cart-summary-row">
            <span>Tạm tính</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
          </div>
          <div className="cart-summary-total">
            <span>Tổng cộng</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 16 }}>
          Xác nhận đặt hàng - {formatPrice(total)}
        </button>
      </form>
    </div>
  )
}
