// =====================================================
// /reviews — SHOP-REVIEW list
// Đánh giá của tôi
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Star, ThumbsUp, Edit2 } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đánh giá của tôi',
  description: 'Đánh giá sản phẩm bạn đã mua.',
};

const MOCK_REVIEWS = [
  {
    id: 'rev-mine-1',
    productId: 'prod-1',
    rating: 5,
    title: 'Hạ sốt nhanh',
    body: 'Dùng cho cả gia đình, hiệu quả rõ rệt trong 30 phút.',
    helpfulCount: 12,
    createdAt: '2026-05-12',
    verified: true,
  },
  {
    id: 'rev-mine-2',
    productId: 'prod-3',
    rating: 4,
    title: 'Vitamin C dạng sủi dễ uống',
    body: 'Con mình thích vị cam, không bị đắng như viên nén.',
    helpfulCount: 5,
    createdAt: '2026-04-22',
    verified: true,
  },
];

export default function MyReviewsPage() {
  if (MOCK_REVIEWS.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Đánh giá của tôi' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Đánh giá của tôi</h1>
        <EmptyState
          icon={Star}
          title="Chưa có đánh giá"
          description="Đánh giá sau khi mua hàng để nhận điểm thưởng và giúp người khác."
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Đánh giá của tôi' }]} />
      <h1 className="mt-3 text-xl font-bold text-ink-900 mb-4">Đánh giá của tôi</h1>

      <div className="space-y-3">
        {MOCK_REVIEWS.map((rev) => {
          const product = PRODUCTS.find((p) => p.id === rev.productId);
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
                {rev.verified && (
                  <span className="px-1.5 h-5 bg-success-100 text-success-700 text-[10px] font-semibold rounded">
                    Đã mua
                  </span>
                )}
                <span className="text-xs text-ink-500 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {rev.title && <h3 className="text-sm font-semibold text-ink-900">{rev.title}</h3>}
              <p className="mt-1 text-sm text-ink-700 text-pretty">{rev.body}</p>
              <p className="mt-2 text-xs text-ink-500 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" aria-hidden="true" />
                {rev.helpfulCount} người thấy hữu ích
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}