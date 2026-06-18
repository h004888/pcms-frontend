// =====================================================
// /tra-cuu-duoc-lieu/[slug] — SHOP-LOOKUP-HERB detail
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getHerbBySlug,
  HERBS,
} from '@/data/shop/herbs';
import {
  INGREDIENTS,
  getIngredientBySlug,
} from '@/data/shop/ingredients';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { Leaf, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return HERBS.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const herb = getHerbBySlug(params.slug);
  if (!herb) return { title: 'Không tìm thấy' };
  return {
    title: `${herb.name} — Dược liệu`,
    description: herb.description,
  };
}

export default function TraCuuDuocLieuDetailPage({ params }: PageProps) {
  const herb = getHerbBySlug(params.slug);
  if (!herb) notFound();

  const relatedIngredients = INGREDIENTS.filter((i) =>
    herb.relatedIngredientSlugs.includes(i.slug)
  );

  return (
    <>
      <LookupNav active="tra-cuu-duoc-lieu" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tra cứu dược liệu', href: '/tra-cuu-duoc-lieu' },
              { label: herb.name },
            ]}
          />

          <div className="mt-3 flex items-start gap-3">
            <Leaf className="w-8 h-8 text-success-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
                {herb.name}
              </h1>
              <p className="mt-1 text-sm italic text-ink-500">{herb.latinName}</p>
              <p className="mt-1 text-sm text-ink-600">
                Bộ phận dùng:{' '}
                <span className="text-ink-900 font-medium">{herb.parts.join(', ')}</span>
              </p>
              <div className="mt-3">
                <Badge variant="default">{herb.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả</h2>
          <p className="text-sm text-ink-700 text-pretty">{herb.description}</p>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Công dụng theo Y học cổ truyền
          </h2>
          <ul className="space-y-1.5">
            {herb.traditionalUses.map((use, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="text-success-600 flex-shrink-0" aria-hidden="true">•</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Hoạt chất chính</h2>
          <ul className="space-y-1.5">
            {herb.activeCompounds.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                <span className="text-accent-600 flex-shrink-0 font-mono" aria-hidden="true">
                  ◆
                </span>
                <span className="font-mono">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Cách bào chế</h2>
          <p className="text-sm text-ink-700 text-pretty">{herb.preparation}</p>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Liều dùng</h2>
          <p className="text-sm text-ink-700 text-pretty">{herb.dosage}</p>
        </section>

        {herb.warnings && (
          <section className="p-5 bg-warning-50 border border-warning-200 rounded-md">
            <h2 className="text-base font-semibold text-warning-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Cảnh báo
            </h2>
            <p className="text-sm text-warning-900 text-pretty">{herb.warnings}</p>
          </section>
        )}

        {relatedIngredients.length > 0 && (
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-3">
              Hoạt chất liên quan
            </h2>
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
            href="/tra-cuu-duoc-lieu"
            className="text-accent-700 hover:underline"
          >
            ← Quay lại danh sách dược liệu
          </Link>
        </div>
      </div>
    </>
  );
}