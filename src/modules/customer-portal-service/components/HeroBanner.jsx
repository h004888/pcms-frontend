import { useEffect, useRef } from 'react'
import { ROUTES } from '@core/router/paths.js'

export function HeroBanner({ banners }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < window.innerHeight) {
        el.style.transform = `translateY(${scrollY * 0.3}px)`
        el.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.7))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="hero-banner">
      <div className="hero-banner-content" ref={ref}>
        <div className="hero-eyebrow">{(banners && banners[0]?.title) || 'PCMS Pharmacy'}</div>
        <h1 className="hero-headline">
          Sức khỏe<br />của bạn,<br /><span className="accent">trọn vẹn</span>
        </h1>
        <p className="hero-subtext">
          Hệ thống chuỗi nhà thuốc hiện đại với hơn 94 loại thuốc chính hãng.
          Giao hàng trong 2 giờ. Tư vấn bởi dược sĩ chuyên môn.
        </p>
        <a href={ROUTES.SEARCH} className="hero-cta">Khám phá ngay &rarr;</a>
      </div>
    </div>
  )
}
