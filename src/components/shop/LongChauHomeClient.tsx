// =====================================================
// LongChauHomeClient — Client components cho trang chủ.
// Premium edition: smooth carousels, micro-interactions,
// proper icons, reduced-motion support.
// =====================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import type { HomeBanner, FlashSaleItem, VideoTeaser } from '@/types/home';

// ----- HOOK: Auto-play carousel -----
function useCarousel(total: number, interval = 5000) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (paused || total < 2) return;
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % total), interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, total, interval]);

  const goTo = useCallback((i: number) => setIdx(i), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  return { idx, goTo, prev, next, paused, setPaused };
}

// ----- HERO CAROUSEL -----
export function LongChauHeroCarousel({ banners }: { banners: HomeBanner[] }) {
  const { idx, goTo, prev, next, setPaused } = useCarousel(banners.length, 5000);
  const total = banners.length;
  if (total === 0) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-accent-700 via-ink-800 to-ink-900 shadow-xl group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            i === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02] pointer-events-none'
          }`}
        >
          <a
            href={b.linkUrl || '#'}
            className="block relative h-full grid md:grid-cols-2 gap-6 items-center p-8 md:p-14"
          >
            {/* Text side */}
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold text-white/90 mb-5">
                🔥 Ưu đãi đặc biệt
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white text-balance">
                {b.title}
              </h2>
              <button className="mt-8 bg-danger-600 hover:bg-danger-700 active:scale-95 transition-all px-8 py-4 rounded-full font-bold text-base shadow-lg">
                XEM NGAY →
              </button>
            </div>
            {/* Image side */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" aria-hidden="true" />
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="relative max-h-[260px] w-auto rounded-xl shadow-2xl object-contain"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          </a>
        </div>
      ))}

      {/* Nav arrows */}
      {total > 1 && (
        <>
          <button onClick={prev} aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10 md:opacity-0 md:group-hover:opacity-100 hover:scale-110">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all z-10 md:opacity-0 md:group-hover:opacity-100 hover:scale-110">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === idx ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----- VIDEO CAROUSEL -----
export function LongChauVideoCarousel({ videos }: { videos: VideoTeaser[] }) {
  const { idx: pos, next, prev } = useCarousel(Math.max(1, videos.length - 5), 4000);
  const visible = 6;
  const total = videos.length;
  const canLeft = pos > 0;
  const canRight = pos < Math.max(0, total - visible);
  if (total === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${pos * (100 / visible)}%)` }}
        >
          {videos.map((v) => (
            <a
              key={v.id}
              href={`/video`}
              className="bg-white border border-ink-200 rounded-xl overflow-hidden shrink-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ width: `calc((100% - ${(visible - 1) * 16}px) / ${visible})` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center group/vid">
                {v.thumbnailUrl ? (
                  <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <Play className="w-10 h-10 text-white/60" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover/vid:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-all scale-90 group-hover/vid:scale-100">
                    <Play className="w-5 h-5 text-ink-900 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-ink-800 line-clamp-2 leading-relaxed">{v.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      {canLeft && (
        <button onClick={prev} aria-label="Previous"
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-ink-200 hover:border-ink-300 rounded-full shadow-lg flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 hover:scale-110 z-10">
          <ChevronLeft className="w-4 h-4 text-ink-600" />
        </button>
      )}
      {canRight && (
        <button onClick={next} aria-label="Next"
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-ink-200 hover:border-ink-300 rounded-full shadow-lg flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 hover:scale-110 z-10">
          <ChevronRight className="w-4 h-4 text-ink-600" />
        </button>
      )}
    </div>
  );
}

// ----- FLASH SALE CAROUSEL -----
export function LongChauFlashCarousel({ items }: { items: FlashSaleItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 scrollbar-thin">
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-6 gap-4">
        {items.map((p, idx) => {
          const discountPct = p.discountPercent ?? 0;
          return (
            <div
              key={p.id}
              className="min-w-[75%] sm:min-w-[260px] md:min-w-0 snap-start bg-white rounded-xl overflow-hidden text-ink-900 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group animate-card-enter"
              style={{ animationDelay: `${(idx % 6) * 60}ms` }}
            >
              <div className="relative bg-gradient-to-br from-ink-50 to-white h-44 flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.medicineName} className="max-h-32 object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                ) : (
                  <span className="text-5xl opacity-30">💊</span>
                )}
                {discountPct > 0 && (
                  <span className="absolute top-3 left-3 bg-danger-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPct}%
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2.5">
                <p className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{p.medicineName}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-danger-700 font-extrabold text-base">
                    {p.salePrice.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs text-ink-400 line-through">
                    {p.originalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <button className="w-full bg-danger-600 hover:bg-danger-700 active:scale-95 transition-all text-white text-sm font-bold py-3 rounded-xl">
                  Mua ngay
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----- COOKIE BANNER -----
export function LongChauCookieBanner() {
  const [open, setOpen] = useState(true);
  const [rejected, setRejected] = useState(false);
  if (!open || rejected) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-7xl bg-ink-800/95 backdrop-blur-md border border-ink-700/50 rounded-xl p-4 md:p-5 text-sm text-ink-100 flex flex-col sm:flex-row items-start gap-3 shadow-2xl">
        <span className="mt-0.5 text-lg shrink-0">🍪</span>
        <p className="flex-1 leading-relaxed text-pretty text-xs md:text-sm">
          Chúng tôi sử dụng cookie để cải thiện trải nghiệm và phân tích lưu lượng truy cập.
          Tiếp tục sử dụng, đồng nghĩa với việc đồng ý với chính sách của chúng tôi.
        </p>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button onClick={() => setRejected(true)} className="flex-1 sm:flex-none text-center text-ink-300 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
            Từ chối
          </button>
          <button onClick={() => setOpen(false)} className="flex-1 sm:flex-none text-center bg-accent-600 hover:bg-accent-700 transition text-white text-xs font-semibold px-4 py-2 rounded-lg">
            Đồng ý
          </button>
          <button onClick={() => setOpen(false)} aria-label="Đóng"
            className="p-2 text-ink-400 hover:text-white hover:bg-ink-700 rounded-lg transition hidden sm:block">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- BACK TO TOP -----
export function BackToTopButton() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div className="text-center py-8">
      <button
        onClick={scrollToTop}
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-400 hover:text-accent-600 transition-colors animate-float"
      >
        <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        Lên đầu trang
      </button>
    </div>
  );
}
