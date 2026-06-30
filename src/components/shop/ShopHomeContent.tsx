// =====================================================
// ShopHomeContent — Orchestrator cho SHOP-HOME
// Bỏ TrustStrip (merge vào Hero), gộp Video+StoreLocator
// =====================================================

import { ShopHomeHero } from '@/components/shop/ShopHomeHero';
import { ShopFlashSaleBanner } from '@/components/shop/ShopFlashSaleBanner';
import { ShopHomeCategories } from '@/components/shop/ShopHomeCategories';
import { ShopHomeBestseller } from '@/components/shop/ShopHomeBestseller';
import { ShopHomeHealthTools } from '@/components/shop/ShopHomeHealthTools';
import { ShopHomeStoreLocator } from '@/components/shop/ShopHomeStoreLocator';
import { ShopHomeShortVideos } from '@/components/shop/ShopHomeShortVideos';

export function ShopHomeContent() {
  return (
    <>
      <ShopHomeHero />
      <ShopFlashSaleBanner />
      <ShopHomeCategories />
      <ShopHomeBestseller />
      <ShopHomeHealthTools />

      {/* Utilities section — ghép Video + Store Locator */}
      <section className="bg-white border-b border-ink-200" aria-label="Tiện ích">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-8">
            <ShopHomeShortVideos />
            <ShopHomeStoreLocator />
          </div>
        </div>
      </section>
    </>
  );
}
