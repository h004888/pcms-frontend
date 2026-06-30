// =====================================================
// /tra-cuu-duoc-chat/[slug] — SHOP-LOOKUP-INGREDIENT detail
// SPRINT 2 - T08: Đổi từ mock INGREDIENTS sang live API
//                   /shop/lookup/ingredient?q=<slug>. Fail-loud.
// Backend trả PageResponse<Map<String,Object>> — render best-effort
// theo các field generic có sẵn.
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getIngredientBySlug } from '@/features/ingredients';
import { PRODUCTS } from '@/data/shop/catalog';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { getProductHref, formatVND } from '@/lib/shop/format';
import { Beaker, AlertTriangle, Pill } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug: metaSlug } = await params;
    const ing = await getIngredientBySlug(metaSlug);
    return {
      title: `${(ing.name as string) ?? metaSlug} — Hoạt chất`,
      description: (ing.description as string)?.slice(0, 160),
    };
  } catch {
    return { title: 'Không tìm thấy' };
  }
}

export default async function TraCuuDuocChatDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let ing;
  try {
    ing = await getIngredientBySlug(slug);
  } catch {
    notFound();
  }

  // Related products: liệt kê các sản phẩm có chứa slug này (mock fallback cho đến khi BE trả liên kết).
  const relatedProducts = PRODUCTS.filter((p) =>
    (p.tags ?? []).includes(slug)
  );

  return (
    <>
      <LookupNav active="tra-cuu-duoc-chat" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tra cứu hoạt chất', href: '/tra-cuu-duoc-chat' },
              { label: (ing.name as string) ?? (await params).slug },
            ]}
          />

          <div className="mt-3 flex items-start gap-3">
            <Beaker className="w-8 h-8 text-accent-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
                {(ing.name as string) ?? (await params).slug}
              </h1>
              {typeof ing.latinName === 'string' && (
                <p className="mt-1 text-sm italic text-ink-500">{ing.latinName}</p>
              )}
              {typeof ing.formula === 'string' && (
                <p className="mt-1 text-sm text-ink-600 font-mono">{ing.formula}</p>
              )}
              {typeof ing.category === 'string' && (
                <div className="mt-3">
                  <Badge variant="info">{ing.category}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {typeof ing.description === 'string' && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả</h2>
            <p className="text-sm text-ink-700 text-pretty">{ing.description}</p>
          </section>
        )}

        {typeof ing.mechanism === 'string' && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Cơ chế tác dụng</h2>
            <p className="text-sm text-ink-700 text-pretty">{ing.mechanism}</p>
          </section>
        )}

        {Array.isArray(ing.indications) && ing.indications.length > 0 && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-3">Chỉ định</h2>
            <ul className="space-y-1.5">
              {ing.indications.map((ind: unknown, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="text-accent-600 flex-shrink-0" aria-hidden="true">•</span>
                  <span>{String(ind)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {typeof ing.dosage === 'string' && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Liều dùng tham khảo</h2>
            <p className="text-sm text-ink-700 text-pretty">{ing.dosage}</p>
            <p className="mt-2 text-xs text-ink-500">
              Liều trên chỉ mang tính tham khảo. Tuân theo chỉ định của bác sĩ/dược sĩ.
            </p>
          </section>
        )}

        {typeof ing.sideEffects === 'string' && (
          <section className="p-5 bg-warning-50 border border-warning-200 rounded-md">
            <h2 className="text-base font-semibold text-warning-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Tác dụng phụ
            </h2>
            <p className="text-sm text-warning-900 text-pretty">{ing.sideEffects}</p>
          </section>
        )}

        {typeof ing.contraindications === 'string' && (
          <section className="p-5 bg-danger-50 border border-danger-200 rounded-md">
            <h2 className="text-base font-semibold text-danger-900 mb-2">
              Chống chỉ định
            </h2>
            <p className="text-sm text-danger-900 text-pretty">{ing.contraindications}</p>
          </section>
        )}

        {Array.isArray(ing.interactions) && ing.interactions.length > 0 && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-3">Tương tác thuốc</h2>
            <ul className="space-y-1.5">
              {ing.interactions.map((inter: unknown, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="text-danger-600 flex-shrink-0" aria-hidden="true">⚠</span>
                  <span>{String(inter)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-3">
              Sản phẩm chứa hoạt chất này
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
                      <p className="text-sm font-semibold text-ink-900 truncate">{p.name}</p>
                      <p className="text-xs text-accent-700 font-mono">{formatVND(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}