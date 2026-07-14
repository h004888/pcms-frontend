import { ShoppingCart, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleClick = () => {
    navigate(ROUTES.PRODUCT(product.id))
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({
      medicineId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    })
  }

  return (
    <div className="product-card" onClick={handleClick} role="button" tabIndex={0}
         onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className="product-card-image-wrap">
        {product.imageUrl ? (
          <img className="product-card-image" src={product.imageUrl} alt={product.name}
               onError={(e) => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <div className="product-card-initials">{product.name?.charAt(0)}</div>
        )}
        {product.prescriptionRequired && (
          <span className="product-card-rx-badge">
            <AlertTriangle size={10} /> KÊ ĐƠN
          </span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-meta">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.unit && <span className="product-card-unit">/ {product.unit}</span>}
        </div>
        {product.description && (
          <p className="product-card-desc">{product.description}</p>
        )}
        {product.soldCount != null && (
          <div className="product-card-sold">Đã bán {product.soldCount}</div>
        )}
        <div className="product-card-actions">
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <ShoppingCart size={14} aria-hidden="true" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  )
}
