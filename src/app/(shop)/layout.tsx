// =====================================================
// ShopLayout — wrapper cho các trang tĩnh B2C
// (gioi-thieu, chinh-sach, tuyen-dung, tin-tuc-su-kien)
// CartProvider đã được wrap ở root layout nên không cần ở đây
// =====================================================

import { PublicHeader, PublicFooter, MobileBottomNav } from '@/components/shop';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--pcms-bg)]">
      <PublicHeader />
      {/* Main content area với bottom padding cho mobile bottom nav */}
      <main className="flex-1 pb-14 md:pb-0">
        {children}
      </main>
      <PublicFooter />
      <MobileBottomNav />
    </div>
  );
}
