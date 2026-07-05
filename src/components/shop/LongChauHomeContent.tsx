// =====================================================
// LongChauHomeContent — Premium B2C pharmacy homepage.
// Server Component: fetch data từ backend API.
// Design: Long Châu brand — Ink/Acent tokens.
// =====================================================

import { Zap, Droplet, Stethoscope, ArrowRight, Sparkles, Pill, MessageCircle, FileText, MapPin, Syringe, Shield } from 'lucide-react';
import Link from 'next/link';
import { LongChauHeroCarousel, LongChauVideoCarousel, LongChauFlashCarousel, BackToTopButton } from './LongChauHomeClient';
import {
  getHeroBannersServerSide,
  getCategoriesServerSide,
  getActiveFlashSalesServerSide,
  getVideosServerSide,
  getLatestHealthArticleServerSide,
  getDiseasesServerSide,
  getBrandsServerSide,
  getBestSellersServerSide,
  getHealthQuizTeaserServerSide,
  getSubPromosServerSide,
  getQuickLinksServerSide,
} from '@/hooks/home';
import { EmptyState } from '@/components/common/EmptyState';
import type { Category, FlashSale, Disease } from '@/types/home';

// ---------- Helpers ----------

function groupDiseasesByAudience(diseases: Disease[]) {
  return {
    Nam: diseases.filter((d) => d.targetAudience === 'MALE' || d.targetAudience === 'ALL'),
    Nữ: diseases.filter((d) => d.targetAudience === 'FEMALE' || d.targetAudience === 'ALL'),
    'Cao tuổi': diseases.filter((d) => d.targetAudience === 'ELDERLY' || d.targetAudience === 'ALL'),
    'Trẻ em': diseases.filter((d) => d.targetAudience === 'CHILD' || d.targetAudience === 'ALL'),
  };
}

function SectionHeading({ children, action }: { children: React.ReactNode; action?: { label: string; href: string } }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-xl md:text-2xl font-extrabold text-ink-900 tracking-tight flex items-center gap-3 text-balance">
        <span className="w-1 h-6 bg-accent-500 rounded-full shrink-0" />
        {children}
      </h2>
      {action && (
        <Link href={action.href} className="text-sm font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors">
          {action.label}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
}

// ---------- Main Server Component ----------

export async function LongChauHomeContent() {
  const [banners, categories, flashSales, videos, latestArticle, diseases, brands, bestSellers, healthQuizTeaser, subPromos, quickLinks] = await Promise.all([
    getHeroBannersServerSide(),
    getCategoriesServerSide(12),
    getActiveFlashSalesServerSide(),
    getVideosServerSide(),
    getLatestHealthArticleServerSide(),
    getDiseasesServerSide(),
    getBrandsServerSide(),
    getBestSellersServerSide(),
    getHealthQuizTeaserServerSide(),
    getSubPromosServerSide(),
    getQuickLinksServerSide(),
  ]);

  return (
    <div className="bg-ink-50/30">
      {/* ===== HERO CAROUSEL ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          {banners.length > 0 ? (
            <LongChauHeroCarousel banners={banners} />
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-ink-50 to-accent-50 min-h-[280px] flex items-center justify-center">
              <EmptyState message="Chưa có banner nào" icon="🖼️" />
            </div>
          )}
        </div>
      </section>

      {/* ===== SUB-PROMOS ===== */}
      {subPromos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 grid md:grid-cols-3 gap-4">
          {subPromos.slice(0, 3).map((promo: any, idx: number) => (
            <a
              key={promo.id || idx}
              href={promo.linkUrl || '#'}
              className={
                idx === 0
                  ? 'relative group overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 p-6 text-white md:col-span-2 flex items-center justify-between hover:shadow-xl transition-all duration-300'
                  : 'relative group overflow-hidden rounded-2xl bg-gradient-to-br from-warning-500 to-danger-600 p-6 text-white flex items-center justify-between hover:shadow-xl transition-all duration-300'
              }
            >
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" aria-hidden="true" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" aria-hidden="true" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{promo.title}</span>
                <div className="text-xl md:text-2xl font-extrabold mt-1 text-balance">{promo.title}</div>
              </div>
              <div className="relative text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                {idx === 0 ? '🤖' : '🥗'}
              </div>
            </a>
          ))}
        </section>
      )}

      {/* ===== QUICK LINKS STRIP ===== */}
      {quickLinks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5">
          <div className="bg-white border border-ink-100 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-6 overflow-hidden">
            {quickLinks.map((ql: any) => (
              <a
                key={ql.id}
                href={ql.href || '#'}
                className="flex items-center gap-3 p-4 hover:bg-accent-50/50 transition-colors border-r border-b md:border-b-0 border-ink-100 last:border-r-0 text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {(() => {
                    const iconMap: Record<string, React.ReactNode> = {
                      'Stethoscope': <Stethoscope className="w-5 h-5 text-accent-600" />,
                      'MessageCircle': <MessageCircle className="w-5 h-5 text-accent-600" />,
                      'FileText': <FileText className="w-5 h-5 text-accent-600" />,
                      'MapPin': <MapPin className="w-5 h-5 text-accent-600" />,
                      'Syringe': <Syringe className="w-5 h-5 text-accent-600" />,
                      'Shield': <Shield className="w-5 h-5 text-accent-600" />,
                    };
                    return iconMap[ql.icon] || <Pill className="w-5 h-5 text-accent-600" />;
                  })()}
                </div>
                <span className="text-sm font-semibold text-ink-800 group-hover:text-accent-700 transition-colors">{ql.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ===== FLASH SALE ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-accent-900 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center animate-pulse-subtle">
                <Zap className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-balance">Flash Sale</h2>
                <p className="text-sm text-white/70">Giá sốc — số lượng có hạn</p>
              </div>
            </div>
            <Link href="/flash-sale" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {flashSales.length > 0 ? (
            <div className="mt-6">
              <LongChauFlashCarousel items={flatFlashSales(flashSales)} />
            </div>
          ) : (
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl">
              <EmptyState message="Chưa có flash sale nào" icon="⚡" />
            </div>
          )}
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-danger-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            <Sparkles className="w-3 h-3" />
            Sản phẩm bán chạy
          </span>
        </div>
        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {bestSellers.map((p: any, idx: number) => (
              <Link
                key={p.id}
                href={`/tra-cuu-thuoc/${p.slug}`}
                className="group bg-white border border-ink-100 rounded-xl p-4 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-card-enter"
                style={{ animationDelay: `${(idx % 5) * 80}ms` }}
              >
                <div className="w-full aspect-square bg-gradient-to-br from-ink-50 to-white rounded-lg flex items-center justify-center overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="max-h-24 object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <span className="text-4xl opacity-30">💊</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900 line-clamp-2 leading-snug min-h-[2.5rem]">{p.name}</p>
                <p className="mt-1.5 text-danger-700 font-extrabold">{formatVND(Number(p.price))}</p>
                {p.soldCount != null && (
                  <p className="mt-1 text-xs text-ink-500">Đã bán {Number(p.soldCount).toLocaleString('vi-VN')}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có sản phẩm bán chạy" icon="🏆" />
          </div>
        )}
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <SectionHeading action={{ label: 'Xem tất cả danh mục', href: '/danh-muc' }}>
          Danh mục nổi bật
        </SectionHeading>
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.slice(0, 12).map((c: Category, idx: number) => (
              <Link
                key={c.id}
                href={`/tra-cuu-thuoc?q=${encodeURIComponent(c.name)}`}
                className="group bg-white border border-ink-100 rounded-xl p-4 md:p-5 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-card-enter"
                style={{ animationDelay: `${(idx % 6) * 50}ms` }}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Droplet className="w-7 h-7 text-accent-600" />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900 group-hover:text-accent-700 transition-colors">{c.name}</p>
                {c.productCount != null && (
                  <p className="mt-1 text-xs text-ink-500">{c.productCount} sản phẩm</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có danh mục nổi bật" icon="📂" />
          </div>
        )}
      </section>

      {/* ===== BRANDS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <SectionHeading>Thương hiệu yêu thích</SectionHeading>
        {brands.length > 0 ? (
          <div className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin">
            {brands.map((b: any) => (
              <div
                key={b.id}
                className="min-w-[150px] md:min-w-0 snap-start bg-white border border-ink-100 rounded-xl p-5 flex flex-col items-center justify-center min-h-[100px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt={b.name} className="h-9 object-contain group-hover:scale-105 transition-transform duration-200" loading="lazy" />
                ) : (
                  <span className="text-sm font-extrabold text-ink-700 group-hover:text-accent-700 transition-colors">{b.name}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có thương hiệu" icon="🏷️" />
          </div>
        )}
      </section>

      {/* ===== HEALTH CHECKS ===== */}
      {healthQuizTeaser?.available && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-gradient-to-br from-accent-600 via-accent-700 to-ink-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" aria-hidden="true" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
                <Stethoscope className="w-3.5 h-3.5" />
                Miễn phí · 5 phút
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kiểm tra sức khỏe</h2>
              <p className="mt-2 text-accent-100 text-pretty max-w-xl">Tự đánh giá nhanh sức khỏe qua các bài kiểm tra chuyên khoa và nhận lời khuyên từ AI</p>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <HealthCheckCard title="Bài kiểm tra tổng quát" sub="Đánh giá, theo dõi sức khỏe toàn diện" />
                <HealthCheckCard title="Kiểm tra chuyên khoa" sub="Nhanh chóng - dễ dàng - hiệu quả" />
                <HealthCheckCard title="Tư vấn sức khỏe" sub="Nhận lời khuyên từ dược sĩ và AI" />
              </div>
              <a href={healthQuizTeaser.url || '/health-quiz'} className="mt-6 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-semibold transition-all">
                Bắt đầu ngay
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===== DISEASE BY SEASON ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <SectionHeading action={{ label: 'Xem tất cả', href: '/benh-thuong-gap' }}>
          Bệnh theo mùa
        </SectionHeading>
        {diseases.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {diseases.slice(0, 4).map((d) => {
              const severityColors: Record<string, string> = {
                CRITICAL: 'from-danger-600 to-danger-700',
                HIGH: 'from-warning-500 to-warning-700',
                MEDIUM: 'from-accent-500 to-accent-600',
                LOW: 'from-info-500 to-info-600',
              };
              const gradient = severityColors[d.severity ?? ''] || 'from-ink-500 to-ink-600';
              return (
                <Link
                  key={d.id}
                  href={`/benh-thuong-gap/${d.slug ?? ''}`}
                  className="group bg-white border border-ink-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`bg-gradient-to-r ${gradient} text-white p-4`}>
                    <span className="text-2xl">{d.severity === 'HIGH' ? '⚠️' : d.severity === 'MEDIUM' ? '🔔' : '💊'}</span>
                    <h3 className="mt-1.5 font-bold text-sm">{d.name}</h3>
                  </div>
                  <p className="p-4 text-xs text-ink-600 line-clamp-3 leading-relaxed">{d.body.replace(/^##\s.*\n/, '')}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có bệnh theo mùa" icon="🤒" />
          </div>
        )}
      </section>

      {/* ===== VIDEO CAROUSEL ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <SectionHeading action={{ label: 'Xem tất cả', href: '/video' }}>
          Video sức khỏe
        </SectionHeading>
        {videos.length > 0 ? (
          <LongChauVideoCarousel videos={videos} />
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có video nào" icon="🎬" />
          </div>
        )}
      </section>

      {/* ===== SEO article block ===== */}
      {latestArticle && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <SectionHeading>Bài viết sức khỏe mới nhất</SectionHeading>
          <div className="bg-white border border-ink-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/bai-viet/${latestArticle.slug}`} className="group">
              <h3 className="text-xl font-bold text-ink-900 group-hover:text-accent-700 transition-colors">{latestArticle.title}</h3>
              <p className="mt-3 text-sm text-ink-600 leading-relaxed whitespace-pre-line line-clamp-4">{latestArticle.bodyMarkdown}</p>
            </Link>
            <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
              {latestArticle.author && <span>Tác giả: {latestArticle.author}</span>}
              {latestArticle.publishedAt && <span>{new Date(latestArticle.publishedAt).toLocaleDateString('vi-VN')}</span>}
              {latestArticle.viewCount != null && <span>{latestArticle.viewCount.toLocaleString('vi-VN')} lượt xem</span>}
            </div>
          </div>
        </section>
      )}

      {/* ===== DISEASE BY GENDER ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        <SectionHeading action={{ label: 'Xem tất cả', href: '/benh-thuong-gap' }}>
          Bệnh theo đối tượng
        </SectionHeading>
        {diseases.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(groupDiseasesByAudience(diseases)).map(([gender, items]) => (
              <div key={gender} className="bg-white border border-ink-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-center font-bold py-3 text-sm tracking-wide">
                  {gender.toUpperCase()}
                </div>
                <ul className="p-4 space-y-1.5">
                  {(items as Disease[]).slice(0, 5).map((d) => (
                    <li key={d.id}>
                      <Link
                        href={`/benh-thuong-gap/${d.slug ?? ''}`}
                        className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-ink-700 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-all"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                {(items as Disease[]).length > 0 && (
                  <Link
                    href={`/suc-khoe/benh/${(items as Disease[])[0].slug ?? ''}`}
                    className="block w-full bg-ink-50 text-accent-600 text-xs font-semibold py-2.5 hover:bg-accent-50 transition-colors text-center border-t border-ink-100"
                  >
                    Xem chi tiết →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-ink-100 rounded-2xl">
            <EmptyState message="Chưa có bệnh nào" icon="🩺" />
          </div>
        )}
      </section>

      {/* ===== BACK TO TOP ===== */}
      <BackToTopButton />
    </div>
  );
}

function HealthCheckCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex items-start justify-between gap-3 hover:bg-white/20 transition-colors">
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="mt-1 text-xs text-accent-100">{sub}</p>
        <button className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors">
          Bắt đầu ngay →
        </button>
      </div>
      <span className="text-3xl shrink-0">🩺</span>
    </div>
  );
}

function flatFlashSales(list: FlashSale[]) {
  return list.flatMap((fs) => fs.items ?? []);
}
