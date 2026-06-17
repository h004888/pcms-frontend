// =====================================================
// StaticPageLayout — shared layout for 7 static PAGE-* pages
// Composes: Breadcrumb + Page hero + Content blocks
// Uses editorial typography (h1 with text-balance, h2 with text-pretty)
// =====================================================

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface StaticPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  // Optional: show a tinted hero banner for the page title
  heroTone?: 'default' | 'accent';
}

export function StaticPageLayout({
  title,
  description,
  breadcrumbs,
  children,
  heroTone = 'default',
}: StaticPageLayoutProps) {
  return (
    <article className="bg-white">
      {/* Hero */}
      <header
        className={
          heroTone === 'accent'
            ? 'bg-gradient-to-br from-ink-900 to-accent-800 text-white'
            : 'bg-ink-50 border-b border-ink-200'
        }
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs flex-wrap">
              <li>
                <Link
                  href="/"
                  className={
                    heroTone === 'accent'
                      ? 'inline-flex items-center gap-1 text-accent-100 hover:text-white'
                      : 'inline-flex items-center gap-1 text-ink-500 hover:text-accent-700'
                  }
                >
                  <Home className="w-3 h-3" aria-hidden="true" />
                  Trang chủ
                </Link>
              </li>
              {breadcrumbs.map((b, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight
                    className={
                      heroTone === 'accent' ? 'w-3 h-3 text-accent-200' : 'w-3 h-3 text-ink-400'
                    }
                    aria-hidden="true"
                  />
                  {b.href ? (
                    <Link
                      href={b.href}
                      className={
                        heroTone === 'accent'
                          ? 'text-accent-100 hover:text-white'
                          : 'text-ink-500 hover:text-accent-700'
                      }
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={
                        heroTone === 'accent'
                          ? 'text-white font-medium'
                          : 'text-ink-700 font-medium'
                      }
                    >
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h1
            className={
              'text-3xl md:text-4xl font-bold tracking-tight text-balance ' +
              (heroTone === 'accent' ? 'text-white' : 'text-ink-900')
            }
          >
            {title}
          </h1>
          {description && (
            <p
              className={
                'mt-3 text-base md:text-lg max-w-3xl ' +
                (heroTone === 'accent' ? 'text-accent-100' : 'text-ink-600')
              }
            >
              {description}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {children}
      </div>
    </article>
  );
}

/** 
 * Prose container for long-form content.
 * Applies typographic rules: line length ≤ 75ch, prose-pretty, heading hierarchy.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-ink max-w-none
      prose-headings:text-ink-900 prose-headings:font-semibold prose-headings:tracking-tight
      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
      prose-p:text-ink-700 prose-p:leading-relaxed prose-p:text-pretty
      prose-a:text-accent-700 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-ink-900
      prose-li:text-ink-700
      prose-ul:my-4 prose-ol:my-4
      prose-hr:border-ink-200
      max-w-none
    ">
      {children}
    </div>
  );
}
