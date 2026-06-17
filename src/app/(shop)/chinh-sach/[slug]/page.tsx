// =====================================================
// /chinh-sach/[slug] — Dynamic policy page
// Handles 4 slugs: giao-hang, doi-tra, bao-mat, tos
// =====================================================

import { PolicyPage } from '@/components/shop';
import { getPolicyBySlug, POLICIES } from '@/data/policies';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const policy = getPolicyBySlug(params.slug);
  if (!policy) return { title: 'Không tìm thấy' };
  return {
    title: policy.title,
    description: policy.description,
  };
}

export default function PolicyPageRoute({ params }: PageProps) {
  const policy = getPolicyBySlug(params.slug);
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
