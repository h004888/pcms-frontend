// =====================================================
// /chuyen-trang-ung-thu — CANCER-INFO
// Thông tin các bệnh ung thư phổ biến
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LookupNav } from '@/components/shop/LookupNav';
import { CANCER_ARTICLES } from '@/data/shop/cancer';
import { Heart, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chuyên trang Ung thư',
  description: 'Thông tin y khoa về ung thư: phòng ngừa, tầm soát, điều trị.',
};

export default function ChuyenTrangUngThuPage() {
  const categories = ['phổ biến', 'hiếm gặp', 'trẻ em'] as const;

  return (
    <>
      <LookupNav active="chuyen-trang-ung-thu" />

      <div className="bg-gradient-to-br from-danger-50 to-info-50 border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Chuyên trang Ung thư' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-danger-600 text-white text-xs font-semibold rounded-full">
            <Heart className="w-3 h-3" aria-hidden="true" />
            Tầm soát sớm — Cơ hội chữa lành cao
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Chuyên trang Ung thư
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">
            Thông tin y khoa về các bệnh ung thư phổ biến tại Việt Nam — phòng ngừa,
            triệu chứng, tầm soát và điều trị.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-md flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-warning-800">
            <strong>Lưu ý:</strong> Nội dung chỉ mang tính tham khảo, không thay thế
            tư vấn y khoa. Khi có triệu chứng bất thường, vui lòng đến cơ sở y tế để
            được chẩn đoán và điều trị kịp thời.
          </p>
        </div>

        {categories.map((cat) => {
          const items = CANCER_ARTICLES.filter((c) => c.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="text-lg font-semibold text-ink-900 mb-3 capitalize">
                Ung thư {cat}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/chuyen-trang-ung-thu#${c.slug}`}
                    className="block p-4 bg-white border border-ink-200 rounded-md hover:border-danger-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
                  >
                    <h3 className="text-base font-semibold text-ink-900 text-balance">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-600 line-clamp-2 text-pretty">
                      {c.shortDesc}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Detail sections */}
        <div className="space-y-8 pt-4">
          {CANCER_ARTICLES.map((c) => (
            <article
              key={c.slug}
              id={c.slug}
              className="p-5 bg-white border border-ink-200 rounded-md scroll-mt-20"
            >
              <h2 className="text-xl font-bold text-ink-900 text-balance">
                {c.name}
              </h2>
              <p className="mt-2 text-sm text-ink-600 text-pretty">{c.shortDesc}</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Triệu chứng</h3>
                  <ul className="list-disc pl-5 space-y-0.5 text-ink-700">
                    {c.symptoms.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Yếu tố nguy cơ</h3>
                  <ul className="list-disc pl-5 space-y-0.5 text-ink-700">
                    {c.riskFactors.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Tầm soát</h3>
                  <p className="text-ink-700">{c.screening}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">Điều trị</h3>
                  <p className="text-ink-700">{c.treatment}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-md">
                <h3 className="text-sm font-semibold text-success-900 mb-1">Phòng ngừa</h3>
                <p className="text-sm text-success-800">{c.prevention}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}