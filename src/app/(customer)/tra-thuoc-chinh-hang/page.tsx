// =====================================================
// /tra-thuoc-chinh-hang — SHOP-VERIFY-ORIGIN
// Kiểm tra thuốc chính hãng: mã vạch, QR, bao bì
// PCMS portal: hỗ trợ dược sĩ & khách hàng verify
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { ShieldCheck, ScanLine, QrCode, Package, AlertTriangle, Check } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tra thuốc chính hãng',
  description: 'Hướng dẫn kiểm tra thuốc chính hãng qua mã vạch, QR, bao bì.',
};

const STEPS = [
  {
    icon: ScanLine,
    title: 'Quét mã vạch',
    desc: 'Mã EAN-13 / EAN-14 trên bao bì phải khớp với thông tin nhà sản xuất.',
  },
  {
    icon: QrCode,
    title: 'Quét QR truy xuất',
    desc: 'Mở app PCMS hoặc Zalo, quét QR trên hộp thuốc để xem nguồn gốc, lô SX, HSD.',
  },
  {
    icon: Package,
    title: 'Kiểm tra bao bì',
    desc: 'Tem chống giả còn nguyên, chữ in rõ ràng, không có dấu hiệu bóc lại.',
  },
  {
    icon: ShieldCheck,
    title: 'Đối chiếu SĐK',
    desc: 'Số đăng ký thuốc (VD-12345-18) phải có trên hộp và tra được trên drugbank.vn.',
  },
];

const RED_FLAGS = [
  'Tem chống giả rách, mờ hoặc có dấu hiệu dán lại',
  'Chữ in nhòe, sai chính tả, font lạ',
  'Mùi / màu thuốc khác với mô tả',
  'Hạn dùng cận, đã qua hoặc không có',
  'Giá bán thấp hơn nhiều so với thị trường',
];

export default function TraThuocChinhHangPage() {
  return (
    <>
      <LookupNav active="tra-thuoc-chinh-hang" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[{ label: 'Tra cứu' }, { label: 'Tra thuốc chính hãng' }]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Tra thuốc chính hãng
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            4 bước kiểm tra giúp xác minh thuốc chính hãng trước khi sử dụng.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Steps */}
        <section>
          <h2 className="text-lg font-semibold text-ink-900 mb-3">
            Quy trình kiểm tra
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-4 bg-white border border-ink-200 rounded-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent-700">
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-accent-600" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-ink-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-ink-600">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Red flags */}
        <section className="p-5 bg-danger-50 border border-danger-200 rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-danger-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-danger-900">
              Dấu hiệu thuốc giả / nhập lậu
            </h2>
          </div>
          <ul className="space-y-2">
            {RED_FLAGS.map((flag) => (
              <li
                key={flag}
                className="flex items-start gap-2 text-sm text-danger-800"
              >
                <span className="text-danger-500 mt-1" aria-hidden="true">
                  ⚠
                </span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Verification tools */}
        <section className="p-5 bg-success-50 border border-success-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-success-900 mb-3">
            <Check className="w-5 h-5 text-success-700" aria-hidden="true" />
            Công cụ tra cứu chính thức
          </h2>
          <ul className="space-y-2 text-sm text-success-800">
            <li>
              <strong>Cục Quản lý Dược:</strong> drugbank.vn — tra SĐK thuốc
            </li>
            <li>
              <strong>Tổng cục Hải quan:</strong> Tra cứu lô hàng nhập khẩu
            </li>
            <li>
              <strong>App PCMS:</strong> Quét QR trên hộp thuốc để xem nguồn gốc
            </li>
          </ul>
        </section>

        <p className="text-xs text-ink-500 text-center">
          Nếu nghi ngờ thuốc giả, vui lòng báo cáo qua hotline 1900-xxxx hoặc email{' '}
          <a href="mailto:report@pcms.vn" className="text-accent-700 hover:underline">
            report@pcms.vn
          </a>
          .
        </p>
      </div>
    </>
  );
}