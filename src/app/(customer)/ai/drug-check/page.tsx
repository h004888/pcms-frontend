// =====================================================
// /ai/drug-check — AI-DRUG-CHECK
// Kiểm tra tương tác thuốc
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AlertTriangle, Check, Pill, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const KNOWN_DRUGS = [
  'Paracetamol',
  'Amoxicillin',
  'Ibuprofen',
  'Amlodipine',
  'Atorvastatin',
  'Metformin',
  'Vitamin C',
  'Omega-3',
];

// Mock interactions
const INTERACTION_RULES: Array<{
  pair: [string, string];
  severity: 'low' | 'medium' | 'high';
  desc: string;
}> = [
  {
    pair: ['Ibuprofen', 'Amlodipine'],
    severity: 'medium',
    desc: 'Ibuprofen có thể giảm tác dụng hạ áp của Amlodipine. Theo dõi huyết áp sát.',
  },
  {
    pair: ['Atorvastatin', 'Amoxicillin'],
    severity: 'low',
    desc: 'Không có tương tác đáng kể. Có thể dùng đồng thời.',
  },
  {
    pair: ['Metformin', 'Ibuprofen'],
    severity: 'medium',
    desc: 'NSAID có thể ảnh hưởng chức năng thận, gián tiếp tăng tích tụ Metformin.',
  },
];

export default function DrugCheckPage() {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<typeof INTERACTION_RULES[number] | null>(null);

  const check = () => {
    if (!drug1 || !drug2) {
      toast.error('Chọn 2 thuốc để kiểm tra');
      return;
    }
    if (drug1 === drug2) {
      toast.error('Vui lòng chọn 2 thuốc khác nhau');
      return;
    }
    const found = INTERACTION_RULES.find(
      (r) =>
        (r.pair[0] === drug1 && r.pair[1] === drug2) ||
        (r.pair[0] === drug2 && r.pair[1] === drug1)
    );
    setResult(
      found ?? {
        pair: [drug1, drug2],
        severity: 'low',
        desc: 'Không phát hiện tương tác đáng kể. Có thể dùng đồng thời theo chỉ định bác sĩ.',
      }
    );
  };

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Kiểm tra tương tác thuốc' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-info-600 text-white text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            AI kiểm tra tương tác
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Kiểm tra tương tác thuốc
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Chọn 2 thuốc đang dùng để kiểm tra tương tác và cảnh báo.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
          <div>
            <label htmlFor="drug1" className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
              <Pill className="w-4 h-4" aria-hidden="true" />
              Thuốc thứ nhất
            </label>
            <select
              id="drug1"
              value={drug1}
              onChange={(e) => setDrug1(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              <option value="">-- Chọn thuốc --</option>
              {KNOWN_DRUGS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="drug2" className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
              <Pill className="w-4 h-4" aria-hidden="true" />
              Thuốc thứ hai
            </label>
            <select
              id="drug2"
              value={drug2}
              onChange={(e) => setDrug2(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              <option value="">-- Chọn thuốc --</option>
              {KNOWN_DRUGS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={check}
            className="w-full h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
          >
            Kiểm tra ngay
          </button>
        </div>

        {result && (
          <div
            className={`p-5 border-2 rounded-md ${
              result.severity === 'high'
                ? 'bg-danger-50 border-danger-300'
                : result.severity === 'medium'
                  ? 'bg-warning-50 border-warning-300'
                  : 'bg-success-50 border-success-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                  result.severity === 'high'
                    ? 'bg-danger-600'
                    : result.severity === 'medium'
                      ? 'bg-warning-600'
                      : 'bg-success-600'
                }`}
              >
                {result.severity === 'low' ? (
                  <Check className="w-5 h-5 text-white" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-white" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-semibold ${
                    result.severity === 'high'
                      ? 'text-danger-900'
                      : result.severity === 'medium'
                        ? 'text-warning-900'
                        : 'text-success-900'
                  }`}
                >
                  {result.severity === 'low'
                    ? 'Không có tương tác đáng kể'
                    : result.severity === 'medium'
                      ? 'Tương tác trung bình'
                      : 'Tương tác nghiêm trọng'}
                </h3>
                <p className="mt-1 text-sm font-mono">
                  {result.pair[0]} + {result.pair[1]}
                </p>
                <p
                  className={`mt-2 text-sm text-pretty ${
                    result.severity === 'high'
                      ? 'text-danger-800'
                      : result.severity === 'medium'
                        ? 'text-warning-800'
                        : 'text-success-800'
                  }`}
                >
                  {result.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-ink-500 text-center">
          Thông tin tham khảo. Luôn tham vấn bác sĩ/dược sĩ trước khi phối hợp thuốc.
        </p>
      </div>
    </>
  );
}