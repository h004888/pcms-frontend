import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowUp, Truck, ShieldCheck, MessageCircle, AlertTriangle,
  Pill, Stethoscope, Syringe, FileText, MapPin, Search, Shield,
  HeartPulse, Activity,
} from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getShopHome } from '../api/shopApi'
import { HeroBanner } from '../components/HeroBanner'
import { ProductCard } from '../components/ProductCard'

const ITEMS_PER_PAGE = 8

const ICON_MAP = {
  pill: Pill,
  stethoscope: Stethoscope,
  vitamin: Activity,
  messagecircle: MessageCircle,
  vaccine: Syringe,
  syring: Syringe,
  filetext: FileText,
  mappin: MapPin,
  search: Search,
  shield: Shield,
  health: HeartPulse,
  device: Activity,
}
function resolveIcon(name) {
  if (!name) return Activity
  const key = name.toLowerCase().replace(/[\s_-]/g, '')
  return ICON_MAP[key] || Activity
}

function toProduct(b) {
  return {
    id: b.id,
    slug: b.slug || '',
    name: b.name,
    price: Number(b.price ?? 0),
    imageUrl: b.imageUrl,
    soldCount: b.soldCount,
    origin: null,
    unit: null,
  }
}

export function ShopHomePage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['shop-home'], queryFn: getShopHome,
  })

  const [showCount, setShowCount] = useState(ITEMS_PER_PAGE)
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => { setShowCount(ITEMS_PER_PAGE) }, [data])
  useEffect(() => { window.scrollTo(0, 0) }, [])

  /* Scroll progress + back to top */
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const visibleBestSellers = useMemo(
    () => (data?.bestSellers || []).slice(0, showCount),
    [data, showCount]
  )
  const hasMore = (data?.bestSellers?.length || 0) > showCount

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-[420px] bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[280px] bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-4">Không thể tải trang chủ.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-[var(--shop-primary)] text-white rounded-full font-semibold hover:bg-[var(--shop-primary-hover)] transition-colors"
        >
          Thử lại
        </button>
      </div>
    )
  }

  const { heroBanners, featuredCategories, bestSellers, quickLinks } = data || {}

  return (
    <div>
      {/* ═══ HERO CAROUSEL ═══ */}
      <HeroBanner banners={heroBanners} />

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-y border-blue-100" aria-label="Cam kết cửa hàng">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-16 px-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--shop-primary)]">
            <Truck size={18} aria-hidden="true" />
            <span>Giao hàng trong 2h</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--shop-primary)]">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Chính hãng 100%</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--shop-primary)]">
            <MessageCircle size={18} aria-hidden="true" />
            <span>Tư vấn dược sĩ 24/7</span>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      {featuredCategories?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[var(--shop-text)]">Danh mục nổi bật</h2>
            <Link to={ROUTES.SEARCH} className="text-sm text-blue-600 font-semibold hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none">
            {featuredCategories.map(cat => (
              <Link
                key={cat.id}
                to={`${ROUTES.SEARCH}?q=${encodeURIComponent(cat.name)}`}
                className="snap-start shrink-0 w-[160px] md:w-[180px] bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md hover:border-[var(--shop-primary)] hover:-translate-y-1 transition-all duration-200"
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-16 h-16 mx-auto mb-2 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <span className="w-16 h-16 mx-auto mb-2 rounded-lg bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                    {cat.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{cat.name}</h3>
                <p className="text-xs text-gray-400">{(cat.productCount || 0).toLocaleString('vi-VN')} sản phẩm</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ BEST SELLERS ═══ */}
      {visibleBestSellers.length > 0 && (
        <section className="bg-[var(--shop-bg)] py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[var(--shop-text)]">Bán chạy nhất</h2>
            <Link to={ROUTES.SEARCH} className="text-sm text-blue-600 font-semibold hover:underline">
              Xem tất cả →
            </Link>
          </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleBestSellers.map(p => (
                <ProductCard
                  key={p.id}
                  product={toProduct(p)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-[var(--shop-primary)] text-[var(--shop-primary)] rounded-full font-semibold hover:bg-[var(--shop-primary-light)] transition-colors"
                  onClick={() => setShowCount(c => c + ITEMS_PER_PAGE)}
                >
                  Xem thêm ({(bestSellers.length - showCount).toLocaleString('vi-VN')} sản phẩm)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ SERVICES ═══ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[var(--shop-text)] mb-8">Dịch vụ sức khỏe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-[var(--shop-primary)] hover:-translate-y-1 transition-all duration-200 group">
            <div className="w-12 h-12 bg-[var(--shop-primary-light)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Syringe size={24} className="text-[var(--shop-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--shop-text)] mb-2">Tiêm chủng</h3>
            <p className="text-sm text-[var(--shop-text-secondary)] mb-4 leading-relaxed">
              Đặt lịch online nhanh chóng. 4 loại vắc-xin sẵn sàng.
            </p>
            <Link to="/vaccines" className="text-[var(--shop-primary)] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              Đặt lịch →
            </Link>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-[var(--shop-primary)] hover:-translate-y-1 transition-all duration-200 group">
            <div className="w-12 h-12 bg-[var(--shop-primary-light)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <MessageCircle size={24} className="text-[var(--shop-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--shop-text)] mb-2">Tư vấn dược sĩ</h3>
            <p className="text-sm text-[var(--shop-text-secondary)] mb-4 leading-relaxed">
              Chat trực tiếp 24/7 hoàn toàn miễn phí với dược sĩ chính hãng.
            </p>
            <a href="#" className="text-[var(--shop-primary)] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              Chat ngay →
            </a>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-[var(--shop-primary)] hover:-translate-y-1 transition-all duration-200 group">
            <div className="w-12 h-12 bg-[var(--shop-primary-light)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Search size={24} className="text-[var(--shop-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--shop-text)] mb-2">Tra cứu thuốc</h3>
            <p className="text-sm text-[var(--shop-text-secondary)] mb-4 leading-relaxed">
              Thông tin chính xác từ Bộ Y Tế, cập nhật liên tục.
            </p>
            <Link to={ROUTES.SEARCH} className="text-[var(--shop-primary)] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              Tra cứu →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ QUICK LINKS ═══ */}
      {quickLinks?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-[var(--shop-text)] mb-8">Tiện ích nhanh</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickLinks.map(link => {
              const Icon = resolveIcon(link.icon)
              return (
                <a
                  key={link.id}
                  href={link.href || '#'}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-[var(--shop-primary)] hover:-translate-y-1 transition-all duration-200"
                >
                  <Icon size={20} className="text-blue-600" />
                  <span className="text-xs font-medium text-gray-700 text-center">{link.label}</span>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* ═══ BACK TO TOP ═══ */}
      <button
        className={`fixed bottom-6 right-6 w-12 h-12 bg-[var(--shop-primary)] text-white rounded-full shadow-lg hover:bg-[var(--shop-primary-hover)] transition-all duration-300 z-50 flex items-center justify-center ${
          showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
      >
        <ArrowUp size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
