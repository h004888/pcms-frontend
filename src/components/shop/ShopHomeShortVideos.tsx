// =====================================================
// ShopHomeShortVideos — Video ngắn từ Bộ Y tế, WHO
// =====================================================

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';

const MOCK_VIDEOS = [
  { id: 1, title: 'Cách sử dụng Paracetamol đúng liều', duration: '2:15' },
  { id: 2, title: 'Phân biệt cảm cúm và cảm lạnh', duration: '3:40' },
  { id: 3, title: 'Bảo quản thuốc trong mùa nóng', duration: '1:55' },
  { id: 4, title: '5 dấu hiệu sốt xuất huyết cần nhập viện', duration: '4:20' },
];

export function ShopHomeShortVideos() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"
      aria-labelledby="videos-title"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-danger-50 text-danger-700 text-xs font-semibold rounded-full mb-2">
            <Play className="w-3 h-3" aria-hidden="true" />
            Video y khoa
          </div>
          <h2
            id="videos-title"
            className="text-2xl font-bold text-ink-900 tracking-tight text-balance"
          >
            Video ngắn từ Bộ Y tế, WHO
          </h2>
        </div>
        <Link
          href="/video"
          className="text-sm font-medium text-accent-700 hover:text-accent-800 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
        >
          Xem tất cả
          <Play className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOCK_VIDEOS.map((video) => (
          <Link
            key={video.id}
            href="/video"
            className="group block bg-white border border-ink-200 rounded-md overflow-hidden hover:border-accent-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <div className="relative aspect-video bg-ink-100">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                <Play className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" aria-hidden="true" />
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 h-5 bg-black/70 text-white text-[10px] font-medium rounded font-mono">
                <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                {video.duration}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-ink-900 line-clamp-2 group-hover:text-accent-700 text-balance">
                {video.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
