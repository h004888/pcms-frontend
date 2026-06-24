// =====================================================
// /bai-viet — HEALTH-ARTICLE list
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { EmptyState } from '@/components/ui/Feedback';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';
import { fetchArticles } from '@/features/articles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bài viết sức khỏe',
  description: 'Bài viết về sức khỏe, dinh dưỡng, phòng bệnh từ dược sĩ PCMS.',
};

const CATEGORIES = [
  'sức khỏe tổng quát',
  'dinh dưỡng',
  'thai kỳ & trẻ em',
  'bệnh mạn tính',
  'phòng bệnh',
  'mẹo vặt',
];

export default async function BaiVietPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams.cat;
  let articles: Awaited<ReturnType<typeof fetchArticles>>['articles'] = [];
  try {
    const res = await fetchArticles(cat ? { cat } : undefined);
    articles = res.articles;
  } catch {
    articles = [];
  }

  return (
    <>
      <LookupNav active="bai-viet" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Bài viết sức khỏe' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Bài viết sức khỏe
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Cập nhật kiến thức y khoa từ đội ngũ dược sĩ PCMS
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/bai-viet"
            className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full transition-colors ${
              !cat
                ? 'bg-accent-600 text-white'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            }`}
          >
            Tất cả
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/bai-viet?cat=${encodeURIComponent(c)}`}
              className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full capitalize transition-colors ${
                cat === c
                  ? 'bg-accent-600 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Chưa có bài viết"
            description="Chọn danh mục khác hoặc quay lại sau."
          />
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/bai-viet/${article.slug}`}
                className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="px-2 h-5 inline-flex items-center bg-accent-50 text-accent-700 text-[10px] font-semibold rounded uppercase">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-ink-900 text-balance line-clamp-2 group-hover:text-accent-700">
                  {article.title}
                </h3>
                <p className="mt-1 text-sm text-ink-600 line-clamp-2 text-pretty">
                  {article.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {article.readingMinutes} phút
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
