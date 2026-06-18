// =====================================================
// /ai/rx-ocr — AI-RX-OCR
// OCR đơn thuốc bằng AI (link sang upload-toa đã có)
// Hoặc dùng standalone flow
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI đọc đơn thuốc',
  description: 'Upload ảnh đơn thuốc, AI tự động đọc và điền.',
};

export default function AIRxOcrPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-accent-50 to-info-50 border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'AI' }, { label: 'Đọc đơn thuốc' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-accent-600 text-white text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            AI-powered OCR
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            AI đọc đơn thuốc
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Upload ảnh đơn thuốc, AI nhận diện tên thuốc, liều dùng, tần suất — chỉ trong 2 giây.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-6 bg-white border border-ink-200 rounded-md text-center">
          <Camera className="w-12 h-12 mx-auto text-accent-600" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-ink-900">Đã có tính năng này</h2>
          <p className="mt-2 text-sm text-ink-600 text-pretty">
            Chức năng AI đọc đơn thuốc đã được tích hợp tại trang Upload đơn thuốc.
          </p>
          <Link
            href="/upload-toa"
            className="mt-5 inline-flex items-center justify-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
          >
            <Camera className="w-4 h-4" aria-hidden="true" />
            Đi đến Upload đơn thuốc
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-4 p-4 bg-info-50 border border-info-200 rounded-md">
          <h3 className="text-sm font-semibold text-info-900 mb-2">Cách hoạt động</h3>
          <ol className="text-sm text-info-800 space-y-1 list-decimal pl-5">
            <li>Upload ảnh đơn thuốc (JPG/PNG)</li>
            <li>AI Vision phân tích ảnh trong ~2 giây</li>
            <li>Nhận diện: tên thuốc, liều dùng, tần suất, thời gian</li>
            <li>Dược sĩ duyệt trước khi giao hàng</li>
          </ol>
        </div>
      </div>
    </>
  );
}