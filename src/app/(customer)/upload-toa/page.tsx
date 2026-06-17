// =====================================================
// /prescriptions/upload — SHOP-RX-UPLOAD: Đặt thuốc theo toa
// AI OCR đọc đơn thuốc, dược sĩ duyệt, giao tận nơi
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { RXUploader } from '@/components/shop/RXUploader';
import { FileText, ShieldCheck, Clock, Truck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt thuốc theo toa',
  description: 'Upload đơn thuốc, AI đọc giúp. Dược sĩ xác nhận, giao tận nơi.',
};

export default function ShopRXUploadPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[{ label: 'Đặt thuốc theo toa' }]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Đặt thuốc theo toa
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Upload ảnh đơn thuốc, AI sẽ đọc giúp. Dược sĩ xác nhận, giao tận nơi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <RXUploader />

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: 'Dược sĩ duyệt' },
            { icon: Clock, label: 'Trong 30 phút' },
            { icon: Truck, label: 'Giao tận nơi' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-4 bg-white border border-ink-200 rounded-md flex items-center gap-3"
              >
                <Icon className="w-5 h-5 text-accent-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-ink-900">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-info-50 border border-info-200 rounded-md">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-info-900 mb-2">
            <FileText className="w-4 h-4" aria-hidden="true" /> Hướng dẫn chụp ảnh
          </h2>
          <ul className="text-xs text-info-700 space-y-1 list-disc pl-4">
            <li>Đặt đơn thuốc trên nền phẳng, đủ ánh sáng</li>
            <li>Chụp thẳng, không nghiêng, không mờ</li>
            <li>Đảm bảo tên thuốc, liều lượng, tần suất dùng đọc rõ</li>
            <li>Có thể upload nhiều ảnh (nếu đơn nhiều trang)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
