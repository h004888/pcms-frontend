import { Minus, Plus } from 'lucide-react'
import './QuantitySelector.css'

export function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="qty-selector" role="group" aria-label="Chọn số lượng">
      <button
        type="button"
        className="qty-selector__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Giảm số lượng"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span className="qty-selector__value" aria-live="polite">{value}</span>
      <button
        type="button"
        className="qty-selector__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
