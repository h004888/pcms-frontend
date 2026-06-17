// =====================================================
// /ai/semantic-search — AI-SEMANTIC-SEARCH
// Tìm kiếm ngữ nghĩa: mô tả triệu chứng, tìm thuốc
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Sparkles, ArrowRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/shop/catalog';
import { stripToSummary } from '@/data/shop/_strip-to-summary';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm kiếm ngữ nghĩa',
  description: 'Mô tả triệu chứng, AI đề xuất thuốc phù hợp.',
};

// Mock semantic mapping
const SYMPTOM_TO_DRUGS: Array<{ symptom: string; drugSlugs: string[] }> = [
  { symptom: 'đau đầu, sốt nhẹ', drugSlugs: ['paracetamol-500-mg-20', 'ibuprofen-400mg'] },
  { symptom: 'viêm họng, ho', drugSlugs: ['paracetamol-500-mg-20', 'cetirizine-10mg'] },
  { symptom: 'dị ứng, mề đay', drugSlugs: ['cetirizine-10mg'] },
  { symptom: 'mệt mỏi, thiếu vitamin', drugSlugs: ['vitamin-c-1000-mg-30', 'omega-3-1000-mg-60'] },
];

export default function SemanticSearchPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-info-50 to-accent-50 border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Tìm kiếm ngữ nghĩa' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-accent-600 text-white text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Semantic Search
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Tìm thuốc theo triệu chứng
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            AI hiểu ngữ nghĩa — mô tả triệu chứng bằng tiếng Việt tự nhiên.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <p className="text-xs text-ink-500 mb-2">Chọn triệu chứng (mock):</p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_TO_DRUGS.map((s) => (
              <Link
                key={s.symptom}
                href={`/tim-kiem?q=${encodeURIComponent(s.symptom)}`}
                className="inline-flex items-center gap-1 px-3 h-8 text-xs bg-accent-50 text-accent-700 rounded-full hover:bg-accent-100 transition-colors"
              >
                <Stethoscope className="w-3 h-3" aria-hidden="true" />
                {s.symptom}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-5 bg-info-50 border border-info-200 rounded-md">
          <h2 className="text-sm font-semibold text-info-900 mb-3">Cách hoạt động</h2>
          <ol className="text-sm text-info-800 space-y-1 list-decimal pl-5">
            <li>Mô tả triệu chứng bằng tiếng Việt (VD: "đau đầu, sốt nhẹ")</li>
            <li>AI phân tích ngữ nghĩa + mapping tới nhóm thuốc phù hợp</li>
            <li>Sắp xếp kết quả theo độ liên quan + đánh giá từ dược sĩ</li>
            <li>Hiển thị thuốc OTC trước, thuốc kê đơn cần đơn BS</li>
          </ol>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-600" aria-hidden="true" />
            Gợi ý phổ biến
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {PRODUCTS.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/${p.category.slug}/${p.slug}`}
                className="group flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-ink-500">{p.shortDescription}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-accent-600" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}