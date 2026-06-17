// =====================================================
// /bai-viet/[slug] — HEALTH-ARTICLE detail
// =====================================================

import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { ARTICLES } from '@/data/shop/articles';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Không tìm thấy' };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default function BaiVietDetailPage({ params }: PageProps) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  return (
    <>
      <LookupNav active="bai-viet" />

      <article className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Bài viết', href: '/bai-viet' },
              { label: article.title },
            ]}
          />
          <span className="mt-3 inline-block px-2 h-5 bg-accent-50 text-accent-700 text-[10px] font-semibold rounded uppercase">
            {article.category}
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {article.title}
          </h1>
          <p className="mt-3 text-base text-ink-600 text-pretty">
            {article.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-500">
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
              {article.readingMinutes} phút đọc
            </span>
          </div>
        </div>
      </article>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-sm max-w-none text-ink-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-ink-200">
            <h3 className="text-sm font-semibold text-ink-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 h-6 inline-flex items-center bg-ink-100 text-ink-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-ink-200">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1 text-sm text-accent-700 hover:text-accent-800"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    </>
  );
}