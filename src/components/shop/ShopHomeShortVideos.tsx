// =====================================================
// ShopHomeShortVideos — Video y khoa (compact list)
// API: GET /admin/videos → 3 items
// =====================================================

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export const revalidate = 300;

interface VideoLite { id: string; title: string; duration: number; source?: string; url?: string; thumbnailUrl?: string; }

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

async function loadVideos(): Promise<VideoLite[]> {
  try {
    const res = await apiClient.get<VideoLite[] | { videos: VideoLite[] }>(API_ENDPOINTS.VIDEOS);
    const body = res.data;
    return (Array.isArray(body) ? body : (body?.videos ?? [])).slice(0, 3);
  } catch { return []; }
}

export async function ShopHomeShortVideos() {
  const videos = await loadVideos();
  if (videos.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-ink-900">Video y khoa</h3>
        <Link href="/video"
          className="text-xs font-medium text-accent-700 hover:text-accent-800 transition-colors">
          Xem tất cả →
        </Link>
      </div>
      <div className="space-y-2">
        {videos.map((v) => (
          <Link key={v.id} href={v.url ?? '/video'} target={v.url ? '_blank' : undefined} rel={v.url ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 p-2.5 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <div className="relative w-12 h-12 bg-ink-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Play className="w-4 h-4 text-ink-400 group-hover:text-accent-600 transition-colors" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-900 line-clamp-2 leading-snug group-hover:text-accent-700 transition-colors">{v.title}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-ink-500 mt-0.5">
                <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                {fmt(v.duration)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
