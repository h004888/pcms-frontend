// =====================================================
// /profile — CUST-PROFILE
// Hồ sơ cá nhân
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { User, Mail, Phone, Calendar, Shield, Edit2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ của tôi',
  description: 'Thông tin cá nhân và bảo mật tài khoản PCMS.',
};

const MOCK_PROFILE = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '090****567',
  birthday: '1990-05-15',
  gender: 'Nam',
  memberSince: '2023-08-12',
  tier: 'Vàng',
};

export default function ProfilePage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Hồ sơ của tôi</h1>
        </div>
      </div>

      <div className="space-y-4">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink-900">{MOCK_PROFILE.name}</h2>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="px-2 h-5 bg-warning-100 text-warning-700 text-xs font-semibold rounded-full">
                  Thành viên {MOCK_PROFILE.tier}
                </span>
                <span className="text-xs text-ink-500 font-mono">
                  Từ {new Date(MOCK_PROFILE.memberSince).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 h-9 text-xs font-medium text-accent-700 hover:bg-accent-50 rounded-md transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
              Sửa
            </button>
          </div>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Thông tin cá nhân</h2>
          <dl className="space-y-3 text-sm">
            <Row icon={User} label="Họ tên" value={MOCK_PROFILE.name} />
            <Row icon={Calendar} label="Ngày sinh" value={new Date(MOCK_PROFILE.birthday).toLocaleDateString('vi-VN')} />
            <Row icon={User} label="Giới tính" value={MOCK_PROFILE.gender} />
          </dl>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Liên lạc</h2>
          <dl className="space-y-3 text-sm">
            <Row icon={Mail} label="Email" value={MOCK_PROFILE.email} />
            <Row icon={Phone} label="Số điện thoại" value={MOCK_PROFILE.phone} />
          </dl>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Bảo mật</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
            Đổi mật khẩu
          </button>
        </section>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
      <dt className="w-32 flex-shrink-0 text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}