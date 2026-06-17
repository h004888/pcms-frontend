// =====================================================
// /mobile — MOBILE-HOME
// Trang chủ PWA mobile (cài như app)
// PCMS portal: shortcuts chính cho dược sĩ & khách
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Smartphone, Search, Pill, Camera, Bell, MapPin, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PCMS Mobile',
  description: 'Phiên bản mobile — cài đặt làm ứng dụng, dùng offline.',
};

const SHORTCUTS = [
  { href: '/tim-kiem', label: 'Tra cứu thuốc', icon: Search, accent: 'from-info-500 to-info-600' },
  { href: '/upload-toa', label: 'Đọc đơn thuốc', icon: Camera, accent: 'from-accent-500 to-accent-600' },
  { href: '/don-hang', label: 'Đơn hàng', icon: Pill, accent: 'from-success-500 to-success-600' },
  { href: '/mobile/nhac-uong-thuoc', label: 'Nhắc uống thuốc', icon: Bell, accent: 'from-warning-500 to-warning-600' },
  { href: '/he-thong-cua-hang', label: 'Nhà thuốc gần bạn', icon: MapPin, accent: 'from-danger-500 to-danger-600' },
  { href: '/ai/chat', label: 'Tư vấn AI', icon: MessageSquare, accent: 'from-primary-500 to-primary-600' },
];

export default function MobileHomePage() {
  return (
    <>
      <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white">
        <div className="mx-auto max-w-md px-4 py-10 text-center">
          <Smartphone className="w-12 h-12 mx-auto text-accent-400" aria-hidden="true" />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-balance">
            PCMS Mobile
          </h1>
          <p className="mt-2 text-sm text-accent-100 text-pretty">
            Cài đặt làm ứng dụng — dùng offline, truy cập nhanh.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        <h2 className="text-base font-semibold text-ink-900 mb-3">
          Shortcuts nhanh
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col items-center gap-2 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${s.accent} rounded-md flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-ink-900 text-center text-balance">
                  {s.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-info-50 border border-info-200 rounded-md">
          <h3 className="text-sm font-semibold text-info-900 mb-2">Cài đặt như ứng dụng</h3>
          <p className="text-xs text-info-800">
            Trên iOS: nhấn nút Chia sẻ → &quot;Thêm vào MH chính&quot;.
            Trên Android: menu trình duyệt → &quot;Cài đặt ứng dụng&quot;.
          </p>
        </div>
      </div>
    </>
  );
}