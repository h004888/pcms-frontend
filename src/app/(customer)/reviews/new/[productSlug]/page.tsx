// =====================================================
// /reviews/new/[productSlug] — SHOP-REVIEW create
// Viết đánh giá mới
// =====================================================

import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PRODUCTS } from '@/data/shop/catalog';
import { Star, Save, Camera } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: { productSlug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const p = PRODUCTS.find((x) => x.slug === params.productSlug);
  return {
    title: p ? `Đánh giá ${p.name}` : 'Đánh giá sản phẩm',
    description: 'Viết đánh giá sản phẩm sau khi mua.',
  };
}

export default function NewReviewPage({ params }: PageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.productSlug);
  if (!product) notFound();

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Đánh giá', href: '/reviews' }, { label: 'Mới' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Viết đánh giá</h1>
        </div>
      </div>

      <form className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <p className="text-sm font-semibold text-ink-900">{product.name}</p>
          <p className="text-xs text-ink-500 font-mono">{product.brand} · {product.country}</p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink-900 mb-2">
            Đánh giá của bạn
          </legend>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} sao`}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={
                    star <= 5
                      ? 'w-8 h-8 text-warning-500 fill-warning-500'
                      : 'w-8 h-8 text-ink-200'
                  }
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="title" className="text-sm font-semibold text-ink-900">
            Tiêu đề ngắn
          </label>
          <input
            id="title"
            type="text"
            placeholder="VD: Hạ sốt nhanh, dễ uống"
            className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
        </div>

        <div>
          <label htmlFor="body" className="text-sm font-semibold text-ink-900">
            Chi tiết đánh giá
          </label>
          <textarea
            id="body"
            rows={5}
            placeholder="Chia sẻ trải nghiệm của bạn: hiệu quả, cách dùng, lưu ý..."
            className="mt-1 w-full px-3 py-2 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink-900">Ảnh đính kèm (tuỳ chọn)</label>
          <div className="mt-2 p-6 border-2 border-dashed border-ink-300 rounded-md text-center hover:border-accent-500 cursor-pointer">
            <Camera className="w-8 h-8 mx-auto text-ink-400" aria-hidden="true" />
            <p className="mt-2 text-sm text-ink-600">Click để chọn ảnh (tối đa 5)</p>
            <p className="mt-1 text-xs text-ink-500">JPG, PNG, tối đa 5 MB mỗi ảnh</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          Gửi đánh giá
        </button>
      </form>
    </>
  );
}