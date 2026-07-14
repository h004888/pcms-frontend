import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Search } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { searchProducts } from '../api/shopApi'

export function ShopLayout({ children }) {
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const timerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Sticky header shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Live search with debounce
  const handleQueryChange = (e) => {
    const q = e.target.value
    setQuery(q)
    clearTimeout(timerRef.current)
    if (q.length < 2) { setResults([]); setShowDropdown(false); return }
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchProducts({ q, size: 5 })
        setResults(data?.data || [])
        setShowDropdown(true)
      } catch { setResults([]) }
    }, 250)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      setShowDropdown(false)
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="shop-shell">
      <div className="scroll-progress" id="scroll-progress" />

      <header className={`shop-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="shop-header-inner">
          <Link to={ROUTES.HOME} className="shop-logo">P C M S</Link>

          <nav className="shop-nav">
            <a href="/categories">thuốc</a>
            <a href="/categories/vitamin-khoang-chat">vitamin</a>
            <a href="/vaccines">tiêm chủng</a>
            <a href="/health-articles">sức khỏe</a>
          </nav>

          <div className="shop-header-actions">
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <form className="shop-search-form" onSubmit={handleSearch}>
                <Search size={14} />
                <input name="search" type="text" value={query} onChange={handleQueryChange}
                  onFocus={() => results.length > 0 && setShowDropdown(true)}
                  placeholder="tìm thuốc..." autoComplete="off" />
              </form>
              {showDropdown && results.length > 0 && (
                <div className="live-search-dropdown">
                  {results.map((item) => (
                    <Link key={item.id} to={ROUTES.PRODUCT(item.id)}
                      className="live-search-item" onClick={() => setShowDropdown(false)}>
                      <div className="ls-name">{item.name}</div>
                      {item.price && <div className="ls-price">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</div>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to={ROUTES.CART} className="shop-cart-btn" aria-label="Giỏ hàng">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99' : cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main className="shop-main">{children}</main>

      <footer className="shop-footer">
        <div className="shop-footer-inner">
          <p>PCMS - Nhà thuốc của bạn, trọn vẹn từ tâm</p>
          <p>&copy; 2026 PCMS &middot; Điều khoản &middot; Bảo mật</p>
        </div>
      </footer>
    </div>
  )
}
