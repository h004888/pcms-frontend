// =====================================================
// ShopHomeShortVideos — Video ngắn từ Bộ Y tế, WHO (vivid edition)
// Mỗi card có gradient riêng theo chủ đề video + thumbnail mock
// Layout: 1 hero card (video featured) + 3 small cards
// Phá vỡ equal-grid pattern.
// =====================================================

import Link from 'next/link';
import { Play, Clock, ArrowRight, Youtube, Video, Microscope, HeartPulse, ShieldAlert } from 'lucide-react';

const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'Cách sử dụng Paracetamol đúng liều',
    duration: '2:15',
    source: 'Bộ Y tế',
    gradient: 'from-info-600 via-info-700 to-ink-800',
    icon: Microscope,
    featured: true,
  },
  {
    id: 2,
    title: 'Phân biệt cảm cúm và cảm lạnh',
    duration: '3:40',
    source: 'WHO',
    gradient: 'from-accent-500 via-accent-600 to-ink-800',
    icon: HeartPulse,
  },
  {
    id: 3,
    title: 'Bảo quản thuốc trong mùa nóng',
    duration: '1:55',
    source: 'Dược sĩ tư vấn',
    gradient: 'from-warning-500 via-warning-600 to-danger-700',
    icon: ShieldAlert,
  },
  {
    id: 4,
    title: '5 dấu hiệu sốt xuất huyết cần nhập viện',
    duration: '4:20',
    source: 'Bộ Y tế',
    gradient: 'from-danger-500 via-danger-600 to-ink-900',
    icon: Video,
  },
];

export function ShopHomeShortVideos() {
  const featured = MOCK_VIDEOS[0];
  const rest = MOCK_VIDEOS.slice(1);
  const FeaturedIcon = featured.icon;
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      aria-labelledby="videos-title"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger-700 mb-2">
            <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
            Video y khoa chính thống
          </div>
          <h2
            id="videos-title"
            className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance leading-tight"
          >
            Video từ Bộ Y tế, WHO, dược sĩ
          </h2>
          <p className="mt-2 text-sm text-ink-600 text-pretty max-w-2xl">
            Hướng dẫn sử dụng thuốc đúng cách — cập nhật từ nguồn chính thống.
          </p>
        </div>
        <Link
          href="/video"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
        >
          Xem tất cả
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Featured video — large card */}
        <Link
          href="/video"
          className="group relative block aspect-video rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
          {/* Decorative pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {/* Icon watermark */}
          <FeaturedIcon
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-white/10"
            aria-hidden="true"
          />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-2 border-white/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200">
              <Play className="w-8 h-8 text-white fill-white ml-1" aria-hidden="true" />
            </div>
          </div>
          {/* Top-left badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 h-6 bg-white/20 backdrop-blur border border-white/40 rounded text-xs font-bold text-white">
              Nổi bật
            </span>
            <span className="text-xs text-white/80 font-medium">{featured.source}</span>
          </div>
          {/* Duration */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2 h-6 bg-black/60 backdrop-blur text-white text-xs font-medium rounded font-mono">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {featured.duration}
          </div>
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-ink-900/80 to-transparent">
            <h3 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2 text-balance">
              {featured.title}
            </h3>
          </div>
        </Link>

        {/* Small videos stack */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {rest.map((v) => {
            const Icon = v.icon;
            return (
              <Link
                key={v.id}
                href="/video"
                className="group flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-lg hover:border-accent-500 transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className={`relative flex-shrink-0 w-20 h-14 bg-gradient-to-br ${v.gradient} rounded-md overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 px-1 h-4 bg-black/70 text-white text-[9px] font-mono font-medium rounded-sm flex items-center">
                    {v.duration}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-ink-900 line-clamp-2 leading-snug group-hover:text-accent-700 transition-colors text-balance">
                    {v.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-500">{v.source}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
