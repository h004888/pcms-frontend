import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { isUnrecoverableMojibake } from '../utils/mojibake.js'

const DEFAULT_TITLE = 'Sức khỏe của bạn, sứ mệnh của chúng tôi'
const DEFAULT_SUBTEXT = 'Hệ thống nhà thuốc đạt chuẩn GPP. Hơn 1.000 sản phẩm chính hãng từ các thương hiệu dược phẩm uy tín. Giao hàng trong 2 giờ.'
const DEFAULT_CTA = 'Khám phá ngay'
const DEFAULT_CTA_HREF = ROUTES.SEARCH

function SlideContent({ banner, isSingle }) {
  const href = banner?.linkUrl || DEFAULT_CTA_HREF
  const isInternal = href.startsWith('/')
  return (
    <div className="max-w-lg">
      {!isUnrecoverableMojibake(banner?.title) && (
        <p className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wider">
          {banner?.title || 'PCMS Pharmacy'}
        </p>
      )}
      {isSingle ? (
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
          {DEFAULT_TITLE}
        </h1>
      ) : (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
          {DEFAULT_TITLE}
        </h2>
      )}
      <p className="text-base md:text-lg text-blue-100 mb-8 leading-relaxed">
        {DEFAULT_SUBTEXT}
      </p>
      {isInternal ? (
        <Link
          to={href}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1E3A5F] hover:bg-blue-50 font-semibold rounded-full transition-colors shadow-lg"
        >
          {DEFAULT_CTA}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1E3A5F] hover:bg-blue-50 font-semibold rounded-full transition-colors shadow-lg"
        >
          {DEFAULT_CTA}
        </a>
      )}
    </div>
  )
}

export function HeroBanner({ banners }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const isSingle = !banners || banners.length <= 1
  const singleBanner = banners?.[0]

  useEffect(() => {
    if (isSingle) return
    const t = setInterval(() => {
      if (!paused) setActive(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(t)
  }, [banners?.length, paused, isSingle])

  const goTo = useCallback((idx) => {
    setActive(((idx % banners.length) + banners.length) % banners.length)
  }, [banners?.length])

  useEffect(() => {
    if (isSingle) return
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.clientWidth
      if (w > 0) setActive(Math.round(el.scrollLeft / w))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isSingle])

  /* ── Single banner ── */
  if (isSingle) {
    return (
      <section className="relative min-h-[460px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] h-full min-h-[460px]">
          <div
            className="order-2 md:order-1 bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] flex items-center px-6 md:px-10 lg:px-14 py-12"
          >
            <SlideContent banner={singleBanner} isSingle />
          </div>
          <div
            className="order-1 md:order-2 relative min-h-[240px] md:min-h-0 bg-cover bg-center"
            style={singleBanner?.imageUrl ? {
              backgroundImage: `url(${singleBanner.imageUrl})`,
            } : { background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #3B82F6 100%)' }}
          />
        </div>
      </section>
    )
  }

  /* ── Multi-banner carousel ── */
  return (
    <section
      className="relative min-h-[460px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner quảng cáo"
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full scrollbar-none"
      >
        {banners.map((b, i) => (
          <article
            key={b.id || i}
            className="snap-center shrink-0 w-full"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${banners.length}`}
            aria-hidden={i !== active}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] h-full min-h-[460px]">
              <div className="order-2 md:order-1 bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] flex items-center px-6 md:px-10 lg:px-14 py-12">
                <SlideContent banner={b} />
              </div>
              <div
                className="order-1 md:order-2 relative min-h-[240px] md:min-h-0 bg-cover bg-center"
                style={b.imageUrl ? {
                  backgroundImage: `url(${b.imageUrl})`,
                } : { background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #3B82F6 100%)' }}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Prev/Next arrows */}
      <button
        type="button"
        className="absolute left-2 md:left-[calc(50%-28px)] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
        onClick={() => goTo(active - 1)}
        aria-label="Banner trước"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
        onClick={() => goTo(active + 1)}
        aria-label="Banner sau"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Dots */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-[25%] md:-translate-x-1/2 flex gap-2 z-10"
        role="tablist"
        aria-label="Chọn banner"
      >
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Banner ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === active ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
