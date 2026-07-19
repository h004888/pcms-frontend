import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import {
  ShoppingCart, Search, User, Phone, Menu, X,
  Smartphone, ChevronDown, MessageCircle, LogOut, Package
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ROUTES } from '@core/router/paths.js'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { searchProducts, getCategories } from '../api/shopApi'

/* ── inline Pharmacy Cross SVG ── */
function PharmacyCross({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <rect x="11" y="0" width="6" height="28" rx="3" fill="currentColor" />
      <rect x="0" y="11" width="28" height="6" rx="3" fill="currentColor" />
    </svg>
  )
}

/* ── quick-link keywords ── */
const QUICK_LINKS = [
  { label: 'Canxi', q: 'canxi' },
  { label: 'Omega 3', q: 'omega 3' },
  { label: 'Kẽm', q: 'kẽm' },
  { label: 'Sắt', q: 'sắt' },
  { label: 'Kem chống nắng', q: 'kem chống nắng' },
  { label: 'Thuốc nhỏ mắt', q: 'thuốc nhỏ mắt' },
  { label: 'Sữa rửa mặt', q: 'sữa rửa mặt' },
  { label: 'Men vi sinh', q: 'men vi sinh' },
  { label: 'Dung dịch vệ sinh', q: 'dung dịch vệ sinh' },
  { label: 'Vitamin C', q: 'vitamin c' },
]

/* ── category nav links (dynamic from API + static extras) ── */
const STATIC_NAV_EXTRAS = [
  { label: 'Tiêm chủng', path: 'https://tiemchunglongchau.com.vn/', external: true },
  { label: 'Bệnh & Góc sức khỏe', path: '/health' },
  { label: 'Hệ thống nhà thuốc', path: ROUTES.STORES },
]

export function ShopLayout({ children }) {
  const { cartCount } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isSearchPage = location.pathname === ROUTES.SEARCH

  const { data: _categories } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })

  const apiCategories = _categories?.data || (Array.isArray(_categories) ? _categories : [])

  const NAV_CATEGORIES = [
    ...apiCategories.map(cat => ({
      label: cat.name,
      path: `${ROUTES.SEARCH}?category=${encodeURIComponent(cat.id || cat.slug || '')}`,
    })),
    ...STATIC_NAV_EXTRAS,
  ]

  const MAX_VISIBLE = 8
  const visibleCats = NAV_CATEGORIES.slice(0, MAX_VISIBLE)
  const hiddenCats = NAV_CATEGORIES.slice(MAX_VISIBLE)

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const timerRef = useRef(null)
  const dropdownRef = useRef(null)
  const sentinelRef = useRef(null)

  /* ── sticky header shrink ── */
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  /* ── live search with debounce ── */
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* sentinel for sticky detection */}
      <div ref={sentinelRef} className="absolute top-0 h-px" aria-hidden="true" />

      {/* ═══════════════ MAIN HEADER (sticky) ═══════════════ */}
      <header
        className={`sticky top-0 z-50 transition-shadow duration-200 bg-white border-b ${
          scrolled ? 'shadow-md border-gray-200' : 'border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 h-16">
          {/* ── Logo ── */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
            <PharmacyCross size={28} className="text-[var(--shop-primary)]" />
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-base text-[var(--shop-text)]">PCMS</div>
              <div className="text-[10px] text-[var(--shop-text-secondary)] -mt-0.5">Nhà thuốc của bạn</div>
            </div>
          </Link>

          {/* ── Search Bar ── */}
          {!isSearchPage && (
            <div ref={dropdownRef} className="flex-1 max-w-lg min-w-0 relative">
              <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm focus-within:border-[var(--shop-primary)] focus-within:ring-2 focus-within:ring-[var(--shop-primary-light)] focus-within:shadow-md transition-all">
                <Search size={18} className="ml-4 text-[var(--shop-text-muted)] shrink-0" strokeWidth={1.5} />
                <input
                  name="search"
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onFocus={() => results.length > 0 && setShowDropdown(true)}
                  placeholder="Tìm tên thuốc, bệnh lý, TPCN..."
                  autoComplete="off"
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-[var(--shop-text)] placeholder:text-[var(--shop-text-secondary)]"
                />
                <button type="submit" className="bg-[var(--shop-primary)] text-white px-6 py-3 rounded-r-xl text-sm font-semibold hover:bg-[var(--shop-primary-hover)] transition-colors shrink-0">
                  Tìm
                </button>
              </form>
              {/* live dropdown */}
              {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      to={ROUTES.PRODUCT(item.slug)}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-sm text-gray-800 truncate">{item.name}</span>
                      {item.price && (
                        <span className="text-sm font-semibold text-blue-600 ml-2 shrink-0">
                          {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-1 shrink-0">
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center px-3 py-1 text-[var(--shop-text-secondary)] hover:text-[var(--shop-primary)] transition-colors duration-150"
                >
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[11px] leading-tight max-w-[64px] truncate">{user?.fullName || 'Tài khoản'}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[var(--shop-text)] truncate">{user?.fullName}</p>
                      <p className="text-xs text-[var(--shop-text-secondary)] truncate">{user?.email || user?.phone}</p>
                    </div>
                    <Link
                      to={ROUTES.MY_ACCOUNT}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--shop-text)] hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="text-[var(--shop-text-secondary)]" />
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to={ROUTES.MY_ORDERS}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--shop-text)] hover:bg-gray-50 transition-colors"
                    >
                      <Package size={16} className="text-[var(--shop-text-secondary)]" />
                      Đơn hàng của tôi
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          localStorage.removeItem('pcms_access_token')
                          localStorage.removeItem('pcms_refresh_token')
                          localStorage.removeItem('pcms_user')
                          window.location.href = '/'
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className="flex flex-col items-center px-3 py-1 text-[var(--shop-text-secondary)] hover:text-[var(--shop-primary)] transition-colors duration-150">
                <User size={20} strokeWidth={1.5} />
                <span className="text-[11px] leading-tight">Đăng nhập</span>
              </Link>
            )}
            <Link to={ROUTES.CART} className="relative flex flex-col items-center px-3 py-1 text-[var(--shop-text-secondary)] hover:text-[var(--shop-primary)] transition-colors duration-150">
              <ShoppingCart size={20} strokeWidth={1.5} />
              <span className="text-[11px] leading-tight">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-[var(--shop-danger)] text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden flex flex-col items-center px-2 py-1 text-[var(--shop-text-secondary)] hover:text-[var(--shop-primary)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Quick Links (desktop only) ── */}
        <div className="hidden lg:flex items-center gap-1 max-w-7xl mx-auto px-4 py-2 overflow-x-auto text-xs border-b border-gray-200 bg-[var(--shop-bg)] flex-nowrap">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.q}
              to={`${ROUTES.SEARCH}?q=${encodeURIComponent(link.q)}`}
              className="px-3 py-1.5 rounded-full text-[var(--shop-text-secondary)] bg-white border border-[var(--shop-border)] hover:text-[var(--shop-primary)] hover:border-[var(--shop-primary)] whitespace-nowrap transition-colors text-xs font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Nav Bar ── */}
        <nav className={`border-t border-gray-100 bg-white ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:flex-nowrap px-4 py-1">
            {visibleCats.map((cat) => {
              const isActive = !cat.external && location.pathname === cat.path
              const linkClass = `flex items-center gap-1 px-3 py-2.5 text-sm font-medium rounded transition-colors duration-150 shrink-0 ${
                isActive
                  ? 'text-[var(--shop-primary)] border-b-2 border-[var(--shop-primary)]'
                  : 'text-[var(--shop-text-secondary)] hover:text-[var(--shop-primary)] hover:bg-[var(--shop-primary-light)] border-b-2 border-transparent'
              }`
              return cat.external ? (
                <a key={cat.label} href={cat.path} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {cat.label}
                  <ChevronDown size={14} className="opacity-50" />
                </a>
              ) : (
                <Link key={cat.label} to={cat.path} className={linkClass}>
                  {cat.label}
                  <ChevronDown size={14} className="opacity-50" />
                </Link>
              )
            })}
            {hiddenCats.length > 0 && (
              <span className="px-3 py-2.5 text-sm font-medium text-[var(--shop-text-muted)] shrink-0">
                +{hiddenCats.length} thêm
              </span>
            )}
          </div>
        </nav>
      </header>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 min-h-[60vh] max-w-7xl mx-auto w-full">{children}</main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[var(--shop-bg)] border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 py-10 text-sm text-gray-600">
          {/* col 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Về Long Châu</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">Giới thiệu</Link></li>
              <li><Link to={ROUTES.STORES} className="hover:text-blue-600 transition-colors">Hệ thống nhà thuốc</Link></li>
              <li><Link to="/careers" className="hover:text-blue-600 transition-colors">Tuyển dụng</Link></li>
            </ul>
          </div>
          {/* col 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Chính sách</h4>
            <ul className="space-y-2">
              <li><Link to="/policy/return" className="hover:text-blue-600 transition-colors">Đổi trả trong 30 ngày</Link></li>
              <li><Link to="/policy/privacy" className="hover:text-blue-600 transition-colors">Bảo mật thông tin</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-blue-600 transition-colors">Chính sách giao hàng</Link></li>
            </ul>
          </div>
          {/* col 3 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2">
              <li><a href="tel:18006928" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">1800 6928</a></li>
              <li><Link to="/faq" className="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="/guide" className="hover:text-blue-600 transition-colors">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>
          {/* col 4 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Tải ứng dụng & Kết nối</h4>
            <div className="flex gap-3 mb-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-blue-600 font-semibold transition-colors">
                Facebook
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-red-600 font-semibold transition-colors">
                YouTube
              </a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-700">App Store</span>
              <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold text-gray-700">Google Play</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
          <p>© 2026 PCMS — Nhà thuốc của bạn, trọn vẹn từ tâm</p>
          <p className="mt-1">GPKD số 0301... do Sở KH&ĐT TP.HCM cấp. Điều khoản · Bảo mật</p>
        </div>
      </footer>
    </div>
  )
}
