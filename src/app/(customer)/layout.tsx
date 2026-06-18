// =====================================================
// CustomerLayout — wrapper cho B2C e-commerce routes
// URL prefix: /customer/*
// Composes: PublicHeader + page content + PublicFooter + MobileBottomNav
// Wrap children in CartProvider để header badge đồng bộ với PDP/Cart page
// =====================================================

import { PublicHeader, PublicFooter, MobileBottomNav } from '@/components/shop';
import { CartProvider } from '@/lib/shop/cart-context';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[var(--pcms-bg)]">
        <PublicHeader />
        <main className="flex-1 pb-14 md:pb-0">{children}</main>
        <PublicFooter />
        <MobileBottomNav />
      </div>
    </CartProvider>
  );
}