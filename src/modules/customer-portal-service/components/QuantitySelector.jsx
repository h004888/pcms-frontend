import { Minus, Plus } from 'lucide-react'

export function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="qty-selector">
      <button
        className="qty-btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Giảm số lượng"
      >
        <Minus size={14} />
      </button>
      <span className="qty-value">{value}</span>
      <button
        className="qty-btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
