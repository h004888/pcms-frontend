// =====================================================
// PolicyPage — shared layout for 4 policy pages
// Uses Prose component for long-form legal text
// Highlights a "last updated" + table of contents
// =====================================================

import { StaticPageLayout, Prose } from '@/components/shop';
import Link from 'next/link';
import { Calendar, ArrowUp } from 'lucide-react';

export interface PolicySection {
  id: string;
  title: string;
  body: React.ReactNode;
}

export interface PolicyPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export function PolicyPage({ title, description, lastUpdated, sections }: PolicyPageProps) {
  return (
    <StaticPageLayout
      title={title}
      description={description}
      breadcrumbs={[{ label: 'Chính sách' }, { label: title }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 lg:gap-12">
        {/* Main content */}
        <div>
          {/* Last updated badge */}
          <div className="mb-6 flex items-center gap-2 text-xs text-ink-500">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              Cập nhật lần cuối: <strong className="text-ink-700 font-mono">{lastUpdated}</strong>
            </span>
          </div>

          <Prose>
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-20">
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </Prose>

          {/* Back to top */}
          <div className="mt-12 pt-6 border-t border-ink-200 text-center">
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent-700 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              Về đầu trang
            </a>
          </div>
        </div>

        {/* Sticky TOC sidebar (desktop) */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Mục lục"
            className="sticky top-24 p-4 bg-ink-50 border border-ink-200 rounded-md"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
              Mục lục
            </h2>
            <ol className="space-y-2">
              {sections.map((s, idx) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-ink-700 hover:text-accent-700 transition-colors leading-snug block"
                  >
                    <span className="text-ink-400 font-mono mr-1.5">{idx + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </StaticPageLayout>
  );
}
