import { Trash2, AlertTriangle } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'
import { formatPrice } from '../utils/formatPrice'

export function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="cart-item">
      {item.imageUrl ? (
        <img className="cart-item-image" src={item.imageUrl} alt={item.name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
      ) : (
        <div className="cart-item-image-fallback">💊</div>
      )}

      <div className="cart-item-body">
        <div className="cart-item-header">
          <div className="cart-item-name">{item.name}</div>
          <div className="cart-item-price">{formatPrice(item.price)}</div>
        </div>

        {item.prescriptionRequired && (
          <div className="cart-item-rx">
            <AlertTriangle size={12} /> Thuốc kê đơn
          </div>
        )}

        <div className="cart-item-footer">
          <div className="cart-item-actions">
            <QuantitySelector
              value={item.qty}
              onChange={(newQty) => onUpdateQty(item.medicineId, newQty - item.qty)}
            />
            <button className="cart-item-remove-btn" onClick={() => onRemove(item.medicineId)}>
              <Trash2 size={14} /> Xóa
            </button>
          </div>
          <span className="cart-item-subtotal">{formatPrice(item.price * item.qty)}</span>
        </div>
      </div>
    </div>
  )
}
