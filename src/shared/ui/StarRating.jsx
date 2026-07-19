import { Star } from 'lucide-react'
import './StarRating.css'

export function StarRating({ rating, size = 'sm' }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const sizePx = size === 'lg' ? 20 : size === 'md' ? 16 : 14
  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star
          key={i}
          size={sizePx}
          fill="currentColor"
          strokeWidth={0}
          className="star-rating__icon star-rating__icon--filled"
          aria-hidden="true"
        />
      )
    } else if (i === full && hasHalf) {
      stars.push(
        <Star
          key={i}
          size={sizePx}
          fill="currentColor"
          strokeWidth={0}
          className="star-rating__icon star-rating__icon--filled star-rating__icon--half"
          aria-hidden="true"
        />
      )
    } else {
      stars.push(
        <Star
          key={i}
          size={sizePx}
          strokeWidth={1.5}
          className="star-rating__icon star-rating__icon--empty"
          aria-hidden="true"
        />
      )
    }
  }

  return (
    <span
      className={`star-rating star-rating--${size}`}
      role="img"
      aria-label={`${rating} trÃªn 5 sao`}
    >
      {stars}
    </span>
  )
}
