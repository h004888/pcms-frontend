// =====================================================
// /chinh-sach/[slug] — Dynamic policy page
// Handles 4 slugs: giao-hang, doi-tra, bao-mat, tos
// =====================================================

import { PolicyPage } from '@/components/shop';
import { getPolicyBySlug, POLICIES } from '@/data/policies';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) return { title: 'Không tìm thấy' };
  return {
    title: policy.title,
    description: policy.description,
  };
}

export default async function PolicyPageRoute({ params }: PageProps) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);
  if (!policy) notFound();

  return (
    <PolicyPage
      title={policy.title}
      description={policy.description}
      lastUpdated={policy.lastUpdated}
      sections={policy.sections}
    />
  );
}
