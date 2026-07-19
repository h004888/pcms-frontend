import { Minus, Plus } from 'lucide-react'
import './QuantitySelector.css'

export function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="qty-selector" role="group" aria-label="Chá»n sá»‘ lÆ°á»£ng">
      <button
        type="button"
        className="qty-selector__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Giáº£m sá»‘ lÆ°á»£ng"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span className="qty-selector__value" aria-live="polite">{value}</span>
      <button
        type="button"
        className="qty-selector__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="TÄƒng sá»‘ lÆ°á»£ng"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
