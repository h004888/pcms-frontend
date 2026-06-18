// =====================================================
// /ai/drug-check — AI-DRUG-CHECK (polished)
// Extended interaction database + multi-select
// + allergies/food context
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AlertTriangle, Check, Pill, Sparkles, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Interaction {
  pair: [string, string];
  severity: 'low' | 'medium' | 'high';
  desc: string;
}

interface InteractionWithContext extends Interaction {
  notes: string[];
}

const INTERACTIONS: Interaction[] = [
  // High severity
  {
    pair: ['Warfarin', 'Aspirin'],
    severity: 'high',
    desc: 'Tăng nguy cơ xuất huyết nghiêm trọng. Chống chỉ định phối hợp.',
  },
  {
    pair: ['Methotrexate', 'Ibuprofen'],
    severity: 'high',
    desc: 'Ibuprofen giảm thải trừ Methotrexate → tích tụ độc tính. Tránh dùng cùng.',
  },
  {
    pair: ['MAOIs', 'Sumatriptan'],
    severity: 'high',
    desc: 'Nguy cơ cơn tăng huyết áp nghiêm trọng. Chống chỉ định.',
  },
  // Medium severity
  {
    pair: ['Ibuprofen', 'Amlodipine'],
    severity: 'medium',
    desc: 'Ibuprofen có thể giảm tác dụng hạ áp của Amlodipine. Theo dõi huyết áp sát.',
  },
  {
    pair: ['Metformin', 'Ibuprofen'],
    severity: 'medium',
    desc: 'NSAID ảnh hưởng chức năng thận, có thể tăng tích tụ Metformin.',
  },
  {
    pair: ['Digoxin', 'Furosemide'],
    severity: 'medium',
    desc: 'Furosemide gây mất kali → tăng độc tính Digoxin. Bổ sung kali nếu cần.',
  },
  {
    pair: ['Simvastatin', 'Amiodarone'],
    severity: 'medium',
    desc: 'Amiodarone ức chế CYP3A4 → tăng nồng độ Simvastatin, nguy cơ tiêu cơ vân.',
  },
  {
    pair: ['ACE inhibitors', 'Spironolactone'],
    severity: 'medium',
    desc: 'Tăng nguy cơ tăng kali máu. Cần theo dõi kali định kỳ.',
  },
  // Low severity
  {
    pair: ['Atorvastatin', 'Amoxicillin'],
    severity: 'low',
    desc: 'Không có tương tác đáng kể. Có thể dùng đồng thời.',
  },
  {
    pair: ['Vitamin C', 'Vitamin D3'],
    severity: 'low',
    desc: 'Bổ sung cùng nhau an toàn, có thể tăng hấp thu.',
  },
  {
    pair: ['Paracetamol', 'Amoxicillin'],
    severity: 'low',
    desc: 'Không tương tác. Dùng cùng nhau an toàn theo liều chỉ định.',
  },
];

const DRUG_SUGGESTIONS = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Amlodipine', 'Atorvastatin',
  'Metformin', 'Amlodipine', 'Warfarin', 'Digoxin', 'Simvastatin', 'Methotrexate',
  'Vitamin D3', 'Vitamin C', 'Omega-3', 'Spironolactone', 'Furosemide', 'Cephalexin',
];

function findInteraction(a: string, b: string): Interaction | null {
  return (
    INTERACTIONS.find(
      (r) =>
        (r.pair[0] === a && r.pair[1] === b) ||
        (r.pair[0] === b && r.pair[1] === a)
    ) ?? null
  );
}

function getAllNotes(a: string, b: string): string[] {
  if (!a || !b) return [];
  const i = findInteraction(a, b);
  if (!i) return [];
  return [i.desc];
}

const ALLERGY_NOTES: Record<string, string> = {
  'Penicillin': 'Tránh Amoxicillin, Ampicillin, Cephalexin (có thể phản ứng chéo).',
  'Aspirin': 'Tránh NSAID khác (Ibuprofen, Naproxen) — tăng nguy cơ xuất huyết.',
  'Sữa': 'Tránh Tetracycline, Quinolone (Ciprofloxacin) — sữa giảm hấp thu.',
  ' Gluten': 'Kiểm tra tá dược trong thuốc — một số có chứa tinh bột mì.',
};

const FOOD_NOTES: Record<string, string> = {
  'Bưởi': 'Tăng nồng độ Simvastatin, Atorvastatin, Amlodipine — tránh ăn cùng.',
  'Rượu': 'Tránh Metronidazole, Tinidazole (gây phản ứng giống Disulfiram), Paracetamol (độc tính gan).',
  'Cà phê': 'Giảm hấp thu Sắt, Canxi. Uống cách ≥1 giờ.',
  'Rau xanh đậm': 'Giàu Vitamin K, giảm tác dụng Warfarin.',
};

export default function DrugCheckPage() {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [allergy, setAllergy] = useState<string[]>([]);
  const [food, setFood] = useState<string[]>([]);
  const [result, setResult] = useState<InteractionWithContext | null>(null);

  const allergyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = e.currentTarget.value.trim();
      if (v && !allergy.includes(v)) {
        setAllergy((p) => [...p, v]);
        e.currentTarget.value = '';
      }
    }
  };

  const foodInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = e.currentTarget.value.trim();
      if (v && !food.includes(v)) {
        setFood((p) => [...p, v]);
        e.currentTarget.value = '';
      }
    }
  };

  const check = () => {
    if (!drug1) return toast.error('Chọn thuốc thứ nhất');
    if (!drug2) return toast.error('Chọn thuốc thứ hai');
    if (drug1 === drug2) return toast.error('Vui lòng chọn 2 thuốc khác nhau');

    const interaction = findInteraction(drug1, drug2);
    const notes: string[] = [];
    if (interaction) notes.push(interaction.desc);

    allergy.forEach((a) => {
      const note = ALLERGY_NOTES[a];
      if (note) notes.push(`⚠️ Dị ứng "${a}": ${note}`);
    });
    food.forEach((f) => {
      const note = FOOD_NOTES[f];
      if (note) notes.push(`🍽️ Thức ăn "${f}": ${note}`);
    });

    if (interaction) {
      setResult({ ...interaction, notes });
    } else if (notes.length > 0) {
      setResult({
        pair: [drug1, drug2],
        severity: 'low',
        desc: 'Không phát hiện tương tác giữa 2 thuốc. Tuy nhiên có cảnh báo về dị ứng/thức ăn:',
        notes,
      });
    } else {
      setResult({
        pair: [drug1, drug2],
        severity: 'low',
        desc: 'Không phát hiện tương tác đáng kể. Có thể dùng đồng thời theo chỉ định bác sĩ.',
        notes: [],
      });
    }
  };

  const clear = () => {
    setDrug1('');
    setDrug2('');
    setAllergy([]);
    setFood([]);
    setResult(null);
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
            Chọn 2 thuốc + dị ứng + thức ăn để kiểm tra tương tác toàn diện.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
          <div>
            <label htmlFor="drug1" className="text-sm font-semibold text-ink-900 block mb-1">
              <Pill className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Thuốc thứ nhất *
            </label>
            <input
              id="drug1"
              type="text"
              list="drugs-list"
              value={drug1}
              onChange={(e) => setDrug1(e.target.value)}
              placeholder="Gõ tên thuốc..."
              className="w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>

          <div>
            <label htmlFor="drug2" className="text-sm font-semibold text-ink-900 block mb-1">
              <Pill className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Thuốc thứ hai *
            </label>
            <input
              id="drug2"
              type="text"
              list="drugs-list"
              value={drug2}
              onChange={(e) => setDrug2(e.target.value)}
              placeholder="Gõ tên thuốc..."
              className="w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
            <datalist id="drugs-list">
              {DRUG_SUGGESTIONS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink-900 block mb-1">
              Dị ứng (nhấn Enter để thêm)
            </label>
            <input
              type="text"
              placeholder="VD: Penicillin, Aspirin..."
              onKeyDown={allergyInput}
              className="w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
            {allergy.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {allergy.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 px-2 h-6 bg-danger-100 text-danger-800 text-xs font-medium rounded-full"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => setAllergy((p) => p.filter((x) => x !== a))}
                      aria-label={`Xóa dị ứng ${a}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-ink-900 block mb-1">
              Thức ăn đặc biệt (nhấn Enter để thêm)
            </label>
            <input
              type="text"
              placeholder="VD: Bưởi, Rượu, Cà phê..."
              onKeyDown={foodInput}
              className="w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
            {food.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {food.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2 h-6 bg-warning-100 text-warning-800 text-xs font-medium rounded-full"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => setFood((p) => p.filter((x) => x !== f))}
                      aria-label={`Xóa thức ăn ${f}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={check}
              className="flex-1 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Kiểm tra ngay
            </button>
            {(drug1 || drug2 || allergy.length > 0 || food.length > 0) && (
              <button
                type="button"
                onClick={clear}
                className="px-4 h-11 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
              >
                Xoá
              </button>
            )}
          </div>
        </div>

        {result && (
          <div
            className={clsx(
              'p-5 border-2 rounded-md space-y-3',
              result.severity === 'high'
                ? 'bg-danger-50 border-danger-300'
                : result.severity === 'medium'
                  ? 'bg-warning-50 border-warning-300'
                  : 'bg-success-50 border-success-300'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  'w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 text-white',
                  result.severity === 'high'
                    ? 'bg-danger-600'
                    : result.severity === 'medium'
                      ? 'bg-warning-600'
                      : 'bg-success-600'
                )}
              >
                {result.severity === 'low' ? (
                  <Check className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={clsx(
                    'text-base font-semibold',
                    result.severity === 'high'
                      ? 'text-danger-900'
                      : result.severity === 'medium'
                        ? 'text-warning-900'
                        : 'text-success-900'
                  )}
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
                  className={clsx(
                    'mt-2 text-sm text-pretty',
                    result.severity === 'high'
                      ? 'text-danger-800'
                      : result.severity === 'medium'
                        ? 'text-warning-800'
                        : 'text-success-800'
                  )}
                >
                  {result.desc}
                </p>
              </div>
            </div>
            {result.notes.length > 0 && (
              <div className="pt-3 border-t border-current/10 space-y-1.5 text-sm">
                {result.notes.map((n, i) => (
                  <p key={i} className="text-pretty">{n}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-ink-500 text-center">
          Thông tin tham khảo. Luôn tham vấn bác sĩ/dược sĩ trước khi phối hợp thuốc.
        </p>
      </div>
    </>
  );
}