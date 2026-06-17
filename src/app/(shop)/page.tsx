// =====================================================
// / (B2C root) — Public landing / catalog home
// PLACEHOLDER: Will be replaced by SHOP-HOME in Phase 2
// Brand: PCMS (Pharmacy Chain Management System) portal nội bộ
// =====================================================

import Link from 'next/link';
import { Pill, ArrowRight, Search, MessageCircle, FileText, MapPin } from 'lucide-react';

export default function ShopHomePlaceholder() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-accent-100 mb-6">
            <Pill className="w-3 h-3" aria-hidden="true" />
            PCMS — Hệ thống quản lý chuỗi nhà thuốc
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance max-w-3xl mx-auto">
            Tra cứu thuốc, kê đơn, quản lý tồn kho — đồng bộ toàn chuỗi
          </h1>
          <p className="mt-5 text-base md:text-lg text-accent-100 max-w-2xl mx-auto">
            Công cụ làm việc hằng ngày cho dược sĩ: tra cứu nhanh, kê đơn an toàn,
            POS nhanh, quản lý tồn kho và khách hàng thân thiết.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Tra cứu thuốc
            </Link>
            <Link
              href="/prescriptions/upload"
              className="inline-flex items-center gap-2 px-5 h-11 bg-white text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Đặt thuốc theo toa
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Bắt đầu nhanh
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search },
            { label: 'Tư vấn AI', href: '/ai/chat', icon: MessageCircle },
            { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin },
            { label: 'Đặt thuốc theo toa', href: '/prescriptions/upload', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center gap-2 p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:bg-accent-50 transition-colors"
              >
                <div className="w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                  <Icon className="w-5 h-5 text-accent-700" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-ink-900">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Phase 1 status */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-6 bg-ink-50 border border-ink-200 rounded-md text-center">
          <p className="text-sm font-semibold text-ink-900 mb-1">
            🚧 Đang xây dựng — Phase 1 (Foundation + PWA)
          </p>
          <p className="text-sm text-ink-600">
            SHOP-HOME đầy đủ (hero + 6 categories + bestseller + health tools + video + store locator) sẽ có trong Phase 2.
            Hiện tại bạn có thể khám phá:{' '}
            <Link href="/gioi-thieu" className="text-accent-700 font-medium hover:underline">
              Giới thiệu
            </Link>
            {' · '}
            <Link href="/tin-tuc-su-kien" className="text-accent-700 font-medium hover:underline">
              Tin tức
            </Link>
            {' · '}
            <Link href="/tuyen-dung" className="text-accent-700 font-medium hover:underline">
              Tuyển dụng
            </Link>
            {' · '}
            <Link href="/chinh-sach/giao-hang" className="text-accent-700 font-medium hover:underline">
              Chính sách giao hàng
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
