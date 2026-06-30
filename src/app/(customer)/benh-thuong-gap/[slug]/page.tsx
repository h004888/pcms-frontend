// =====================================================
// /benh-thuong-gap/[slug] — DISEASE-INFO detail
// SPRINT 1 - T07: Đổi từ mock DISEASES sang live API
//                   /diseases/{slug}. Fail-loud (không fallback).
//
// Backend DiseaseInfoResponse shape (id, name, slug, targetAudience,
// season, severity, body, viewCount). Page render dựa trên body
// markdown + metadata.
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { getDiseaseBySlug } from '@/features/health-tools';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const d = await getDiseaseBySlug((await params).slug);
    return { title: `${d.name} — Bệnh thường gặp`, description: d.body?.slice(0, 160) };
  } catch {
    return { title: 'Không tìm thấy' };
  }
}

export default async function BenhDetailPage({ params }: PageProps) {
  let disease;
  try {
    disease = await getDiseaseBySlug((await params).slug);
  } catch {
    notFound();
  }

  return (
    <>
      <LookupNav active="benh-thuong-gap" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Bệnh thường gặp', href: '/benh-thuong-gap' },
              { label: disease.name },
            ]}
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {disease.targetAudience && (
              <span className="px-2 h-5 inline-flex items-center bg-info-50 text-info-700 text-[10px] font-semibold rounded uppercase">
                {disease.targetAudience}
              </span>
            )}
            {disease.season && (
              <span className="px-2 h-5 inline-flex items-center bg-accent-50 text-accent-700 text-[10px] font-semibold rounded uppercase">
                {disease.season}
              </span>
            )}
            {disease.severity && (
              <span className="font-mono text-[10px] text-ink-500">
                Severity: {disease.severity}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {disease.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {disease.body ? (
          <article
            className="prose prose-ink max-w-none text-sm text-ink-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: disease.body }}
          />
        ) : (
          <p className="text-sm text-ink-500 italic">
            Chưa có mô tả cho bệnh này.
          </p>
        )}

        {disease.severity === 'HIGH' && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-warning-900">Cảnh báo mức độ nghiêm trọng cao</h3>
                <p className="mt-1 text-sm text-warning-800">
                  Bệnh được đánh giá mức HIGH — vui lòng liên hệ bác sĩ để được tư vấn.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-ink-200">
          <Link
            href="/benh-thuong-gap"
            className="inline-flex items-center gap-1 text-sm text-accent-700 hover:text-accent-800"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Quay lại danh sách
          </Link>
        </div>

        <p className="text-xs text-ink-500 text-center">
          ⚠ Thông tin tham khảo, không thay thế tư vấn y khoa. Vui lòng gặp bác sĩ để được chẩn đoán chính xác.
        </p>
      </div>
    </>
  );
}