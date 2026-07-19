import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import './ProductCard.css'

const COUNTRY_FLAGS = {
  'việt nam': '🇻🇳',
  'nhật bản': '🇯🇵',
  'mỹ': '🇺🇸',
  'hoa kỳ': '🇺🇸',
  'anh': '🇬🇧',
  'pháp': '🇫🇷',
  'đức': '🇩🇪',
  'úc': '🇦🇺',
  'hàn quốc': '🇰🇷',
  'trung quốc': '🇨🇳',
}

function getFlagEmoji(country) {
  if (!country) return null
  const key = country.toLowerCase().trim()
  return COUNTRY_FLAGS[key] || null
}

function calcDiscountPct(originalPrice, currentPrice) {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null
  return Math.round((1 - currentPrice / originalPrice) * 100)
}

export function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    e.preventDefault()
    addToCart({
      medicineId: product.id,
      name: product.name || product.medicineName,
      price: product.salePrice || product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    })
    toast.success('Đã thêm vào giỏ hàng')
  }

  const currentPrice = product.salePrice || product.price
  const originalPrice = product.originalPrice || (product.price && product.salePrice ? product.price : null)
  const discountPct = product.discountPct != null ? product.discountPct : calcDiscountPct(originalPrice, currentPrice)
  const flag = getFlagEmoji(product.origin || product.country)

  return (
    <div className={`lc-product-card ${variant !== 'default' ? `lc-product-card--${variant}` : ''}`}>
      {/* ── Clickable image + body area ── */}
      <Link
        to={ROUTES.PRODUCT(product.slug || product.id)}
        className="lc-product-card-body-link"
        style={{ flex: 1, color: 'inherit', textDecoration: 'none', display: 'block' }}
      >
        <div className="lc-product-card-image">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || product.medicineName}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="lc-product-card-image-fallback">
              {(product.name || product.medicineName || '?').charAt(0)}
            </div>
          )}

          {discountPct != null && discountPct > 0 && (
            <span className="lc-product-card-badge">
              -{discountPct}%
            </span>
          )}

          {flag && (
            <span className="lc-product-card-flag" aria-hidden="true">{flag}</span>
          )}
        </div>

        <div className="lc-product-card-body">
          {product.origin && (
            <span className="lc-product-card-origin">{product.origin}</span>
          )}

          <h3 className="lc-product-card-name">
            {product.name || product.medicineName}
          </h3>

          <div className="lc-product-card-prices">
            <span className="lc-product-card-price">
              {formatPrice(currentPrice)}
            </span>
            {product.unit && (
              <span className="lc-product-card-unit">/ {product.unit}</span>
            )}
          </div>

          {originalPrice && (
            <span className="lc-product-card-price-old">
              {formatPrice(originalPrice)}
            </span>
          )}

          {product.soldCount != null && discountPct == null && (
            <span className="lc-product-card-sold">
              Đã bán {product.soldCount} suất
            </span>
          )}
          {discountPct != null && (
            <span className="lc-product-card-promo">
              Ưu đãi giá sốc
            </span>
          )}
        </div>
      </Link>

      {/* ── Separate CTA button (not inside clickable area) ── */}
      <button
        className="lc-product-card-cta"
        onClick={handleAddToCart}
        aria-label={`Chọn mua ${product.name || product.medicineName}`}
      >
        Chọn mua
      </button>
    </div>
  )
}
