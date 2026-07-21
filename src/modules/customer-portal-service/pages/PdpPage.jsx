import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  RefreshCcw, ShoppingCart, AlertTriangle, ChevronDown, ChevronUp,
  Truck, ShieldCheck, RotateCcw, BadgeCheck, Store, Clock, Tag,
  ChevronLeft, ChevronRight, Pill
} from 'lucide-react'
import { toast } from 'sonner'
import { ROUTES } from '@core/router/paths.js'
import { getProductDetailBySlug, getProductDetailById, getMedicineReviews, getFlashSales } from '../api/shopApi'
import { QuantitySelector } from '../components/QuantitySelector'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import { StarRating } from '@shared/ui/StarRating'
import { fixMojibake } from '../utils/mojibake.js'
import './PdpPage.css'

const t = (s) => fixMojibake(s)

/* ─── country flag map ─── */
const COUNTRY_FLAGS = {
  [t('việt nam')]: t('🇻🇳'), [t('nhật bản')]: t('🇯🇵'), [t('mỹ')]: t('🇺🇸'), [t('hoa kỳ')]: t('🇺🇸'), [t('anh')]: t('🇬🇧'),
  [t('pháp')]: t('🇫🇷'), [t('đức')]: t('🇩🇪'), [t('úc')]: t('🇦🇺'), [t('hàn quốc')]: t('🇰🇷'), [t('trung quốc')]: t('🇨🇳'),
}
function getFlag(country) {
  if (!country) return null
  return COUNTRY_FLAGS[country.toLowerCase().trim()] || null
}

export function PdpPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [imageError, setImageError] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [fontSize, setFontSize] = useState('default')
  const [expandedInfo, setExpandedInfo] = useState(false)

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['shop-pdp', slug],
    queryFn: () => {
      if (UUID_RE.test(slug)) return getProductDetailById(slug)
      return getProductDetailBySlug(slug)
    },
  })

  const { data: reviews } = useQuery({
    queryKey: ['shop-reviews', product?.id],
    queryFn: () => getMedicineReviews(product.id),
    enabled: !!product?.id,
    retry: false,
  })

  const { data: flashSalesData } = useQuery({
    queryKey: ['flash-sales'],
    queryFn: () => getFlashSales(),
  })

  /* ─── loading ─── */
  if (isLoading) {
    return (
      <div className="pdp-shell">
        <div className="pdp-skeleton">
          <div className="pdp-skeleton-block pdp-skeleton-block--img pdp-skeleton-block--shimmer" />
          <div className="pdp-skeleton-stack" style={{ display: 'grid', gap: 'var(--space-base)' }}>
            <div className="pdp-skeleton-block pdp-skeleton-block--title pdp-skeleton-block--shimmer" />
            <div className="pdp-skeleton-block pdp-skeleton-block--meta pdp-skeleton-block--shimmer" />
            <div className="pdp-skeleton-block pdp-skeleton-block--price pdp-skeleton-block--shimmer" />
            <div className="pdp-skeleton-block pdp-skeleton-block--cta pdp-skeleton-block--shimmer" />
          </div>
        </div>
      </div>
    )
  }

  /* ─── error ─── */
  if (isError) {
    return (
      <div className="pdp-shell">
        <div className="pdp-error">
          <span className="pdp-error-icon" aria-hidden="true">
            <AlertTriangle size={24} />
          </span>
          <p className="pdp-error-message">{t('Không thể tải thông tin sản phẩm')}: {error?.message || t('Lỗi kết nối')}</p>
          <button className="pdp-error-retry" onClick={() => refetch()}>
            <RefreshCcw size={16} /> {t('Thử lại')}
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pdp-shell">
        <div className="pdp-empty">{t('Không tìm thấy sản phẩm')}</div>
      </div>
    )
  }

  /* ─── helpers ─── */
  const handleAddToCart = () => {
    addToCart({
      medicineId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty,
      prescriptionRequired: product.prescriptionRequired,
    })
    toast.success(t('Đã thêm vào giỏ hàng'))
  }

  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const countryName = product.country || product.origin
  const flag = getFlag(countryName)
  const images = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : [])

  /* ─── tabs ─── */
  const TABS = [
    { key: 'description', label: t('Mô tả sản phẩm') },
    { key: 'usage', label: t('Công dụng') },
    { key: 'howTo', label: t('Cách dùng') },
    { key: 'sideEffects', label: t('Tác dụng phụ') },
    { key: 'notes', label: t('Lưu ý') },
    { key: 'storage', label: t('Bảo quản') },
    { key: 'reviews', label: `${t('Đánh giá')} (${product.reviewCount || 0})` },
  ]

  /* ─── flash sale check ─── */
  const flashDeal = flashSalesData?.data?.find?.(f => f.medicineId === product.id) || null

  return (
    <div className="pdp-shell">

      {/* ═══ BREADCRUMB ═══ */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="pdp-breadcrumb-link">{t('Trang chủ')}</Link>
        {product.category?.slug && (
          <>
            <span className="pdp-breadcrumb-sep" aria-hidden="true">/</span>
            <Link to={`${ROUTES.SEARCH}?category=${encodeURIComponent(product.category.slug)}`} className="pdp-breadcrumb-link">
              {product.category.name || t('Danh mục')}
            </Link>
          </>
        )}
        <span className="pdp-breadcrumb-sep" aria-hidden="true">/</span>
        <span className="pdp-breadcrumb-current">{product.name}</span>
      </nav>

      {/* ═══ MAIN 2-COLUMN GRID ═══ */}
      <div className="pdp-main-grid">

        {/* ─── LEFT: Gallery ─── */}
        <div>
          {/* main image */}
          <div className="pdp-gallery-main">
            {images.length > 0 && !imageError ? (
              <img
                src={images[currentImage] || images[0]}
                alt={product.name}
                className="pdp-gallery-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="pdp-gallery-fallback" aria-hidden="true">
                <Pill size={64} />
              </div>
            )}
            {/* nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="pdp-gallery-nav pdp-gallery-nav--prev"
                  onClick={() => setCurrentImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                  aria-label={t('Ảnh trước')}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="pdp-gallery-nav pdp-gallery-nav--next"
                  onClick={() => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                  aria-label={t('Ảnh sau')}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {/* thumbnails */}
          {images.length > 1 && (
            <div className="pdp-thumbs" role="tablist" aria-label={t('Chọn ảnh')}>
              {images.map((img, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentImage}
                  onClick={() => setCurrentImage(i)}
                  className={`pdp-thumb${i === currentImage ? ' pdp-thumb--active' : ''}`}
                >
                  <img src={img} alt="" className="pdp-thumb-image" />
                </button>
              ))}
            </div>
          )}
          <p className="pdp-thumb-caption">{t('Mẫu mã sản phẩm có thể thay đổi theo lô hàng')}</p>

          {/* trust badges */}
          <div className="pdp-trust-grid">
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true"><RotateCcw size={16} /></span>
              <span className="pdp-trust-title">{t('Đổi trả 30 ngày')}</span>
              <span className="pdp-trust-sub">{t('kể từ ngày mua')}</span>
            </div>
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true"><ShieldCheck size={16} /></span>
              <span className="pdp-trust-title">{t('Miễn phí đổi thuốc')}</span>
              <span className="pdp-trust-sub">100%</span>
            </div>
            <div className="pdp-trust-item">
              <span className="pdp-trust-icon" aria-hidden="true"><Truck size={16} /></span>
              <span className="pdp-trust-title">{t('Miễn phí vận chuyển')}</span>
              <span className="pdp-trust-sub">{t('theo chính sách')}</span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Product Info ─── */}
        <div>
          {/* brand + country */}
          <div className="pdp-meta-top">
            {flag && <span className="pdp-meta-flag" aria-hidden="true">{flag}</span>}
            {countryName && <span>{countryName}</span>}
            {product.brand && (
              <>
                <span className="pdp-meta-divider" aria-hidden="true">|</span>
                <span>{t('Thương hiệu')}: <Link to={`/brand/${product.brand}`} className="pdp-meta-brand-link">{product.brand}</Link></span>
              </>
            )}
          </div>

          {/* product name */}
          <h1 className="pdp-title">{product.name}</h1>

          {/* meta: SKU, rating */}
          <div className="pdp-rating-row">
            {product.sku && <span className="pdp-thumb-caption">{t('Mã')}: {product.sku}</span>}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <StarRating rating={product.averageRating} />
              <span className="pdp-rating-score">{product.averageRating?.toFixed(1)}</span>
              <span className="pdp-thumb-caption">({product.reviewCount || 0} {t('đánh giá')})</span>
            </div>
            <span className="pdp-meta-divider" aria-hidden="true">|</span>
            <span className="pdp-thumb-caption">{product.reviewCount || 0} {t('bình luận')}</span>
          </div>

          {/* prescription badge */}
          {product.prescriptionRequired && (
            <div className="pdp-rx-badge">
              <AlertTriangle size={14} aria-hidden="true" />
              {t('Thuốc kê đơn — cần toa bác sĩ')}
            </div>
          )}

          {/* ─── Flash Sale Banner ─── */}
          {flashDeal && (
            <div className="pdp-flash-banner">
              <div className="pdp-flash-left">
                <Clock size={18} aria-hidden="true" />
                <span className="pdp-flash-label">{t('Kết thúc sau')}</span>
                <span className="pdp-flash-countdown">{flashDeal.endsIn || '--:--:--'}</span>
              </div>
              <span className="pdp-flash-tag">
                <Tag size={16} aria-hidden="true" /> {t('Ưu đãi giá sốc')}
              </span>
            </div>
          )}

          {/* ─── Price ─── */}
          <div className="pdp-price-block">
            <div className="pdp-price-row">
              <span className="pdp-price-current">{formatPrice(product.price)}</span>
              {product.unit && <span className="pdp-price-unit">/ {product.unit}</span>}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="pdp-price-strike-row">
                <span className="pdp-price-original">{formatPrice(product.originalPrice)}</span>
                <span className="pdp-price-discount">-{discountPct}%</span>
              </div>
            )}
            {flashDeal && (
              <p className="pdp-flash-note">
                {t('Lưu ý: Flash sale chỉ áp dụng với số lượng & thời gian giới hạn.')}{' '}
                <span className="pdp-flash-note-underline">{t('Xem chi tiết')}</span>
              </p>
            )}
          </div>

          {/* ─── Unit + Quantity ─── */}
          <div className="pdp-unit-qty-row">
            <div>
              <span className="pdp-unit-label">{t('Chọn đơn vị tính')}</span>
              <div className="pdp-unit-display">{product.unit}</div>
            </div>
            <div>
              <span className="pdp-qty-label">{t('Chọn số lượng')}</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>
          </div>

          {/* ─── CTA Buttons ─── */}
          <div className="pdp-cta-row">
            <button onClick={handleAddToCart} className="pdp-cta-primary">
              <ShoppingCart size={20} aria-hidden="true" /> {t('Chọn mua')}
            </button>
            <Link to={ROUTES.STORES} className="pdp-cta-secondary">
              <Store size={20} aria-hidden="true" /> {t('Tìm nhà thuốc')}
            </Link>
          </div>

          {/* policy strip */}
          <div className="pdp-policy-strip">
            <span className="pdp-policy-item"><RotateCcw size={12} aria-hidden="true" /> {t('Đổi trả 30 ngày')}</span>
            <span className="pdp-policy-item"><Truck size={12} aria-hidden="true" /> {t('Giao hàng nhanh 2h')}</span>
            <span className="pdp-policy-item"><BadgeCheck size={12} aria-hidden="true" /> {t('Miễn phí giao hàng >200k')}</span>
          </div>

          {/* ─── Promotions ─── */}
          <div className="pdp-promo-box">
            <h3 className="pdp-promo-title">{t('🎁 Khuyến mại được áp dụng')}</h3>
            <p className="pdp-promo-sub">{t('Áp dụng 1 trong các khuyến mại:')}</p>
            <ul className="pdp-promo-list">
              <li className="pdp-promo-item">
                <Tag size={12} aria-hidden="true" />
                {t('Giảm ngay 15% áp dụng đến 31/07')}
              </li>
              <li className="pdp-promo-item">
                <Clock size={12} aria-hidden="true" />
                {t('Giảm ngay 17% khi mua Online 8h - 22h')}
              </li>
            </ul>
          </div>

          {/* ─── Product Info Summary (collapsible) ─── */}
          <div className="pdp-info-summary">
            <div className={`pdp-info-body${expandedInfo ? ' pdp-info-body--expanded' : ' pdp-info-body--collapsed'}`}>
              {product.description && (
                <p className="pdp-info-description">{product.description}</p>
              )}
              <dl className="pdp-meta">
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-label">{t('Quy cách')}:</dt>
                  <dd className="pdp-meta-value">{product.unit}</dd>
                </div>
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-label">{t('Thành phần')}:</dt>
                  <dd className="pdp-meta-value">
                    {product.ingredients?.length ? product.ingredients.slice(0, 3).join(', ') + (product.ingredients.length > 3 ? '...' : '') : t('—')}
                  </dd>
                </div>
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-label">{t('Danh mục')}:</dt>
                  <dd className="pdp-meta-value">
                    {product.category?.slug && product.category?.name ? (
                      <Link to={`${ROUTES.SEARCH}?category=${encodeURIComponent(product.category.slug)}`} className="pdp-meta-link">
                        {product.category.name}
                      </Link>
                    ) : (
                      <span className="pdp-thumb-caption">—</span>
                    )}
                  </dd>
                </div>
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-label">{t('Nước sản xuất')}:</dt>
                  <dd className="pdp-meta-value">{flag && <span className="pdp-meta-flag" aria-hidden="true">{flag}</span>}{countryName || t('—')}</dd>
                </div>
              </dl>
            </div>
            <button
              onClick={() => setExpandedInfo(!expandedInfo)}
              className="pdp-info-toggle"
              aria-expanded={expandedInfo}
            >
              {expandedInfo ? (
                <>{t('Thu gọn')} <ChevronUp size={14} aria-hidden="true" /></>
              ) : (
                <>{t('Xem tất cả thông tin')} <ChevronDown size={14} aria-hidden="true" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TABBED CONTENT ═══ */}
      <div className="pdp-tabs">
        <div className="pdp-tabs-bar" role="tablist" aria-label={t('Thông tin sản phẩm')}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pdp-tab${activeTab === tab.key ? ' pdp-tab--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={`pdp-tab-content${fontSize === 'large' ? ' pdp-tab-content--large' : ''}`} role="tabpanel">
          {/* Mô tả */}
          {activeTab === 'description' && (
            <div>
              {product.description ? (
                <>
                  <h2>{t('Mô tả sản phẩm')}</h2>
                  <div style={{ whiteSpace: 'pre-line' }}>{product.description}</div>
                </>
              ) : (
                <p className="pdp-tab-empty">{t('Chưa có thông tin mô tả cho sản phẩm này.')}</p>
              )}
            </div>
          )}

          {/* Công dụng */}
          {activeTab === 'usage' && (
            <div>
              <h2>{t('Công dụng')}</h2>
              {product.usage ? (
                <div style={{ whiteSpace: 'pre-line' }}>{product.usage}</div>
              ) : (
                <p className="pdp-tab-empty">{t('Chưa có thông tin công dụng cho sản phẩm này.')}</p>
              )}
            </div>
          )}

          {/* Cách dùng */}
          {activeTab === 'howTo' && (
            <div>
              <h2>{t('Cách dùng')}</h2>
              {product.howToUse ? (
                <div style={{ whiteSpace: 'pre-line' }}>{product.howToUse}</div>
              ) : (
                <p className="pdp-tab-empty">{t('Chưa có thông tin hướng dẫn sử dụng cho sản phẩm này.')}</p>
              )}
            </div>
          )}

          {/* Tác dụng phụ */}
          {activeTab === 'sideEffects' && (
            <div>
              <h2>{t('Tác dụng phụ')}</h2>
              {product.sideEffects ? (
                <div style={{ whiteSpace: 'pre-line' }}>{product.sideEffects}</div>
              ) : (
                <p className="pdp-tab-empty">{t('Chưa có thông tin về tác dụng phụ của sản phẩm.')}</p>
              )}
            </div>
          )}

          {/* Lưu ý */}
          {activeTab === 'notes' && (
            <div>
              <h2>{t('Lưu ý')}</h2>
              {product.notes ? (
                <div style={{ whiteSpace: 'pre-line' }}>{product.notes}</div>
              ) : (
                <ul className="pdp-tab-list">
                  {product.prescriptionRequired && (
                    <li>
                      <AlertTriangle size={16} className="pdp-tab-bullet pdp-tab-bullet--warn" aria-hidden="true" />
                      <span>{t('Thuốc kê đơn — chỉ dùng khi có toa bác sĩ. Không tự ý sử dụng.')}</span>
                    </li>
                  )}
                  <li>
                    <span className="pdp-tab-bullet pdp-tab-bullet--warn" aria-hidden="true">•</span>
                    <span>{t('Không thoa lên mắt, không dùng cho vết thương hở và vùng da bị tổn thương.')}</span>
                  </li>
                  <li>
                    <span className="pdp-tab-bullet pdp-tab-bullet--warn" aria-hidden="true">•</span>
                    <span>{t('Không dùng cho trẻ em dưới 4 tuổi.')}</span>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Bảo quản */}
          {activeTab === 'storage' && (
            <div>
              <h2>{t('Bảo quản')}</h2>
              {product.storage ? (
                <div style={{ whiteSpace: 'pre-line' }}>{product.storage}</div>
              ) : (
                <ul className="pdp-tab-list">
                  <li>
                    <span className="pdp-tab-bullet pdp-tab-bullet--info" aria-hidden="true">•</span>
                    <span>{t('Nơi khô ráo, tránh ánh nắng trực tiếp.')}</span>
                  </li>
                  <li>
                    <span className="pdp-tab-bullet pdp-tab-bullet--info" aria-hidden="true">•</span>
                    <span>{t('Để xa tầm tay trẻ em.')}</span>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Đánh giá */}
          {activeTab === 'reviews' && (
            <div>
              <h2>{t('Đánh giá sản phẩm')}</h2>
              {reviews?.length ? (
                <div style={{ display: 'grid', gap: 'var(--space-base)' }}>
                  {reviews.map((r, i) => (
                    <div key={i} className="pdp-tab-review">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                        <StarRating rating={r.rating} />
                        <span className="pdp-thumb-caption">{r.customerName || t('Khách hàng')} — {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                      </div>
                      {r.comment && <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pdp-tab-empty">{t('Chưa có đánh giá nào cho sản phẩm này.')}</p>
              )}
            </div>
          )}
        </div>

        {/* font size toggle */}
        <div className="pdp-font-toggle">
          <span>{t('Kích thước chữ')}:</span>
          <label>
            <input
              type="radio"
              name="fontSize"
              checked={fontSize === 'default'}
              onChange={() => setFontSize('default')}
            />
            {t('Mặc định')}
          </label>
          <label>
            <input
              type="radio"
              name="fontSize"
              checked={fontSize === 'large'}
              onChange={() => setFontSize('large')}
            />
            {t('Lớn hơn')}
          </label>
        </div>
      </div>

      {/* ═══ RELATED PRODUCTS ═══ */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <h2 className="pdp-related-title">{t('Sản phẩm liên quan')}</h2>
          <div className="pdp-related-grid">
            {product.relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ STICKY MOBILE BUY BAR ═══ */}
      <div className="pdp-sticky-bar" role="region" aria-label={t('Mua nhanh')}>
        <div className="pdp-sticky-price">
          <span className="pdp-sticky-price-label">{t('Giá')}</span>
          <span className="pdp-sticky-price-value">{formatPrice(product.price)}</span>
        </div>
        <button onClick={handleAddToCart} className="pdp-sticky-cta">
          <ShoppingCart size={18} aria-hidden="true" /> {t('Chọn mua')}
        </button>
      </div>
    </div>
  )
}
