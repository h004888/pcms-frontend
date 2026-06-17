// =====================================================
// /benh-thuong-gap/[slug] — DISEASE-INFO detail
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { DISEASES } from '@/data/shop/diseases';
import { AlertTriangle, ArrowLeft, Pill, Activity } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return DISEASES.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const d = DISEASES.find((x) => x.slug === params.slug);
  if (!d) return { title: 'Không tìm thấy' };
  return { title: `${d.name} — Bệnh thường gặp`, description: d.summary };
}

export default function BenhDetailPage({ params }: PageProps) {
  const d = DISEASES.find((x) => x.slug === params.slug);
  if (!d) notFound();

  return (
    <>
      <LookupNav active="benh-thuong-gap" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Bệnh thường gặp', href: '/benh-thuong-gap' },
              { label: d.name },
            ]}
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="px-2 h-5 inline-flex items-center bg-info-50 text-info-700 text-[10px] font-semibold rounded uppercase">
              {d.category}
            </span>
            {d.icd10 && (
              <span className="font-mono text-[10px] text-ink-500">
                ICD-10: {d.icd10}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {d.name}
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">{d.summary}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Section title="Triệu chứng" icon={Activity}>
          <ul className="list-disc pl-5 space-y-1">
            {d.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section title="Nguyên nhân" icon={Activity}>
          <ul className="list-disc pl-5 space-y-1">
            {d.causes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>

        <Section title="Điều trị" icon={Pill}>
          <p>{d.treatment}</p>
        </Section>

        <Section title="Phòng ngừa" icon={Activity}>
          <p>{d.prevention}</p>
        </Section>

        {d.whenToSeeDoctor && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-warning-900">Khi nào cần đi khám bác sĩ?</h3>
                <p className="mt-1 text-sm text-warning-800">{d.whenToSeeDoctor}</p>
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

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-2">
        <Icon className="w-4 h-4 text-accent-600" aria-hidden="true" />
        {title}
      </h2>
      <div className="text-sm text-ink-700 leading-relaxed">{children}</div>
    </section>
  );
}