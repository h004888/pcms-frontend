// =====================================================
// ShopFlashSaleBanner — Flash sale CTA trên shop home (real API)
// /api/v1/ecom-ops/flash-sales/active
// =====================================================

import Link from 'next/link';
import { Clock, Zap, ArrowRight, Pill } from 'lucide-react';
import { fetchFlashSalesActive } from '@/features/flash-sales';
import { formatVND } from '@/lib/shop/format';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function getCountdown(endsAt?: string) {
  const now = new Date();
  const end = endsAt ? new Date(endsAt) : new Date(now.getTime() + 6 * 3600 * 1000);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h: pad(h), m: pad(m), s: pad(s) };
}

interface FlashSaleLite {
  id: string;
  endsAt?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    discountPercent: number;
  }>;
}

export async function ShopFlashSaleBanner() {
  let flashSale: FlashSaleLite | null = null;
  try {
    const res = await fetchFlashSalesActive();
    flashSale = (res as FlashSaleLite[])[0] ?? null;
  } catch {
    flashSale = null;
  }

  const { h, m, s } = getCountdown(flashSale?.endsAt);
  const products = flashSale?.products ?? [
    { id: 'p1', name: 'Vitamin C 1000mg', price: 85000, oldPrice: 110000, discountPercent: 23 },
    { id: 'p2', name: 'Omega-3 1000mg', price: 320000, oldPrice: 420000, discountPercent: 24 },
    { id: 'p3', name: 'Paracetamol 500mg', price: 18000, oldPrice: 25000, discountPercent: 28 },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
      aria-labelledby="flash-sale-title"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-danger-500 via-danger-600 to-warning-500 text-white rounded-2xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-warning-300/20"
        />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center p-6 md:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/20 backdrop-blur border border-white/30 rounded-full text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              FLASH SALE · Hôm nay
            </div>
            <h2
              id="flash-sale-title"
              className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight"
            >
              Giảm đến 50% — đang diễn ra
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/90 text-pretty max-w-xl">
              Vitamin, thuốc không kê đơn, dược mỹ phẩm — số lượng có hạn, giao tận nơi.
            </p>
            <div
              className="mt-4 flex items-center gap-2"
              aria-label="Thời gian còn lại"
            >
              <Clock className="w-4 h-4 opacity-80" aria-hidden="true" />
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                Còn
              </span>
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
                    {i < 2 && (
                      <span className="text-white/60 font-bold">:</span>
                    )}
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

          <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 lg:gap-2">
            {products.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="bg-white/15 backdrop-blur border border-white/25 rounded-lg p-3 min-w-[120px] hover:bg-white/25 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/25 rounded-md flex items-center justify-center flex-shrink-0">
                    <Pill className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                      -{p.discountPercent}%
                    </p>
                    <p className="text-xs font-bold truncate">{p.name}</p>
                  </div>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold font-mono">
                    {formatVND(p.price)}
                  </span>
                  {p.oldPrice && (
                    <span className="text-[10px] line-through opacity-60 font-mono">
                      {formatVND(p.oldPrice)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}