// =====================================================
// /tiem-chung — VACCINE-HOME
// Danh sách vaccine, phân loại theo đối tượng
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { VACCINES } from '@/data/shop/vaccines';
import { Syringe, Calendar, FileText } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiêm chủng',
  description: 'Đặt lịch tiêm vaccine cúm, COVID, viêm gan B và nhiều loại khác.',
};

export default function TiemChungPage() {
  const categories = [
    { id: 'trẻ em', label: 'Trẻ em', color: 'bg-info-50 text-info-700' },
    { id: 'người lớn', label: 'Người lớn', color: 'bg-accent-50 text-accent-700' },
    { id: 'phụ nữ mang thai', label: 'Phụ nữ mang thai', color: 'bg-danger-50 text-danger-700' },
    { id: 'người cao tuổi', label: 'Người cao tuổi', color: 'bg-warning-50 text-warning-700' },
  ] as const;

  return (
    <>
      <div className="bg-gradient-to-br from-info-50 to-accent-50 border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Tiêm chủng' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-info-600 text-white text-xs font-semibold rounded-full">
            <Syringe className="w-3 h-3" aria-hidden="true" />
            Vaccine chính hãng · Bác sĩ thực hiện
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Tiêm chủng
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">
            Đặt lịch tiêm vaccine tại nhà thuốc PCMS — thủ tục nhanh, giá minh bạch.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tiem-chung/dat-lich"
              className="inline-flex items-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Đặt lịch tiêm
            </Link>
            <Link
              href="/tiem-chung/so-tiem"
              className="inline-flex items-center gap-2 px-5 h-11 bg-white border border-ink-200 text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              Sổ tiêm của tôi
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {categories.map((cat) => {
          const list = VACCINES.filter((v) => v.category === cat.id);
          if (list.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 className="text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
                <span className={`px-2 h-6 inline-flex items-center text-xs font-semibold rounded ${cat.color}`}>
                  {cat.label}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((v) => (
                  <article
                    key={v.id}
                    className="p-4 bg-white border border-ink-200 rounded-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-ink-900 text-balance">
                        {v.name}
                      </h3>
                      <span className="px-2 h-5 bg-accent-600 text-white text-[10px] font-bold rounded uppercase flex-shrink-0">
                        {v.price === 0 ? 'Miễn phí' : formatVND(v.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-600 line-clamp-2 text-pretty">
                      {v.description}
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-ink-500">
                      <p>
                        <strong className="text-ink-700">Xuất xứ:</strong> {v.manufacturer}, {v.origin}
                      </p>
                      <p>
                        <strong className="text-ink-700">Đối tượng:</strong> {v.ageRange}
                      </p>
                      <p>
                        <strong className="text-ink-700">Lịch tiêm:</strong> {v.doses} mũi — {v.schedule}
                      </p>
                    </div>
                    <Link
                      href="/tiem-chung/dat-lich"
                      className="mt-3 block w-full text-center h-8 leading-8 text-xs font-semibold bg-ink-100 text-ink-900 rounded hover:bg-ink-200 transition-colors"
                    >
                      Đặt lịch tiêm
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}