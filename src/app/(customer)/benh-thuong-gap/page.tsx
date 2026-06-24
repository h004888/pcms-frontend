// =====================================================
// /benh-thuong-gap — DISEASE-INFO list (real API)
// /api/v1/diseases (customer-portal-service returns Page wrapper)
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { EmptyState } from '@/components/ui/Feedback';
import { Stethoscope } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bệnh thường gặp',
  description: 'Thông tin các bệnh thường gặp: triệu chứng, nguyên nhân, điều trị.',
};

interface DiseaseLite {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  summary?: string;
}

interface DiseasePageResponse {
  data?: DiseaseLite[];
  total?: number;
}

async function loadDiseases(): Promise<DiseaseLite[]> {
  try {
    const res = await apiClient.get<DiseasePageResponse>(
      API_ENDPOINTS.DISEASES
    );
    return res.data?.data ?? [];
  } catch {
    return [];
  }
}

export default async function BenhThuongGapPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams.cat;
  const all = await loadDiseases();
  const list = cat ? all.filter((d) => d.category === cat) : all;

  const categories = Array.from(
    new Set(all.map((d) => d.category).filter(Boolean))
  );

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
              href={`/benh-thuong-gap?cat=${c}`}
              className={`px-3 h-8 inline-flex items-center text-xs font-medium rounded-full transition-colors capitalize ${
                cat === c
                  ? 'bg-accent-600 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="Chưa có thông tin bệnh"
            description="Hệ thống chưa có thông tin bệnh nào."
          />
        ) : (
          <ul className="divide-y divide-ink-100 bg-white border border-ink-200 rounded-md">
            {list.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/benh-thuong-gap/${d.slug ?? d.id}`}
                  className="flex items-start gap-3 p-4 hover:bg-ink-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-info-50 text-info-700 rounded-md flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{d.name}</p>
                    {d.category && (
                      <p className="mt-0.5 text-xs text-ink-500 capitalize">
                        {d.category}
                      </p>
                    )}
                    {d.summary && (
                      <p className="mt-1 text-xs text-ink-600 line-clamp-2 text-pretty">
                        {d.summary}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}