import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { RefreshCcw, ArrowUp, X } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getShopHome } from '../api/shopApi'
import { useCart } from '../hooks/useCart'
import { HeroBanner } from '../components/HeroBanner'

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'd'
}
function StarRating({ rating }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  return <span className="bs-stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
}

const ITEMS_PER_PAGE = 5

export function ShopHomePage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['shop-home'], queryFn: getShopHome,
  })

  const { addToCart } = useCart()
  const [countdown, setCountdown] = useState({ h: 2, m: 45, s: 18 })
  const [showCount, setShowCount] = useState(ITEMS_PER_PAGE)
  const [toasts, setToasts] = useState([])
  const [quickView, setQuickView] = useState(null)
  const [showBackTop, setShowBackTop] = useState(false)
  const [addedItems, setAddedItems] = useState(new Set())

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setCountdown(prev => {
      let { h, m, s } = prev; s--
      if (s < 0) { s = 59; m-- }
      if (m < 0) { m = 59; h-- }
      if (h < 0) return { h: 0, m: 0, s: 0 }
      return { h, m, s }
    }), 1000)
    return () => clearInterval(t)
  }, [])

  // Scroll progress + back to top + reveal animations
  useEffect(() => {
    const onScroll = () => {
      const bar = document.getElementById('scroll-progress')
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%'
      }
      setShowBackTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Reveal sections on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [data])

  const pad = (n) => String(n).padStart(2, '0')

  const addToast = useCallback((msg) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
  }, [])

  const handleAddToCart = useCallback((e, item) => {
    e.preventDefault(); e.stopPropagation()
    addToCart({ medicineId: item.id || 'fs-'+Date.now(), name: item.medicineName || item.name, price: item.salePrice || item.price, imageUrl: item.imageUrl || '', qty: 1 })
    setAddedItems(prev => new Set(prev).add(item.id))
    addToast(`Da them vao gio hang`)
    setTimeout(() => setAddedItems(prev => { const s = new Set(prev); s.delete(item.id); return s }), 1500)
  }, [addToCart, addToast])

  const handleQuickView = useCallback((e, product) => {
    e.preventDefault(); e.stopPropagation()
    setQuickView(product)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Marquee drag
  const marqueeRef = useRef(null)
  const marqueeDrag = useCallback(() => {
    const el = marqueeRef.current; if (!el) return
    let down = false, startX = 0, scrollLeft = 0
    el.addEventListener('mousedown', (e) => { down = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = 'grabbing' })
    el.addEventListener('mouseleave', () => { down = false; el.style.cursor = 'grab' })
    el.addEventListener('mouseup', () => { down = false; el.style.cursor = 'grab' })
    el.addEventListener('mousemove', (e) => { if (!down) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) })
  }, [])

  useEffect(() => { marqueeDrag() }, [marqueeDrag, data])

  if (isLoading) {
    return (<div><div className="skeleton skeleton-hero" /><div className="skeleton-grid">{[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" />)}</div></div>)
  }

  if (isError) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Khong the tai trang chu.</p>
        <button className="hero-cta" onClick={() => refetch()}><RefreshCcw size={14} /> Thu lai</button>
      </div>
    )
  }

  const { heroBanners, featuredCategories, bestSellers, quickLinks, flashSales } = data || {}
  const visibleBestSellers = bestSellers?.slice(0, showCount) || []
  const hasMore = bestSellers && bestSellers.length > showCount
  const allFlashItems = flashSales?.flatMap(s => (s.items || []).map(i => ({ ...i, saleName: s.name, discountPct: s.discountPct }))) || []

  return (
    <div>
      <HeroBanner banners={heroBanners} />

      {/* Categories */}
      {featuredCategories?.length > 0 && (
        <section className="reveal-section category-marquee-section">
          <div className="section-label">Danh muc</div>
          <div className="category-marquee" ref={marqueeRef}>
            {[...featuredCategories, ...featuredCategories].map((cat, i) => (
              <Link key={`${cat.id}-${i}`} to={`${ROUTES.SEARCH}?q=${encodeURIComponent(cat.name)}`} className="category-marquee-item">
                <span className="marquee-cat-name">{cat.name}</span>
                <span className="marquee-cat-count">{cat.productCount || 0} SP</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale */}
      {allFlashItems.length > 0 && (
        <section className="reveal-section flash-sale-section">
          <div className="flash-sale-topbar">
            <div className="flash-sale-topbar-left"><span className="flash-sale-title">FLASH SALE</span></div>
            <span className="flash-sale-timer">{pad(countdown.h)} : {pad(countdown.m)} : {pad(countdown.s)}</span>
          </div>
          <table className="flash-sale-table">
            <thead><tr><th>#</th><th>San pham</th><th>Gia goc</th><th>Gia sale</th><th></th></tr></thead>
            <tbody>
              {allFlashItems.map((item, idx) => (
                <tr key={item.id}>
                  <td className="fs-num">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="fs-name" style={{ cursor: 'pointer' }} onClick={() => setQuickView(item)}>
                    {item.medicineName}
                  </td>
                  <td className="fs-original">{formatPrice(item.originalPrice)}</td>
                  <td className="fs-sale">{formatPrice(item.salePrice)}</td>
                  <td className={`fs-add ${addedItems.has(item.id) ? 'added' : ''}`} onClick={(e) => handleAddToCart(e, item)}>
                    {addedItems.has(item.id) ? 'OK' : '[+]'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Best Sellers */}
      {visibleBestSellers.length > 0 && (
        <section className="reveal-section bestsellers-section">
          <div className="section-label">Ban chay nhat</div>
          {visibleBestSellers.map((product, idx) => (
            <div key={product.id} className="bestseller-row" onClick={() => setQuickView(product)}>
              <span className="bs-number">{String(idx + 1).padStart(2, '0')}</span>
              <div className="bs-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : <span className="bs-image-fallback">+</span>}
              </div>
              <div className="bs-info">
                <div className="bs-name">{product.name}</div>
                <div className="bs-desc">San pham chinh hang</div>
                <div className="bs-rating">
                  <StarRating rating={4 + Math.random()} />
                  <span className="bs-rating-count">{Math.floor(Math.random() * 2000 + 100)} danh gia</span>
                </div>
              </div>
              <span className="bs-price">{formatPrice(product.price)}</span>
              <span className={`bs-add ${addedItems.has(product.id) ? 'added' : ''}`} onClick={(e) => handleAddToCart(e, product)}>
                {addedItems.has(product.id) ? 'Da them' : 'Them →'}
              </span>
            </div>
          ))}
          {hasMore && (
            <button className="load-more-btn" onClick={() => setShowCount(prev => prev + ITEMS_PER_PAGE)}>
              Xem them ({bestSellers.length - showCount} san pham)
            </button>
          )}
        </section>
      )}

      {/* Services */}
      <section className="reveal-section services-section">
        <div className="section-label">Dich vu suc khoe</div>
        <div className="services-grid">
          <div className="service-card"><div className="service-card-title">Tiem chung</div><div className="service-card-desc">Dat lich online nhanh chong. 4 loai vac-xin san sang.</div><Link to="/vaccines" className="service-card-link">Dat lich &rarr;</Link></div>
          <div className="service-card"><div className="service-card-title">Tu van duoc si</div><div className="service-card-desc">Chat truc tiep 24/7 hoan toan mien phi.</div><a href="#" className="service-card-link">Chat ngay &rarr;</a></div>
          <div className="service-card"><div className="service-card-title">Tra cuu thuoc</div><div className="service-card-desc">Thong tin chinh xac tu Bo Y Te.</div><Link to={ROUTES.SEARCH} className="service-card-link">Tra cuu &rarr;</Link></div>
        </div>
      </section>

      {/* Quick Links */}
      {quickLinks?.length > 0 && (
        <section className="reveal-section quick-links-section">
          <div className="section-label">Tien ich nhanh</div>
          <div className="quick-links-grid">
            {quickLinks.map(link => (<a key={link.id} href={link.href || '#'} className="quick-link-card">{link.label}</a>))}
            <Link to={ROUTES.STORES} className="quick-link-card">tim nha thuoc</Link>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickView && (
        <div className="quick-view-overlay" onClick={() => setQuickView(null)}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qv-header">
              <div className="qv-name">{quickView.name || quickView.medicineName}</div>
              <button className="qv-close" onClick={() => setQuickView(null)}><X size={20} /></button>
            </div>
            <div className="qv-price">{formatPrice(quickView.salePrice || quickView.price)}</div>
            <div className="qv-desc">
              {quickView.discountPct ? `Giam ${quickView.discountPct}% - ${quickView.saleName || ''}` : 'San pham chinh hang, giao hang trong 2 gio.'}
            </div>
            <div className="qv-actions">
              <button className="qv-add-btn" onClick={(e) => { handleAddToCart(e, quickView); setQuickView(null) }}>Them vao gio hang</button>
              <Link to={ROUTES.PRODUCT(quickView.id)} className="qv-view-btn" onClick={() => setQuickView(null)}>Xem chi tiet</Link>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (<div key={t.id} className="toast toast-success">{t.msg}</div>))}
        </div>
      )}

      {/* Back to Top */}
      <button className={`back-to-top ${showBackTop ? 'visible' : ''}`} onClick={scrollToTop} aria-label="Len dau trang">
        <ArrowUp size={18} />
      </button>
    </div>
  )
}
