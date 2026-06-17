// =====================================================
// /favorites — CUST-FAVORITES
// Sản phẩm yêu thích
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { ProductCard } from '@/components/shop/ProductCard';
import { Heart } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { stripToSummary } from '@/data/shop/_strip-to-summary';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm yêu thích',
  description: 'Danh sách sản phẩm bạn đã đánh dấu yêu thích.',
};

// Mock: 4 sản phẩm đầu tiên
const FAVORITES = PRODUCTS.slice(0, 4).map(stripToSummary);

export default function FavoritesPage() {
  if (FAVORITES.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Yêu thích' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Sản phẩm yêu thích</h1>
        <EmptyState
          icon={Heart}
          title="Chưa có sản phẩm yêu thích"
          description="Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào đây."
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Yêu thích' }]} />
      <h1 className="mt-3 text-xl font-bold text-ink-900 mb-1">Sản phẩm yêu thích</h1>
      <p className="text-sm text-ink-600 font-mono mb-4">{FAVORITES.length} sản phẩm</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FAVORITES.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}