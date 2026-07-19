import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ShoppingCart, CreditCard, Loader2, Plus, MapPin } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { listAddresses, createAddress, previewCheckout, confirmCheckout, getStores, getBackendCart, addCartItem } from '../api/shopApi'
import { formatPrice } from '../utils/formatPrice'
import './CheckoutPage.css'

const addressLabels = { HOME: 'Nhà riêng', OFFICE: 'Văn phòng', OTHER: 'Khác' }

export function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { cart, cartTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.CHECKOUT)}`, { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      getBackendCart().then(backendCart => {
        if (backendCart && backendCart.items && backendCart.items.length > 0) {
          const frontendItems = backendCart.items.map(item => ({
            medicineId: item.medicineId,
            backendId: item.id,
            name: item.medicineName,
            price: item.unitPrice,
            qty: item.qty,
            imageUrl: item.imageUrl || '',
            prescriptionRequired: false,
          }))
          localStorage.setItem('pcms_cart', JSON.stringify(frontendItems))
          window.dispatchEvent(new CustomEvent('pcms-cart-changed'))
        }
      }).catch(() => {})

      const cart = JSON.parse(localStorage.getItem('pcms_cart') || '[]')
      ;(async () => {
        for (const item of cart) {
          if (!item.backendId) {
            try { await addCartItem({ medicineId: item.medicineId, qty: item.qty }) } catch {}
          }
        }
      })()
    }
  }, [isAuthenticated])

  const [form, setForm] = useState({
    customerName: user?.fullName || '',
    phone: user?.phone || '',
    note: '',
  })
  const [errors, setErrors] = useState({})
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    label: 'HOME',
    receiverName: user?.fullName || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    ward: '',
    street: '',
    isDefault: false,
  })
  const [addressErrors, setAddressErrors] = useState({})
  const [pickupBranch, setPickupBranch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    if (cart.length === 0 && isAuthenticated) {
      navigate(ROUTES.CART, { replace: true })
    }
  }, [cart, navigate, isAuthenticated])

  const addressesQuery = useQuery({
    queryKey: ['customer-addresses'],
    queryFn: listAddresses,
    enabled: isAuthenticated,
  })

  const storesQuery = useQuery({
    queryKey: ['store-locator', { size: 100 }],
    queryFn: () => getStores({ size: 100 }),
    enabled: isAuthenticated,
  })

  const branches = storesQuery.data?.branches || []

  useEffect(() => {
    if (addressesQuery.data && addressesQuery.data.length > 0 && !selectedAddressId) {
      const defaultAddr = addressesQuery.data.find(a => a.isDefault) || addressesQuery.data[0]
      setSelectedAddressId(defaultAddr.id)
    }
  }, [addressesQuery.data, selectedAddressId])

  useEffect(() => {
    if (branches.length > 0 && !pickupBranch) {
      setPickupBranch(branches[0].id)
    }
  }, [branches, pickupBranch])

  if (!isAuthenticated) return null
  if (cart.length === 0) return null

  const total = cartTotal

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.customerName.trim()) newErrors.customerName = 'Họ tên không được để trống'
    if (!form.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống'
    else if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại phải có 10 số, bắt đầu bằng 0'
    if (!selectedAddressId) newErrors.address = 'Vui lòng chọn địa chỉ giao hàng'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const confirmMutation = useMutation({
    mutationFn: confirmCheckout,
    onSuccess: (data) => {
      clearCart()
      if (paymentMethod === 'vnpay' && data.paymentUrl) {
        window.location.href = data.paymentUrl
        return
      }
      navigate(ROUTES.ORDER_SUCCESS(data.orderNumber))
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses'] })
      setSelectedAddressId(newAddress.id)
      setShowAddressForm(false)
      setAddressForm({ label: 'HOME', receiverName: user?.fullName || '', phone: user?.phone || '', province: '', district: '', ward: '', street: '', isDefault: false })
      toast.success('Đã thêm địa chỉ mới')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    confirmMutation.mutate({
      addressId: selectedAddressId,
      branchId: pickupBranch,
      shippingMethod: 'pickup',
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'VNPAY',
    })
  }

  const handleCreateAddress = (e) => {
    e.preventDefault()
    const errs = {}
    ;['receiverName', 'province', 'district', 'ward', 'street'].forEach((field) => {
      if (!addressForm[field].trim()) errs[field] = 'Trường này không được để trống.'
    })
    ;['receiverName', 'province', 'district', 'ward'].forEach((field) => {
      if (addressForm[field].trim().length > 100) errs[field] = 'Tối đa 100 ký tự.'
    })
    if (addressForm.street.trim().length > 255) errs.street = 'Tối đa 255 ký tự.'
    if (!/^0\d{9}$/.test(addressForm.phone.replace(/\s/g, ''))) errs.phone = 'Số điện thoại không hợp lệ.'
    setAddressErrors(errs)
    if (Object.keys(errs).length > 0) return
    createAddressMutation.mutate({
      label: addressForm.label,
      receiverName: addressForm.receiverName.trim(),
      phone: addressForm.phone.trim(),
      province: addressForm.province.trim(),
      district: addressForm.district.trim(),
      ward: addressForm.ward.trim(),
      street: addressForm.street.trim(),
      isDefault: addressForm.isDefault,
    })
  }

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id)
    if (errors.address) setErrors(prev => ({ ...prev, address: undefined }))
  }

  const handleAddressFormField = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }))
    if (addressErrors[field]) setAddressErrors(prev => ({ ...prev, [field]: undefined }))
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

          <div className="checkout-field-row">
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
          </div>

          <div className="checkout-field">
            <span className="checkout-field-label">Ghi chú</span>
            <textarea className="checkout-textarea" value={form.note} onChange={e => handleChange('note', e.target.value)} placeholder="Giao hàng trong giờ hành chính..." rows={2} />
          </div>
        </div>

        {/* ═══ SECTION 2: Address ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title"><MapPin size={18} /> Địa chỉ giao hàng</div>

          {errors.address && <p className="checkout-field-error" style={{ marginBottom: 12 }}>{errors.address}</p>}

          {addressesQuery.isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0', color: 'var(--shop-text-secondary)', fontSize: 14 }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Đang tải địa chỉ...
            </div>
          )}

          {addressesQuery.isError && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 12, fontSize: 13, color: '#dc2626' }}>
              Không thể tải địa chỉ. Vui lòng thêm địa chỉ mới bên dưới.
            </div>
          )}

          {!addressesQuery.isLoading && !addressesQuery.isError && addressesQuery.data && addressesQuery.data.length > 0 && (
            <div className="checkout-address-list">
              {addressesQuery.data.map((addr) => (
                <label
                  key={addr.id}
                  className={`checkout-address-card ${selectedAddressId === addr.id ? 'checkout-address-card--active' : ''}`}
                  onClick={() => handleAddressSelect(addr.id)}
                >
                  <input
                    type="radio"
                    name="shippingAddress"
                    checked={selectedAddressId === addr.id}
                    onChange={() => handleAddressSelect(addr.id)}
                  />
                  <div className="checkout-address-card-body">
                    <div className="checkout-address-card-header">
                      <span className="checkout-address-card-name">{addr.receiverName}</span>
                      <span className="checkout-address-card-phone">{addr.phone}</span>
                      <span className="checkout-address-badge checkout-address-badge--label">{addressLabels[addr.label] || addr.label}</span>
                      {addr.isDefault && <span className="checkout-address-badge checkout-address-badge--default">Mặc định</span>}
                    </div>
                    <div className="checkout-address-card-detail">
                      {[addr.street, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!addressesQuery.isLoading && !addressesQuery.isError && (!addressesQuery.data || addressesQuery.data.length === 0) && (
            <p style={{ fontSize: 14, color: 'var(--shop-text-secondary)', padding: '12px 0' }}>
              Bạn chưa có địa chỉ giao hàng nào. Vui lòng thêm địa chỉ mới.
            </p>
          )}

          {!showAddressForm && (
            <button type="button" className="checkout-address-add-btn" onClick={() => setShowAddressForm(true)}>
              <Plus size={16} /> Thêm địa chỉ mới
            </button>
          )}

          {showAddressForm && (
            <div className="checkout-address-form">
              <div className="checkout-address-form-title">{'Thêm địa chỉ'}</div>

              <div className="checkout-field">
                <span className="checkout-field-label">Nhãn</span>
                <select className="checkout-select" value={addressForm.label} onChange={e => handleAddressFormField('label', e.target.value)}>
                  <option value="HOME">Nhà riêng</option>
                  <option value="OFFICE">Văn phòng</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <span className="checkout-field-label">Người nhận *</span>
                  <input className="checkout-input" value={addressForm.receiverName} onChange={e => handleAddressFormField('receiverName', e.target.value)} />
                  {addressErrors.receiverName && <p className="checkout-field-error">{addressErrors.receiverName}</p>}
                </div>
                <div className="checkout-field">
                  <span className="checkout-field-label">Số điện thoại *</span>
                  <input className="checkout-input" type="tel" value={addressForm.phone} onChange={e => handleAddressFormField('phone', e.target.value)} />
                  {addressErrors.phone && <p className="checkout-field-error">{addressErrors.phone}</p>}
                </div>
              </div>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <span className="checkout-field-label">Tỉnh/Thành phố *</span>
                  <input className="checkout-input" value={addressForm.province} onChange={e => handleAddressFormField('province', e.target.value)} />
                  {addressErrors.province && <p className="checkout-field-error">{addressErrors.province}</p>}
                </div>
                <div className="checkout-field">
                  <span className="checkout-field-label">Quận/Huyện *</span>
                  <input className="checkout-input" value={addressForm.district} onChange={e => handleAddressFormField('district', e.target.value)} />
                  {addressErrors.district && <p className="checkout-field-error">{addressErrors.district}</p>}
                </div>
              </div>

              <div className="checkout-field">
                <span className="checkout-field-label">Phường/Xã *</span>
                <input className="checkout-input" value={addressForm.ward} onChange={e => handleAddressFormField('ward', e.target.value)} />
                {addressErrors.ward && <p className="checkout-field-error">{addressErrors.ward}</p>}
              </div>

              <div className="checkout-field">
                <span className="checkout-field-label">Địa chỉ chi tiết *</span>
                <input className="checkout-input" value={addressForm.street} onChange={e => handleAddressFormField('street', e.target.value)} />
                {addressErrors.street && <p className="checkout-field-error">{addressErrors.street}</p>}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 14, color: 'var(--shop-text)', cursor: 'pointer' }}>
                <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => handleAddressFormField('isDefault', e.target.checked)} style={{ accentColor: 'var(--shop-primary)' }} />
                Đặt làm địa chỉ mặc định
              </label>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={handleCreateAddress} disabled={createAddressMutation.isPending} style={{ flex: 1, backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {createAddressMutation.isPending ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
                <button type="button" onClick={() => { setShowAddressForm(false); setAddressErrors({}) }} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--shop-text)', border: '1px solid var(--shop-border)', borderRadius: 8, padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══ SECTION 3: Shipping (pickup only) ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title">🏥 Phương thức nhận hàng</div>
          <div style={{ fontSize: 14, color: 'var(--shop-text-secondary)', marginBottom: 14 }}>
            Nhận tại nhà thuốc — <strong style={{ color: '#16a34a' }}>Miễn phí vận chuyển</strong>
          </div>
          {storesQuery.isLoading ? (
            <p style={{ fontSize: 13, color: 'var(--shop-text-muted)' }}>Đang tải danh sách nhà thuốc...</p>
          ) : storesQuery.isError ? (
            <p style={{ fontSize: 13, color: '#dc2626' }}>Không thể tải danh sách nhà thuốc</p>
          ) : (
            <div className="checkout-field">
              <span className="checkout-field-label">Chọn nhà thuốc nhận hàng</span>
              <select className="checkout-select" value={pickupBranch} onChange={e => setPickupBranch(e.target.value)}>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* ═══ SECTION 4: Payment ═══ */}
        <div className="checkout-section">
          <div className="checkout-section-title"><CreditCard size={18} /> Phương thức thanh toán</div>
          <div className="checkout-payment-grid">
            <label className={`checkout-radio-card checkout-radio-card--payment ${paymentMethod === 'cod' ? 'checkout-radio-card--active' : ''}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span style={{ fontSize: 24 }}>💵</span>
              <div className="checkout-radio-title">COD</div>
              <div className="checkout-radio-desc">Thanh toán khi nhận hàng</div>
            </label>
            <label className={`checkout-radio-card checkout-radio-card--payment ${paymentMethod === 'vnpay' ? 'checkout-radio-card--active' : ''}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
              <span style={{ fontSize: 24 }}>📱</span>
              <div className="checkout-radio-title">VNPay</div>
              <div className="checkout-radio-desc">Quét mã QR thanh toán</div>
            </label>
          </div>
        </div>

        {/* ═══ SECTION 5: Order Summary ═══ */}
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
            <span>Miễn phí</span>
          </div>
          <hr className="checkout-divider" />

          <div className="checkout-summary-total">
            <span className="checkout-summary-total-label">Tổng cộng</span>
            <span className="checkout-summary-total-price">{formatPrice(total)}</span>
          </div>
        </div>

        <p className="checkout-policy">Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.</p>

        <button type="submit" className="checkout-submit-btn" disabled={confirmMutation.isPending}>
          {confirmMutation.isPending ? (
            <>Đang xử lý...</>
          ) : (
            <><ShoppingCart size={20} /> Xác nhận đặt hàng · {formatPrice(total)}</>
          )}
        </button>
      </form>
    </div>
  )
}
