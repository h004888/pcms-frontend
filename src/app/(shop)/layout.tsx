// =====================================================
// ShopLayout — wrapper for all B2C (customer) routes
// Composes: PublicHeader (sticky) + page content + PublicFooter + MobileBottomNav
// Spacing accounts for the fixed mobile bottom nav
// Wrap children in CartProvider để header badge đồng bộ với PDP/Cart page
// =====================================================

import { PublicHeader, PublicFooter, MobileBottomNav } from '@/components/shop';
import { CartProvider } from '@/lib/shop/cart-context';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[var(--pcms-bg)]">
        <PublicHeader />
        {/*
          Main content area:
          - On mobile: extra bottom padding to clear the fixed bottom nav (h-14 = 56px)
          - On desktop: no extra padding (bottom nav is hidden)
        */}
        <main className="flex-1 pb-14 md:pb-0">
          {children}
        </main>
        <PublicFooter />
        <MobileBottomNav />
      </div>
    </CartProvider>
  );
}
