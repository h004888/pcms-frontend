// =====================================================
// /tra-cuu-duoc-lieu/[slug] — SHOP-LOOKUP-HERB detail
// SPRINT 2 - T09: Đổi từ mock HERBS sang live API
//                   /shop/lookup/herb?q=<slug>. Fail-loud.
// Backend trả PageResponse<Map<String,Object>> — render best-effort.
// =====================================================

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getHerbBySlug } from '@/features/herbs';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { Leaf, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const herb = await getHerbBySlug((await params).slug);
    return {
      title: `${(herb.name as string) ?? (await params).slug} — Dược liệu`,
      description: (herb.description as string)?.slice(0, 160),
    };
  } catch {
    return { title: 'Không tìm thấy' };
  }
}

export default async function TraCuuDuocLieuDetailPage({ params }: PageProps) {
  let herb;
  try {
    herb = await getHerbBySlug((await params).slug);
  } catch {
    notFound();
  }

  return (
    <>
      <LookupNav active="tra-cuu-duoc-lieu" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tra cứu dược liệu', href: '/tra-cuu-duoc-lieu' },
              { label: (herb.name as string) ?? (await params).slug },
            ]}
          />

          <div className="mt-3 flex items-start gap-3">
            <Leaf className="w-8 h-8 text-success-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
                {(herb.name as string) ?? (await params).slug}
              </h1>
              {typeof herb.scientificName === 'string' && (
                <p className="mt-1 text-sm italic text-ink-500">{herb.scientificName}</p>
              )}
              {typeof herb.family === 'string' && (
                <p className="mt-1 text-sm text-ink-600">{herb.family}</p>
              )}
              {typeof herb.category === 'string' && (
                <div className="mt-3">
                  <Badge variant="success">{herb.category}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {typeof herb.description === 'string' && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả</h2>
            <p className="text-sm text-ink-700 text-pretty">{herb.description}</p>
          </section>
        )}

        {Array.isArray(herb.traditionalUses) && herb.traditionalUses.length > 0 && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-3">Công dụng truyền thống</h2>
            <ul className="space-y-1.5">
              {herb.traditionalUses.map((u: unknown, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="text-success-600 flex-shrink-0" aria-hidden="true">•</span>
                  <span>{String(u)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {typeof herb.preparation === 'string' && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Cách dùng / Bào chế</h2>
            <p className="text-sm text-ink-700 text-pretty">{herb.preparation}</p>
          </section>
        )}

        {typeof herb.cautions === 'string' && (
          <section className="p-5 bg-warning-50 border border-warning-200 rounded-md">
            <h2 className="text-base font-semibold text-warning-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Lưu ý
            </h2>
            <p className="text-sm text-warning-900 text-pretty">{herb.cautions}</p>
          </section>
        )}
      </div>
    </>
  );
}