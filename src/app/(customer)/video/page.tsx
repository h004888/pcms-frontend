// =====================================================
// /video — VIDEO library (real API)
// /api/v1/admin/videos (customer-portal-service)
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { EmptyState } from '@/components/ui/Feedback';
import { Play, Clock, Video as VideoIcon } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video y khoa',
  description: 'Video hướng dẫn sức khỏe từ WHO, Bộ Y tế và PCMS.',
};

interface VideoLite {
  id: string;
  title: string;
  url?: string;
  thumbnailUrl?: string;
  duration: number;
  category?: string;
  source?: string;
}

async function loadVideos(): Promise<VideoLite[]> {
  try {
    const res = await apiClient.get<VideoLite[] | { videos: VideoLite[] }>(
      API_ENDPOINTS.VIDEOS
    );
    const body = res.data;
    if (Array.isArray(body)) return body;
    return body?.videos ?? [];
  } catch {
    return [];
  }
}

export default async function VideoPage() {
  const videos = await loadVideos();

  return (
    <>
      <LookupNav active="video" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Video y khoa' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Video y khoa
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Hướng dẫn sức khỏe từ WHO, Bộ Y tế và PCMS
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {videos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title="Chưa có video nào"
            description="Hệ thống chưa có video y khoa nào."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={v.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="aspect-video bg-ink-100 rounded-md flex items-center justify-center mb-2 relative overflow-hidden">
                  {v.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Play
                      className="w-12 h-12 text-ink-400"
                      aria-hidden="true"
                    />
                  )}
                  <span className="absolute bottom-2 right-2 px-2 h-6 inline-flex items-center bg-black/70 text-white text-xs font-mono rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {Math.floor((v.duration ?? 0) / 60)}:
                    {String((v.duration ?? 0) % 60).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-ink-900 line-clamp-2">
                  {v.title}
                </h3>
                {v.source && (
                  <p className="text-xs text-ink-500 mt-1">{v.source}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}