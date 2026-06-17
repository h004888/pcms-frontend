// =====================================================
// /addresses — CUST-ADDRESS
// Sổ địa chỉ giao hàng
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { MapPin, Plus, Home, Briefcase, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sổ địa chỉ',
  description: 'Quản lý địa chỉ giao hàng của bạn.',
};

const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Nhà',
    icon: Home,
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    line: '12 Lê Lợi, Phường Bến Nghé',
    province: 'Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Công ty',
    icon: Briefcase,
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    line: '456 Võ Văn Tần, Phường 5',
    province: 'Quận 3, TP. Hồ Chí Minh',
    isDefault: false,
  },
];

export default function AddressesPage() {
  if (MOCK_ADDRESSES.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Sổ địa chỉ' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Sổ địa chỉ</h1>
        <EmptyState
          icon={MapPin}
          title="Chưa có địa chỉ"
          description="Thêm địa chỉ giao hàng để thanh toán nhanh hơn."
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
            >
              <Plus className="w-4 h-4" /> Thêm địa chỉ
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
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Sổ địa chỉ' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Sổ địa chỉ</h1>
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
        {MOCK_ADDRESSES.map((addr) => {
          const Icon = addr.icon;
          return (
            <article
              key={addr.id}
              className="p-4 bg-white border border-ink-200 rounded-md"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-ink-50 rounded-md flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-ink-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 h-5 bg-ink-100 text-ink-700 text-xs font-medium rounded">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 h-5 bg-accent-100 text-accent-700 text-xs font-semibold rounded">
                        <Star className="w-3 h-3 fill-accent-700" aria-hidden="true" />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink-900">{addr.name}</p>
                  <p className="text-xs text-ink-500 font-mono">{addr.phone}</p>
                  <p className="mt-1 text-sm text-ink-700 text-pretty">
                    {addr.line}, {addr.province}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="text-xs text-accent-700 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="text-xs text-danger-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}