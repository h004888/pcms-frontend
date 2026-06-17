// =====================================================
// /ai/semantic-search — AI-SEMANTIC-SEARCH (polished)
// Form input + keyword → product match
// + symptom database với symptom-to-product mapping
// =====================================================

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Sparkles, Search, Stethoscope, ArrowRight, Pill } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { getProductHref, formatVND } from '@/lib/shop/format';
import { getAIResponse } from '@/data/ai-responses';
import clsx from 'clsx';

interface SymptomGroup {
  category: string;
  items: { symptom: string; drugs: string[]; severity: 'self' | 'consult' | 'urgent' }[];
}

const SYMPTOM_DB: SymptomGroup[] = [
  {
    category: 'Triệu chứng thường gặp',
    items: [
      {
        symptom: 'đau đầu, sốt nhẹ',
        drugs: ['paracetamol-500-mg-20', 'ibuprofen-400mg'],
        severity: 'self',
      },
      {
        symptom: 'ho, đau họng',
        drugs: ['paracetamol-500-mg-20', 'cetirizine-10mg'],
        severity: 'self',
      },
      {
        symptom: 'sổ mũi, nghẹt mũi',
        drugs: ['cetirizine-10mg'],
        severity: 'self',
      },
      {
        symptom: 'đau bụng kinh',
        drugs: ['paracetamol-500-mg-20', 'ibuprofen-400mg'],
        severity: 'self',
      },
      {
        symptom: 'mệt mỏi, thiếu năng lượng',
        drugs: ['vitamin-c-1000-mg-30', 'omega-3-1000-mg-60', 'cal-d3-600-mg-60'],
        severity: 'self',
      },
      {
        symptom: 'đau cơ, khớp',
        drugs: ['ibuprofen-400mg'],
        severity: 'self',
      },
      {
        symptom: 'mất ngủ',
        drugs: ['melatonin-3mg'],
        severity: 'consult',
      },
    ],
  },
  {
    category: 'Cần tư vấn dược sĩ',
    items: [
      {
        symptom: 'huyết áp cao',
        drugs: ['amlodipine-5mg'],
        severity: 'consult',
      },
      {
        symptom: 'mỡ máu cao',
        drugs: ['atorvastatin-20mg'],
        severity: 'consult',
      },
      {
        symptom: 'tiểu đường',
        drugs: ['metformin-500mg'],
        severity: 'consult',
      },
      {
        symptom: 'viêm phổi, ho có đờm',
        drugs: ['amoxicillin-500-mg-12'],
        severity: 'urgent',
      },
    ],
  },
];

const SEVERITY_LABEL = {
  self: { text: 'Tự chăm sóc', class: 'bg-success-50 text-success-700 border-success-200' },
  consult: { text: 'Cần tư vấn DS', class: 'bg-warning-50 text-warning-700 border-warning-200' },
  urgent: { text: 'Khám BS ngay', class: 'bg-danger-50 text-danger-700 border-danger-200' },
} as const;

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const result = useMemo(() => {
    if (!submittedQuery) return null;
    const q = submittedQuery.toLowerCase();
    // Tìm trong SYMPTOM_DB trước
    for (const group of SYMPTOM_DB) {
      for (const item of group.items) {
        if (item.symptom.toLowerCase().includes(q) || q.includes(item.symptom.toLowerCase())) {
          const drugs = PRODUCTS.filter((p) => item.drugs.includes(p.slug));
          return {
            symptom: item.symptom,
            severity: item.severity,
            drugs,
            advice: getAIResponse(submittedQuery).response,
          };
        }
      }
    }
    // Fallback: search trong products
    const drugs = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q)
    ).slice(0, 4);
    if (drugs.length === 0) return { symptom: '', severity: 'self' as const, drugs: [], advice: '' };
    return { symptom: submittedQuery, severity: 'self' as const, drugs, advice: '' };
  }, [submittedQuery]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
  };

  return (
    <>
      <div className="bg-gradient-to-br from-info-50 to-accent-50 border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Tìm kiếm ngữ nghĩa' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-accent-600 text-white text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Semantic Search
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Tìm thuốc theo triệu chứng
          </h1>
          <p className="mt-1 text-base text-ink-600 text-pretty">
            Mô tả triệu chứng bằng tiếng Việt tự nhiên — AI sẽ đề xuất thuốc phù hợp.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Search input */}
        <form onSubmit={submit} className="p-4 bg-white border border-ink-200 rounded-md">
          <label htmlFor="symptom" className="text-sm font-semibold text-ink-900 block mb-2">
            Mô tả triệu chứng của bạn
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="symptom"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="VD: đau đầu, sốt nhẹ, mệt mỏi..."
              className="w-full h-11 pl-10 pr-24 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              Tìm
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-500">
            Gợi ý: thử các triệu chứng dưới đây hoặc mô tả bất kỳ.
          </p>
        </form>

        {/* Quick symptoms */}
        <div className="space-y-3">
          {SYMPTOM_DB.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const sev = SEVERITY_LABEL[item.severity];
                  return (
                    <button
                      key={item.symptom}
                      type="button"
                      onClick={() => {
                        setQuery(item.symptom);
                        setSubmittedQuery(item.symptom);
                      }}
                      className={clsx(
                        'inline-flex items-center gap-1 px-3 h-8 text-xs font-medium rounded-full border transition-colors',
                        sev.class
                      )}
                    >
                      <Stethoscope className="w-3 h-3" aria-hidden="true" />
                      {item.symptom}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        {result && submittedQuery && (
          <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold">
                  Kết quả cho
                </p>
                <h2 className="mt-1 text-lg font-semibold text-ink-900">{result.symptom || submittedQuery}</h2>
              </div>
              {result.severity && (
                <span
                  className={clsx(
                    'px-3 h-6 inline-flex items-center text-xs font-semibold rounded-full border',
                    SEVERITY_LABEL[result.severity].class
                  )}
                >
                  {SEVERITY_LABEL[result.severity].text}
                </span>
              )}
            </div>

            {result.advice && (
              <div className="p-3 bg-info-50 border border-info-200 rounded-md">
                <p className="text-xs font-semibold text-info-900 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Tư vấn từ AI
                </p>
                <p className="text-sm text-info-900 whitespace-pre-line">{result.advice}</p>
              </div>
            )}

            {result.drugs.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1">
                  <Pill className="w-4 h-4" aria-hidden="true" />
                  Đề xuất {result.drugs.length} sản phẩm
                </p>
                <div className="space-y-2">
                  {result.drugs.map((p) => (
                    <Link
                      key={p.id}
                      href={getProductHref(p)}
                      className="flex items-center gap-3 p-3 bg-ink-50 hover:bg-accent-50 rounded-md transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{p.name}</p>
                        <p className="text-xs text-ink-500">{p.brand} · {p.unit}</p>
                      </div>
                      <span className="text-sm font-bold text-accent-700 font-mono">
                        {formatVND(p.price)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-ink-400" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-ink-50 border border-ink-200 rounded-md text-center">
                <p className="text-sm text-ink-600">
                  Không tìm thấy sản phẩm phù hợp. Hãy thử mô tả khác hoặc đặt lịch tư vấn dược sĩ.
                </p>
                <Link
                  href="/dat-lich-tu-van"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-accent-700 hover:text-accent-800"
                >
                  Đặt lịch tư vấn →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}