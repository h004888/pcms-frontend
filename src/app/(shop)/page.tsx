// =====================================================
// / (B2C root) — SHOP-HOME
// Composes: Hero + Categories + Bestseller + Health Tools + Store Locator + Videos
// Brand: PCMS portal nội bộ (dược sĩ, kê đơn, tồn kho)
// =====================================================

import { ShopHomeHero } from '@/components/shop/ShopHomeHero';
import { ShopHomeCategories } from '@/components/shop/ShopHomeCategories';
import { ShopHomeBestseller } from '@/components/shop/ShopHomeBestseller';
import { ShopHomeHealthTools } from '@/components/shop/ShopHomeHealthTools';
import { ShopHomeStoreLocator } from '@/components/shop/ShopHomeStoreLocator';
import { ShopHomeShortVideos } from '@/components/shop/ShopHomeShortVideos';

export default function ShopHomePage() {
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
