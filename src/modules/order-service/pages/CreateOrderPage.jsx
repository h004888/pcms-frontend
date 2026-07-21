import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { CustomerSearchCombobox } from '../components/CustomerSearchCombobox.jsx'
import { MedicinePickerCombobox } from '../components/MedicinePickerCombobox.jsx'
import { createOrder, getCoupons } from '../api/orderApi.js'

function formatVND(amount) {
  if (amount == null || isNaN(amount)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function computeItemSubtotal(item) {
  const base = Number(item.unitPrice) * item.qty
  return item.qty >= 10 ? base * 0.95 : base
}

function computeCouponDiscount(couponData, subtotal) {
  if (!couponData) return 0
  const type = couponData.discountType
  const value = Number(couponData.discountValue || couponData.value || 0)
  const maxDisc = Number(couponData.maxDiscountAmount || couponData.maxDiscount || 0)
  if (type === 'PERCENTAGE') {
    const disc = subtotal * (value / 100)
    return maxDisc > 0 ? Math.min(disc, maxDisc) : disc
  }
  // FIXED_AMOUNT
  return Math.min(value, subtotal)
}

export function CreateOrderPage() {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [items, setItems] = useState([])
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const itemsSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + computeItemSubtotal(item), 0),
    [items],
  )
  const couponDiscount = useMemo(
    () => computeCouponDiscount(couponData, itemsSubtotal),
    [couponData, itemsSubtotal],
  )
  const total = itemsSubtotal - couponDiscount
  const hasBulkDiscount = items.some((i) => i.qty >= 10)
  const existingIds = useMemo(() => new Set(items.map((i) => i.medicineId)), [items])

  function handleAddMedicine(medicine) {
    if (existingIds.has(medicine.medicineId)) {
      setItems((prev) =>
        prev.map((item) =>
          item.medicineId === medicine.medicineId
            ? { ...item, qty: item.qty + 1 }
            : item,
        ),
      )
    } else {
      setItems((prev) => [...prev, medicine])
    }
  }

  function handleQtyChange(medicineId, newQty) {
    const safeQty = Math.max(1, newQty || 1)
    setItems((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId ? { ...item, qty: safeQty } : item,
      ),
    )
  }

  function handleRemove(medicineId) {
    setItems((prev) => prev.filter((item) => item.medicineId !== medicineId))
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setIsApplyingCoupon(true)
    setCouponError('')
    try {
      const res = await getCoupons()
      const coupons = Array.isArray(res) ? res : res.data || []
      const found = coupons.find(
        (c) =>
          (c.code || '').toUpperCase() === code &&
          c.active !== false &&
          c.status !== 'INACTIVE',
      )
      if (!found) {
        setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn.')
        setCouponData(null)
        setCouponCode('')
      } else {
        setCouponData(found)
        setCouponCode(code)
        setCouponError('')
        toast.success(`Áp dụng mã "${code}" thành công!`)
      }
    } catch {
      setCouponError('Không thể kiểm tra mã giảm giá. Vui lòng thử lại.')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  function handleClearCoupon() {
    setCouponData(null)
    setCouponCode('')
    setCouponInput('')
    setCouponError('')
  }

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success('Đặt hàng thành công!')
      navigate('/orders')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function handlePlaceOrder() {
    if (items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.')
      return
    }
    let currentUser = {}
    try {
      currentUser = JSON.parse(localStorage.getItem('pcms_user') || '{}')
    } catch {
      // ignore
    }
    createOrderMutation.mutate({
      customerId: customer?.id || null,
      branchId: currentUser.branchId || null,
      staffId: currentUser.id || null,
      items: items.map((i) => ({ medicineId: i.medicineId, quantity: i.qty })),
      couponCode: couponCode || null,
    })
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        {/* ── Header ── */}
        <header className="page-header">
          <div>
            <span className="page-kicker">Đơn hàng</span>
            <h1 className="page-title">Tạo đơn hàng</h1>
          </div>
          <span className="badge badge-muted" style={{ fontSize: 14, padding: '6px 14px' }}>
            Đơn mới
          </span>
        </header>

        {/* ── Customer ── */}
        <section className="card" aria-labelledby="customer-section-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="customer-section-title">Khách hàng</h2>
              <p className="card-subtitle">Tùy chọn — để trống nếu khách vãng lai</p>
            </div>
          </div>
          <div className="card-body">
            <CustomerSearchCombobox value={customer} onChange={setCustomer} />
          </div>
        </section>

        {/* ── Items + Coupon + Summary ── */}
        <section className="card" aria-labelledby="items-section-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="items-section-title">Sản phẩm</h2>
              <p className="card-subtitle">
                {items.length === 0 ? 'Chưa có sản phẩm' : `${items.length} mặt hàng`}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Thuốc</th>
                  <th style={{ width: 110 }}>Số lượng</th>
                  <th style={{ width: 150 }}>Đơn giá</th>
                  <th style={{ width: 150 }}>Thành tiền</th>
                  <th style={{ width: 90 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: 'center',
                        padding: '28px 16px',
                        color: 'var(--ink-400)',
                        fontSize: 14,
                      }}
                    >
                      Chưa có sản phẩm — tìm và thêm thuốc bên dưới
                    </td>
                  </tr>
                )}
                {items.map((item) => {
                  const sub = computeItemSubtotal(item)
                  const hasBulk = item.qty >= 10
                  return (
                    <tr key={item.medicineId}>
                      <td>
                        <strong>{item.medicineName}</strong>
                        {item.prescriptionRequired && (
                          <span
                            className="badge badge-warning"
                            style={{ marginLeft: 8, fontSize: 11 }}
                          >
                            Rx
                          </span>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input mono"
                          min={1}
                          style={{ width: 80 }}
                          value={item.qty}
                          onChange={(e) =>
                            handleQtyChange(item.medicineId, parseInt(e.target.value, 10))
                          }
                          aria-label={`Số lượng ${item.medicineName}`}
                        />
                      </td>
                      <td className="mono" style={{ color: 'var(--ink-700)' }}>
                        {formatVND(item.unitPrice)}
                      </td>
                      <td className="mono" style={{ color: 'var(--ink-900)' }}>
                        {formatVND(sub)}
                        {hasBulk && (
                          <span
                            style={{
                              color: 'var(--ink-400)',
                              marginLeft: 3,
                              fontSize: 13,
                            }}
                            title="5% giảm giá số lượng lớn"
                          >
                            *
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon"
                          onClick={() => handleRemove(item.medicineId)}
                          title={`Xóa ${item.medicineName}`}
                          aria-label={`Xóa ${item.medicineName}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Medicine Picker */}
          <div
            className="card-body"
            style={{ borderTop: '1px dashed var(--ink-200)', paddingTop: 12, paddingBottom: 12 }}
          >
            <MedicinePickerCombobox existingIds={existingIds} onAdd={handleAddMedicine} />
          </div>

          {/* Coupon + Summary */}
          <div
            className="card-body"
            style={{
              borderTop: '1px solid var(--ink-200)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 32,
              flexWrap: 'wrap',
            }}
          >
            {/* Coupon (left) */}
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label className="field" style={{ margin: 0 }}>
                  <span className="field-label" style={{ display: 'none' }}>
                    Mã giảm giá:
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--ink-700)',
                      marginRight: 8,
                    }}
                  >
                    Mã giảm giá:
                  </span>
                </label>
                <input
                  className="input"
                  style={{ width: 200 }}
                  placeholder="Nhập mã..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  aria-label="Mã giảm giá"
                  disabled={!!couponData}
                />
                {!couponData ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponInput.trim()}
                  >
                    {isApplyingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={handleClearCoupon}
                    title="Xóa mã giảm giá"
                    aria-label="Xóa mã giảm giá"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              {couponError && (
                <p style={{ fontSize: 12, marginTop: 6, color: 'var(--color-error)' }}>
                  {couponError}
                </p>
              )}
              {couponData && (
                <p style={{ fontSize: 12, marginTop: 6, color: 'var(--color-success)' }}>
                  ✓ Mã &ldquo;{couponCode}&rdquo; đã được áp dụng.
                </p>
              )}
              {hasBulkDiscount && (
                <p style={{ fontSize: 12, marginTop: 8, color: 'var(--ink-500)' }}>
                  * Giảm 5% khi mua từ 10 sản phẩm cùng loại
                </p>
              )}
            </div>

            {/* Summary (right) */}
            <div
              style={{
                minWidth: 260,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                columnGap: 32,
                rowGap: 8,
                alignItems: 'baseline',
              }}
            >
              <span style={{ color: 'var(--ink-600)' }}>Tạm tính:</span>
              <span className="mono" style={{ textAlign: 'right' }}>
                {formatVND(itemsSubtotal)}
              </span>
              <span style={{ color: 'var(--ink-600)' }}>Giảm giá:</span>
              <span
                className="mono"
                style={{
                  textAlign: 'right',
                  color: couponDiscount > 0 ? 'var(--color-error)' : 'var(--ink-400)',
                }}
              >
                {couponDiscount > 0 ? `-${formatVND(couponDiscount)}` : '--'}
              </span>
              <hr
                style={{
                  gridColumn: '1 / -1',
                  margin: '2px 0',
                  border: 'none',
                  borderTop: '1px solid var(--ink-200)',
                }}
              />
              <strong style={{ fontSize: 15 }}>TỔNG CỘNG:</strong>
              <strong
                className="mono"
                style={{ fontSize: 18, textAlign: 'right', color: 'var(--ink-900)' }}
              >
                {formatVND(total)}
              </strong>
            </div>
          </div>
        </section>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/orders')}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={items.length === 0 || createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
