// =====================================================
// /video — VIDEO library
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { EmptyState } from '@/components/ui/Feedback';
import { VIDEOS } from '@/data/shop/videos';
import { Play, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video y khoa',
  description: 'Video hướng dẫn sức khỏe từ WHO, Bộ Y tế và PCMS.',
};

export default function VideoPage({
  searchParams,
}: {
  searchParams: { cat?: string; src?: string };
}) {
  let list = VIDEOS;
  if (searchParams.cat) {
    list = list.filter((v) => v.category === searchParams.cat);
  }
  if (searchParams.src) {
    list = list.filter((v) => v.source === searchParams.src);
  }

  const categories = ['phòng bệnh', 'điều trị', 'dinh dưỡng', 'tâm lý'] as const;
  const sources = ['WHO', 'Bộ Y tế', 'PCMS'] as const;

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

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/video"
              className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full transition-colors ${
                !searchParams.cat ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              Tất cả
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/video?cat=${encodeURIComponent(c)}`}
                className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full capitalize transition-colors ${
                  searchParams.cat === c ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {sources.map((s) => (
              <Link
                key={s}
                href={`/video?src=${encodeURIComponent(s)}`}
                className={`px-3 h-7 inline-flex items-center text-[10px] font-medium rounded uppercase tracking-wider transition-colors ${
                  searchParams.src === s
                    ? 'bg-info-600 text-white'
                    : 'bg-info-50 text-info-700 hover:bg-info-100'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={Play}
            title="Chưa có video"
            description="Chọn bộ lọc khác hoặc quay lại sau."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((v) => (
              <Link
                key={v.id}
                href={v.url}
                className="group block bg-white border border-ink-200 rounded-md overflow-hidden hover:border-accent-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className="relative aspect-video bg-ink-100">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                    <Play className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 h-5 bg-black/70 text-white text-[10px] font-medium rounded font-mono">
                    <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                    {v.duration}
                  </div>
                  <div className="absolute top-2 left-2 px-2 h-5 bg-white/90 text-ink-900 text-[10px] font-bold uppercase rounded">
                    {v.source}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ink-900 line-clamp-2 group-hover:text-accent-700 text-balance">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-500 capitalize">{v.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}