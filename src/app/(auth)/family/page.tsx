// =====================================================
// /family — CUST-FAMILY
// Hồ sơ sức khỏe gia đình
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Users, Plus, User, Cake, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ gia đình',
  description: 'Quản lý hồ sơ sức khỏe người thân trong gia đình.',
};

const MOCK_FAMILY = [
  {
    id: 'fm-1',
    name: 'Nguyễn Văn A',
    relation: 'Bản thân',
    birthYear: 1990,
    allergies: ['Penicillin'],
    conditions: [],
  },
  {
    id: 'fm-2',
    name: 'Trần Thị B',
    relation: 'Vợ',
    birthYear: 1992,
    allergies: [],
    conditions: ['Tiểu đường type 2'],
  },
  {
    id: 'fm-3',
    name: 'Nguyễn Minh C',
    relation: 'Con trai',
    birthYear: 2018,
    allergies: ['Sữa'],
    conditions: [],
  },
];

export default function FamilyPage() {
  if (MOCK_FAMILY.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ gia đình' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Hồ sơ gia đình</h1>
        <EmptyState
          icon={Users}
          title="Chưa có hồ sơ gia đình"
          description="Thêm thông tin sức khỏe của người thân để dược sĩ tư vấn chính xác hơn."
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
            >
              <Plus className="w-4 h-4" /> Thêm thành viên
            </button>
          }
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ gia đình' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Hồ sơ gia đình</h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">{MOCK_FAMILY.length} thành viên</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 h-9 bg-accent-600 text-white text-xs font-semibold rounded-md hover:bg-accent-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Thêm
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_FAMILY.map((m) => (
          <article
            key={m.id}
            className="p-4 bg-white border border-ink-200 rounded-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-accent-700" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{m.name}</p>
                <div className="mt-1 flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2 h-5 bg-ink-100 text-ink-700 rounded">{m.relation}</span>
                  <span className="inline-flex items-center gap-1 text-ink-500 font-mono">
                    <Cake className="w-3 h-3" aria-hidden="true" />
                    {m.birthYear}
                  </span>
                </div>
                {m.allergies.length > 0 && (
                  <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs text-danger-800">
                    <strong className="font-semibold">Dị ứng:</strong> {m.allergies.join(', ')}
                  </div>
                )}
                {m.conditions.length > 0 && (
                  <div className="mt-2 p-2 bg-warning-50 border border-warning-200 rounded text-xs text-warning-800">
                    <AlertTriangle className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    <strong className="font-semibold">Bệnh nền:</strong> {m.conditions.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}