// =====================================================
// ShopLayout — wrapper cho các trang tĩnh B2C
// (gioi-thieu, chinh-sach, tuyen-dung, tin-tuc-su-kien)
// =====================================================

import { LongChauHeader, LongChauFooter } from '@/components/shop/LongChauLayout';
import { LongChauMobileBottomNav } from '@/components/shop/LongChauMobileBottomNav';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <LongChauHeader />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <LongChauFooter />
      <LongChauMobileBottomNav />
    </div>
  );
}
