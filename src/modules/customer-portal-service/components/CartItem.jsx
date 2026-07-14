import { Trash2, AlertTriangle } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="cart-item-row">
      {item.imageUrl ? (
        <img className="cart-item-image" src={item.imageUrl} alt={item.name} onError={(e) => { e.target.style.display = 'none' }} />
      ) : (
        <div className="cart-item-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-300)', fontSize: 20 }}>
          💊
        </div>
      )}
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">{formatPrice(item.price)}</div>
        {item.prescriptionRequired && (
          <div className="pdp-prescription-badge" style={{ marginBottom: 8, display: 'inline-flex' }}>
            <AlertTriangle size={12} aria-hidden="true" />
            Kê đơn
          </div>
        )}
        <div className="cart-item-actions">
          <QuantitySelector
            value={item.qty}
            onChange={(newQty) => onUpdateQty(item.medicineId, newQty - item.qty)}
          />
          <button className="cart-item-remove" onClick={() => onRemove(item.medicineId)} aria-label="Xóa sản phẩm">
            <Trash2 size={16} />
          </button>
          <span className="cart-item-subtotal">{formatPrice(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  )
}
