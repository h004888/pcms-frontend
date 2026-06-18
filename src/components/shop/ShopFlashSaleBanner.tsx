// =====================================================
// ShopFlashSaleBanner — Flash sale CTA trên shop home
// Banner nổi bật với gradient đậm, countdown, CTA lớn.
// Phá vỡ pattern "1 banner dài bình thường":
//   • Bên trái: copy + countdown
//   • Bên phải: 3 mini-product-cards floating
// Mục đích: tăng urgency + cross-sell trong cùng 1 section.
// =====================================================

import Link from 'next/link';
import { Clock, Zap, ArrowRight, Pill, FlaskConical, Sparkles } from 'lucide-react';

const FLASH_PRODUCTS = [
  { name: 'Vitamin C 1000mg', oldPrice: 110000, newPrice: 85000, off: 23, icon: Pill },
  { name: 'Omega-3 1000mg', oldPrice: 420000, newPrice: 320000, off: 24, icon: Sparkles },
  { name: 'Paracetamol 500mg', oldPrice: 25000, newPrice: 18000, off: 28, icon: FlaskConical },
];

// Countdown giả lập — trong production sẽ là server-driven
function pad(n: number) { return n.toString().padStart(2, '0'); }
function getCountdown() {
  const now = new Date();
  const end = new Date(now.getTime() + 6 * 60 * 60 * 1000 + 23 * 60 * 1000 + 45 * 1000);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export function ShopFlashSaleBanner() {
  const { h, m, s } = getCountdown();
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
      aria-labelledby="flash-sale-title"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-danger-500 via-danger-600 to-warning-500 text-white rounded-2xl">
        {/* Decorative dots */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {/* Ambient glows */}
        <div aria-hidden="true" className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-warning-300/20" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center p-6 md:p-8">
          {/* Left: copy + countdown */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/20 backdrop-blur border border-white/30 rounded-full text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              FLASH SALE · Hôm nay
            </div>
            <h2
              id="flash-sale-title"
              className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight"
            >
              Giảm đến 50% — chỉ trong 6 giờ
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/90 text-pretty max-w-xl">
              Vitamin, thuốc không kê đơn, dược mỹ phẩm — số lượng có hạn, giao tận nơi.
            </p>
            {/* Countdown */}
            <div className="mt-4 flex items-center gap-2" aria-label="Thời gian còn lại">
              <Clock className="w-4 h-4 opacity-80" aria-hidden="true" />
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Còn</span>
              <div className="flex items-center gap-1.5">
                {[
                  { v: h, label: 'giờ' },
                  { v: m, label: 'phút' },
                  { v: s, label: 'giây' },
                ].map((unit, i) => (
                  <span key={unit.label} className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center min-w-[36px] h-9 px-2 bg-white/20 backdrop-blur border border-white/30 rounded-md font-mono font-bold text-base">
                      {unit.v}
                    </span>
                    {i < 2 && <span className="text-white/60 font-bold">:</span>}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/flash-sale"
              className="mt-5 inline-flex items-center gap-2 px-5 h-11 bg-white text-danger-700 text-sm font-bold rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-danger-600"
            >
              Xem ưu đãi
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Right: mini product cards */}
          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 lg:gap-2">
            {FLASH_PRODUCTS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.name}
                  className="bg-white/15 backdrop-blur border border-white/25 rounded-lg p-3 min-w-[120px] hover:bg-white/25 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/25 rounded-md flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                        -{p.off}%
                      </p>
                      <p className="text-xs font-bold truncate">{p.name}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold font-mono">
                      {p.newPrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-[10px] line-through opacity-60 font-mono">
                      {p.oldPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
