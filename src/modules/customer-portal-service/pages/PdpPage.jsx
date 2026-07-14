import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { RefreshCcw, ShoppingCart, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { getProductDetail, getMedicineReviews } from '../api/shopApi'
import { QuantitySelector } from '../components/QuantitySelector'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../hooks/useCart'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

function StarRating({ rating }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full)
  return <span className="pdp-stars">{stars}</span>
}

export function PdpPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [showFullDesc, setShowFullDesc] = useState(false)

  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['shop-pdp', id],
    queryFn: () => getProductDetail(id),
  })

  const { data: reviews } = useQuery({
    queryKey: ['shop-reviews', id],
    queryFn: () => getMedicineReviews(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div>
        <div className="skeleton-pdp">
          <div className="skeleton skeleton-pdp-image" />
          <div className="skeleton-pdp-info">
            <div className="skeleton skeleton-line skeleton-line-sm" />
            <div className="skeleton skeleton-line skeleton-line-full" />
            <div className="skeleton skeleton-line skeleton-line-lg" />
            <div className="skeleton skeleton-line skeleton-line-full" />
            <div className="skeleton skeleton-line skeleton-line-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="error-state" role="alert">
        <p>Không thể tải thông tin sản phẩm: {error?.message || 'Lỗi kết nối'}</p>
        <button className="btn btn-primary" onClick={() => refetch()} style={{ marginTop: 12 }}>
          <RefreshCcw size={16} aria-hidden="true" />
          Thử lại
        </button>
      </div>
    )
  }

  if (!product) {
    return <div className="error-state">Không tìm thấy sản phẩm</div>
  }

  const handleAddToCart = () => {
    addToCart({
      medicineId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty,
      prescriptionRequired: product.prescriptionRequired,
    })
    toast.success('Đã thêm vào giỏ hàng')
  }

  return (
    <div>
      <div className="pdp-layout">
        <div>
          {product.imageUrl ? (
            <img className="pdp-image" src={product.imageUrl} alt={product.name} onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <div className="pdp-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-300)', fontSize: 64 }}>
              💊
            </div>
          )}
        </div>
        <div className="pdp-info">
          <h1 className="pdp-name">{product.name}</h1>

          <div className="pdp-rating">
            <StarRating rating={product.averageRating} />
            <span>({product.reviewCount || 0} đánh giá)</span>
          </div>

          <div className="pdp-price">{formatPrice(product.price)}</div>
          {product.unit && <div style={{ color: 'var(--ink-500)', fontSize: 14 }}>/ {product.unit}</div>}

          {product.prescriptionRequired && (
            <div className="pdp-prescription-badge">
              <AlertTriangle size={14} aria-hidden="true" />
              Thuốc kê đơn (cần toa bác sĩ)
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <QuantitySelector value={qty} onChange={setQty} />
          </div>

          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            <ShoppingCart size={18} aria-hidden="true" />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {product.description && (
        <div className="pdp-section">
          <div className="pdp-section-title">📝 Mô tả</div>
          <div className={`pdp-description ${showFullDesc ? '' : 'collapsed'}`}>
            {product.description}
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => setShowFullDesc(!showFullDesc)}
            style={{ marginTop: 4, padding: '4px 0', fontSize: 13 }}
          >
            {showFullDesc ? <>Thu gọn <ChevronUp size={14} /></> : <>Xem thêm <ChevronDown size={14} /></>}
          </button>
        </div>
      )}

      {product.ingredients && product.ingredients.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-section-title">🧪 Thành phần</div>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-600)', paddingLeft: 20 }}>
            {product.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {product.usage && (
        <div className="pdp-section">
          <div className="pdp-section-title">📖 Cách dùng</div>
          <p className="pdp-description">{product.usage}</p>
        </div>
      )}

      {product.stockByBranch && product.stockByBranch.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-section-title">🏪 Tồn kho theo cửa hàng</div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Cửa hàng</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {product.stockByBranch.map((stock) => (
                  <tr key={stock.branchId}>
                    <td>{stock.branchName}</td>
                    <td className="mono">{stock.qty}</td>
                    <td>
                      <span className={`badge ${stock.qty > 10 ? 'badge-success' : stock.qty > 0 ? 'badge-warning' : 'badge-muted'}`}>
                        {stock.qty > 10 ? 'Còn hàng' : stock.qty > 0 ? 'Sắp hết' : 'Hết hàng'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-section-title">🔗 Sản phẩm liên quan</div>
          <div className="product-grid">
            {product.relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-section-title">⭐ Đánh giá sản phẩm</div>
          {reviews.map((review, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--ink-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <StarRating rating={review.rating} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>
                  {review.customerName || 'Khách hàng'}
                </span>
              </div>
              {review.comment && <p style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.5 }}>{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
