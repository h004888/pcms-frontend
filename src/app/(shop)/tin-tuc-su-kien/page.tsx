// =====================================================
// PAGE-NEWS — /tin-tuc-su-kien (real API)
// /api/v1/health-articles (customer-portal-service)
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Calendar, ArrowRight, Tag, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/Feedback';
import { fetchArticles } from '@/features/articles';
import type { Article } from '@/features/articles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức sự kiện',
  description: 'Tin tức, sự kiện, hợp tác chiến lược và PR mới nhất từ FPT Long Châu.',
};

async function loadNews(): Promise<Article[]> {
  try {
    const res = await fetchArticles();
    return res.articles;
  } catch {
    return [];
  }
}

export default async function TinTucSuKienPage() {
  const articles = await loadNews();

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tin tức sự kiện' }]} />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Tin tức & sự kiện
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tin tức, sự kiện, hợp tác chiến lược và PR mới nhất từ FPT Long Châu.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {articles.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Chưa có tin tức"
            description="Hệ thống chưa có bài viết nào."
          />
        ) : (
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/bai-viet/${article.slug ?? article.id}`}
                  className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-ink-500 font-mono mb-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {new Date(article.publishedAt ?? article.createdAt ?? Date.now()).toLocaleDateString('vi-VN')}
                    {article.category && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" aria-hidden="true" />
                          {article.category}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-base font-semibold text-ink-900 text-balance">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-1 text-sm text-ink-600 line-clamp-2 text-pretty">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-accent-700 font-medium">
                    Đọc tiếp
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}