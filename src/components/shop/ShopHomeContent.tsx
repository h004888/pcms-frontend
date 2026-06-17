// =====================================================
// ShopHomeContent — Shared content cho SHOP-HOME
// Dùng ở cả /(shop)/page.tsx (URL /) và /(customer)/page.tsx (URL /customer)
// Tránh duplicate 6 component imports ở 2 chỗ
// =====================================================

import { ShopHomeHero } from '@/components/shop/ShopHomeHero';
import { ShopHomeCategories } from '@/components/shop/ShopHomeCategories';
import { ShopHomeBestseller } from '@/components/shop/ShopHomeBestseller';
import { ShopHomeHealthTools } from '@/components/shop/ShopHomeHealthTools';
import { ShopHomeStoreLocator } from '@/components/shop/ShopHomeStoreLocator';
import { ShopHomeShortVideos } from '@/components/shop/ShopHomeShortVideos';

export function ShopHomeContent() {
  return (
    <>
      <ShopHomeHero />
      <ShopHomeCategories />
      <ShopHomeBestseller />
      <ShopHomeHealthTools />
      <ShopHomeStoreLocator />
      <ShopHomeShortVideos />
    </>
  );
}
