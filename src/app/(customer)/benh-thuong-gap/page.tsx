// =====================================================
// /benh-thuong-gap — DISEASE-INFO list
// Tra cứu thông tin bệnh thường gặp
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { EmptyState } from '@/components/ui/Feedback';
import { DISEASES, type DiseaseCategory } from '@/data/shop/diseases';
import { Stethoscope } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bệnh thường gặp',
  description: 'Thông tin các bệnh thường gặp: triệu chứng, nguyên nhân, điều trị.',
};

export default function BenhThuongGapPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams.cat as DiseaseCategory | undefined;
  let list = DISEASES;
  if (cat) list = list.filter((d) => d.category === cat);

  const categories: DiseaseCategory[] = [
    'hô hấp',
    'tiêu hóa',
    'tim mạch',
    'nội tiết',
    'thần kinh',
    'cơ xương khớp',
    'da liễu',
    'nhi khoa',
  ];

  return (
    <>
      <LookupNav active="benh-thuong-gap" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Bệnh thường gặp' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Bệnh thường gặp
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Thông tin y khoa về các bệnh phổ biến — tham khảo, không thay thế bác sĩ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/benh-thuong-gap"
            className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full transition-colors ${
              !cat ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            }`}
          >
            Tất cả
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/benh-thuong-gap?cat=${encodeURIComponent(c)}`}
              className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full capitalize transition-colors ${
                cat === c ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="Chưa có thông tin"
            description="Chọn danh mục khác hoặc quay lại sau."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {list.map((d) => (
              <Link
                key={d.slug}
                href={`/benh-thuong-gap/${d.slug}`}
                className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 h-5 inline-flex items-center bg-info-50 text-info-700 text-[10px] font-semibold rounded uppercase">
                    {d.category}
                  </span>
                  {d.icd10 && (
                    <span className="font-mono text-[10px] text-ink-500">
                      ICD-10: {d.icd10}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-ink-900 text-balance">
                  {d.name}
                </h3>
                <p className="mt-1 text-sm text-ink-600 line-clamp-2 text-pretty">
                  {d.summary}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}