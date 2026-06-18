// =====================================================
// Shop components barrel export
// =====================================================

// Shop home sections (vivid edition)
export { ShopTrustStrip } from './ShopTrustStrip';
export { ShopFlashSaleBanner } from './ShopFlashSaleBanner';


// PWA infrastructure
export { PWAProvider } from './PWAProvider';
export { OfflineBanner } from './OfflineBanner';
export { PWAInstallPrompt } from './PWAInstallPrompt';
export { PWABadge } from './PWABadge';

// Layout atoms
export { PublicHeader } from './PublicHeader';
export { PublicFooter } from './PublicFooter';
export { MobileBottomNav } from './MobileBottomNav';

// Page templates
export { StaticPageLayout, Prose } from './StaticPageLayout';
export { PolicyPage } from './PolicyPage';
export type { PolicySection, PolicyPageProps } from './PolicyPage';

// Catalog molecules
export { HeroBanner } from './HeroBanner';
export { ProductCard } from './ProductCard';
export { CategoryTile } from './CategoryTile';
export { ProductGrid } from './ProductGrid';
export { FilterSidebar } from './FilterSidebar';
export type {
  Facet,
  ProductFacets,
  ActiveFilters,
  FilterSidebarProps,
} from './FilterSidebar';
