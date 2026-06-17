// =====================================================
// ShopHomeHealthTools — Bài kiểm tra sức khỏe nhanh
// =====================================================

import Link from 'next/link';
import { Brain, Droplet, Heart, Wind, Activity, Stethoscope, Pill, ShieldCheck } from 'lucide-react';

const QUIZZES = [
  { slug: 'tri-nho', label: 'Trí nhớ & Tập trung', icon: Brain, color: 'text-info-600 bg-info-50' },
  { slug: 'tien-dai-thao-duong', label: 'Tiền đái tháo đường', icon: Droplet, color: 'text-primary-600 bg-primary-50' },
  { slug: 'suy-giap', label: 'Suy giáp', icon: ShieldCheck, color: 'text-accent-600 bg-accent-50' },
  { slug: 'hen', label: 'Kiểm soát hen (ACT)', icon: Wind, color: 'text-info-700 bg-info-100' },
  { slug: 'tim-mach', label: 'Nguy cơ tim mạch', icon: Heart, color: 'text-danger-600 bg-danger-50' },
  { slug: 'alzheimer', label: 'Nguy cơ Alzheimer', icon: Brain, color: 'text-warning-600 bg-warning-50' },
  { slug: 'gerd', label: 'Trào ngược dạ dày', icon: Pill, color: 'text-warning-700 bg-warning-100' },
  { slug: 'binh-xit', label: 'Phụ thuộc bình xịt', icon: Stethoscope, color: 'text-success-600 bg-success-50' },
];

export function ShopHomeHealthTools() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"
      aria-labelledby="health-tools-title"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-success-50 text-success-700 text-xs font-semibold rounded-full mb-2">
            <Activity className="w-3 h-3" aria-hidden="true" />
            Miễn phí · 5 phút
          </div>
          <h2
            id="health-tools-title"
            className="text-2xl font-bold text-ink-900 tracking-tight text-balance"
          >
            Bài kiểm tra sức khỏe
          </h2>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tự đánh giá nhanh, nhận gợi ý từ dược sĩ
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUIZZES.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <Link
              key={quiz.slug}
              href={`/suc-khoe/kiem-tra/${quiz.slug}`}
              className="group flex items-center gap-3 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${quiz.color}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-ink-900 group-hover:text-accent-700 text-balance">
                {quiz.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
