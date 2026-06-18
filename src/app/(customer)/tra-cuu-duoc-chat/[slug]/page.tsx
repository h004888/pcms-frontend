// =====================================================
// /tra-cuu-duoc-chat/[slug] — SHOP-LOOKUP-INGREDIENT detail
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getIngredientBySlug,
  INGREDIENTS,
} from '@/data/shop/ingredients';
import { PRODUCTS } from '@/data/shop/catalog';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { getProductHref, formatVND } from '@/lib/shop/format';
import { Beaker, AlertTriangle, FileText, Pill } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return INGREDIENTS.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const ing = getIngredientBySlug(params.slug);
  if (!ing) return { title: 'Không tìm thấy' };
  return {
    title: `${ing.name} — Hoạt chất`,
    description: ing.description,
  };
}

export default function TraCuuDuocChatDetailPage({ params }: PageProps) {
  const ing = getIngredientBySlug(params.slug);
  if (!ing) notFound();

  const relatedProducts = PRODUCTS.filter((p) =>
    ing.relatedProducts.includes(p.id)
  );
  const relatedIngredients = INGREDIENTS.filter((i) =>
    ing.relatedIngredientSlugs.includes(i.slug)
  );

  return (
    <>
      <LookupNav active="tra-cuu-duoc-chat" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tra cứu hoạt chất', href: '/tra-cuu-duoc-chat' },
              { label: ing.name },
            ]}
          />

          <div className="mt-3 flex items-start gap-3">
            <Beaker className="w-8 h-8 text-accent-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
                {ing.name}
              </h1>
              {ing.latinName && (
                <p className="mt-1 text-sm italic text-ink-500">{ing.latinName}</p>
              )}
              {ing.formula && (
                <p className="mt-1 text-sm text-ink-600 font-mono">{ing.formula}</p>
              )}
              <div className="mt-3">
                <Badge variant="info">{ing.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả</h2>
          <p className="text-sm text-ink-700 text-pretty">{ing.description}</p>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Cơ chế tác dụng</h2>
          <p className="text-sm text-ink-700 text-pretty">{ing.mechanism}</p>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Chỉ định</h2>
          <ul className="space-y-1.5">
            {ing.indications.map((ind, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="text-accent-600 flex-shrink-0" aria-hidden="true">•</span>
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Liều dùng tham khảo</h2>
          <p className="text-sm text-ink-700 text-pretty">{ing.dosage}</p>
          <p className="mt-2 text-xs text-ink-500">
            Liều trên chỉ mang tính tham khảo. Tuân theo chỉ định của bác sĩ/dược sĩ.
          </p>
        </section>

        {ing.sideEffects && (
          <section className="p-5 bg-warning-50 border border-warning-200 rounded-md">
            <h2 className="text-base font-semibold text-warning-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Tác dụng phụ
            </h2>
            <p className="text-sm text-warning-900 text-pretty">{ing.sideEffects}</p>
          </section>
        )}

        {ing.contraindications && (
          <section className="p-5 bg-danger-50 border border-danger-200 rounded-md">
            <h2 className="text-base font-semibold text-danger-900 mb-2">
              Chống chỉ định
            </h2>
            <p className="text-sm text-danger-900 text-pretty">{ing.contraindications}</p>
          </section>
        )}

        {ing.interactions.length > 0 && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-3">Tương tác thuốc</h2>
            <ul className="space-y-1.5">
              {ing.interactions.map((inter, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-ink-700"
                >
                  <span className="text-danger-600 flex-shrink-0" aria-hidden="true">⚠</span>
                  <span>{inter}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-3">
              Sản phẩm chứa {ing.name}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={getProductHref(p)}
                    className="flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
                  >
                    <Pill className="w-5 h-5 text-ink-400 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-xs text-ink-500">{p.brand}</p>
                    </div>
                    <p className="text-sm font-semibold text-accent-700 font-mono">
                      {formatVND(p.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedIngredients.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-3">Hoạt chất liên quan</h2>
            <ul className="flex flex-wrap gap-2">
              {relatedIngredients.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/tra-cuu-duoc-chat/${i.slug}`}
                    className="inline-flex items-center px-3 h-8 text-xs font-medium bg-ink-100 text-ink-700 rounded-full hover:bg-accent-50 hover:text-accent-700 transition-colors"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex justify-between text-sm">
          <Link
            href="/tra-cuu-duoc-chat"
            className="text-accent-700 hover:underline"
          >
            ← Quay lại danh sách hoạt chất
          </Link>
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-accent-700 hover:underline"
          >
            <FileText className="w-4 h-4" aria-hidden="true" /> Đọc bài viết sức khỏe
          </Link>
        </div>
      </div>
    </>
  );
}