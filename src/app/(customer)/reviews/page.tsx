// =====================================================
// /reviews — Customer reviews list (SPRINT 3 - T11)
// Đổi từ mock MOCK_REVIEWS sang live API /reviews/me.
// Fail-loud (không fallback).
// =====================================================

import Link from 'next/link';
import { cookies } from 'next/headers';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Star, Edit2 } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { getMyReviews, type Review } from '@/features/reviews';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đánh giá của tôi',
  description: 'Đánh giá sản phẩm bạn đã mua.',
};

// Force dynamic - we read cookies (auth token)
export const dynamic = 'force-dynamic';

export default async function MyReviewsPage() {
  const token = (await cookies()).get('pcms_access_token')?.value;

  let reviews: Review[] = [];
  if (token) {
    try {
      reviews = await getMyReviews(token);
    } catch {
      // Treat auth failure as empty list — show EmptyState
      reviews = [];
    }
  }

  if (reviews.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Đánh giá của tôi' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Đánh giá của tôi</h1>
        <EmptyState
          icon={Star}
          title={token ? 'Chưa có đánh giá' : 'Vui lòng đăng nhập'}
          description={
            token
              ? 'Đánh giá sau khi mua hàng để nhận điểm thưởng và giúp người khác.'
              : 'Đăng nhập để xem đánh giá của bạn.'
          }
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Đánh giá của tôi' }]} />
      <h1 className="mt-3 text-xl font-bold text-ink-900 mb-4">Đánh giá của tôi</h1>

      <div className="space-y-3">
        {reviews.map((rev) => {
          // Review.medicineId là UUID; PRODUCTS mock có id khác — best-effort link.
          const product = PRODUCTS.find((p) => p.id === rev.medicineId || p.sku === rev.medicineId);
          return (
            <article
              key={rev.id}
              className="p-4 bg-white border border-ink-200 rounded-md"
            >
              {product && (
                <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-ink-100">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500 font-mono">
                      {formatVND(product.price)} / {product.unit}
                    </p>
                  </div>
                  <Link
                    href={`/reviews/new/${product.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-accent-700 hover:underline"
                  >
                    <Edit2 className="w-3 h-3" aria-hidden="true" />
                    Sửa
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < rev.rating
                        ? 'w-4 h-4 text-warning-500 fill-warning-500'
                        : 'w-4 h-4 text-ink-200'
                    }
                    aria-hidden="true"
                  />
                ))}
                <span className="text-xs text-ink-500 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {rev.comment && (
                <p className="mt-1 text-sm text-ink-700 text-pretty">{rev.comment}</p>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}