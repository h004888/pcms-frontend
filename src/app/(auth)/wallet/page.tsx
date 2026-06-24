// =====================================================
// /wallet — CUST-HEALTH-WALLET
// Ví sức khỏe: lưu trữ thông tin y tế cá nhân
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Wallet, Heart, Pill, FileText, AlertTriangle, Droplet, Activity } from 'lucide-react';
import { fetchWallet } from '@/features/wallet';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ví sức khỏe',
  description: 'Lưu trữ thông tin y tế cá nhân: dị ứng, bệnh nền, thuốc đang dùng.',
};

export default async function HealthWalletPage() {
  const wallet = await fetchWallet();

  return (
    <>
      <div className="bg-gradient-to-br from-danger-50 to-accent-50 border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Ví sức khỏe' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-danger-600 text-white text-xs font-semibold rounded-full">
            <Heart className="w-3 h-3" aria-hidden="true" />
            Thông tin y tế quan trọng
          </div>
          <h1 className="mt-3 text-xl font-bold text-ink-900">Ví sức khỏe</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Lưu trữ an toàn — chia sẻ với dược sĩ khi tư vấn.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Body metrics */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <Activity className="w-4 h-4 text-accent-600" aria-hidden="true" />
            Chỉ số cơ thể
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Nhóm máu', value: wallet.bloodType, icon: Droplet },
              { label: 'Chiều cao', value: wallet.height },
              { label: 'Cân nặng', value: wallet.weight },
              { label: 'BMI', value: wallet.bmi },
            ].map((item) => {
              const Icon = 'icon' in item ? item.icon : null;
              return (
                <div key={item.label} className="p-3 bg-ink-50 rounded text-center">
                  {Icon && (
                    <Icon className="w-4 h-4 mx-auto text-danger-600" aria-hidden="true" />
                  )}
                  <p className="mt-1 text-xs text-ink-500">{item.label}</p>
                  <p className="text-base font-bold font-mono text-ink-900">{item.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Allergies */}
        <section className="p-5 bg-danger-50 border border-danger-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-danger-900 mb-3">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            Dị ứng
          </h2>
          <div className="flex flex-wrap gap-2">
            {wallet.allergies.map((a) => (
              <span
                key={a}
                className="px-3 h-7 inline-flex items-center bg-danger-600 text-white text-xs font-semibold rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        {/* Conditions */}
        {wallet.chronicConditions.length > 0 && (
          <section className="p-5 bg-warning-50 border border-warning-200 rounded-md">
            <h2 className="flex items-center gap-2 text-base font-semibold text-warning-900 mb-3">
              <Heart className="w-4 h-4" aria-hidden="true" />
              Bệnh nền
            </h2>
            <ul className="space-y-1 text-sm text-warning-800">
              {wallet.chronicConditions.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Current medications */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <Pill className="w-4 h-4 text-accent-600" aria-hidden="true" />
            Thuốc đang dùng
          </h2>
          <ul className="space-y-2">
            {wallet.currentMedications.map((med, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-3 bg-ink-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{med.name}</p>
                  <p className="text-xs text-ink-500">{med.dosage}</p>
                </div>
                <span className="text-xs text-ink-500 font-mono">
                  Từ {new Date(med.since).toLocaleDateString('vi-VN')}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <FileText className="w-4 h-4 text-accent-600" aria-hidden="true" />
            Liên hệ khẩn cấp
          </h2>
          <p className="text-sm">
            <strong>{wallet.emergencyContact.name}</strong> ({wallet.emergencyContact.relation})
            <br />
            <span className="font-mono text-accent-700">{wallet.emergencyContact.phone}</span>
          </p>
        </section>
      </div>
    </>
  );
}
