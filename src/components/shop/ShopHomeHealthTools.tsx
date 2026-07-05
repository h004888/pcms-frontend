// =====================================================
// ShopHomeHealthTools — Bài kiểm tra sức khỏe (horizontal pills)
// API: GET /health/quizzes → compact list
// =====================================================

import Link from 'next/link';
import { Brain, Heart, Droplet, Wind, ShieldCheck, Pill, Stethoscope, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fetchQuizzes } from '@/features/health-tools';

export const revalidate = 300;

const SLUG_ICONS: Record<string, LucideIcon> = {
  'tri-nho': Brain, 'tim-mach': Heart, 'tien-dai-thao-duong': Droplet,
  hen: Wind, 'suy-giap': ShieldCheck, gerd: Pill,
  alzheimer: Brain, 'binh-xit': Stethoscope,
};

export async function ShopHomeHealthTools() {
  let items: { slug: string; title: string }[] = [];
  try {
    const quizzes = await fetchQuizzes();
    items = quizzes.slice(0, 8).map((q) => ({ slug: q.slug, title: q.title }));
  } catch { return null; }
  if (items.length === 0) return null;

  return (
    <section className="bg-[#f8f9fc]" aria-label="Bài kiểm tra sức khỏe">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-ink-900">Bài kiểm tra sức khỏe</h2>
            <p className="text-sm text-ink-500 mt-0.5">Tự đánh giá nhanh, nhận gợi ý từ dược sĩ</p>
          </div>
          <Link href="/suc-khoe/kiem-tra"
            className="text-xs font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">
            Tất cả bài test →
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-none -mx-4 sm:-mx-6 lg:mx-0">
          <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-0 min-w-max">
            {items.map((quiz) => {
              const Icon = SLUG_ICONS[quiz.slug] ?? Activity;
              return (
                <Link key={quiz.slug} href={`/suc-khoe/kiem-tra/${quiz.slug}`}
                  className="press inline-flex items-center gap-2 px-4 h-10 bg-white hover:bg-accent-50 border border-ink-200 hover:border-accent-300 rounded-full text-sm font-medium text-ink-800 hover:text-accent-800 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <Icon className="w-4 h-4 text-ink-500" aria-hidden="true" />
                  {quiz.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
