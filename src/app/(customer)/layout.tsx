// =====================================================
// CustomerLayout — wrapper cho B2C e-commerce routes
// URL prefix: /customer/*
// Composes: LongChauHeader + page content + LongChauFooter + LongChauMobileBottomNav
// =====================================================

import { LongChauHeader, LongChauFooter } from '@/components/shop/LongChauLayout';
import { LongChauMobileBottomNav } from '@/components/shop/LongChauMobileBottomNav';
import { CartProvider } from '@/lib/shop/cart-context';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-800">
        <LongChauHeader />
        <main className="flex-1 pb-14 md:pb-0">{children}</main>
        <LongChauFooter />
        <LongChauMobileBottomNav />
      </div>
    </CartProvider>
  );
}
