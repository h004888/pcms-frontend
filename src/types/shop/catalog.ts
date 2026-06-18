// =====================================================
// Catalog B2C types (extend B2B Medicine types)
// Used by: SHOP-HOME, SHOP-CAT-1, SHOP-CAT-2, SHOP-PDP, SHOP-SEARCH
// =====================================================

import type { Medicine } from '@/types/medicine';

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string; // lucide-react icon name
  productCount: number;
  children?: Category[]; // For subcategories
  /**
   * Theme màu chủ đạo dùng cho card hiển thị.
   * Mỗi category có 1 theme riêng → phân biệt trực quan, không dùng cùng 1 màu.
   * Values: 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'ink'
   */
  theme?: 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'ink';
}

export interface ProductSummary {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  unit: string; // "Hộp", "Vỉ", "Chai"
  thumbnail: string;
  country: string; // "Việt Nam", "Pháp", "Mỹ"
  brand: string;
  prescriptionRequired: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating?: number;
  reviewCount?: number;
  tags?: string[]; // "Bán chạy", "Mới", "Hot"
  /**
   * Slug của danh mục cấp 1 (dùng để build URL PDP).
   * Ví dụ: product thuộc 'thuoc-giam-dau' có parent 'thuoc'
   * → categorySlug = 'thuoc' để URL là /thuoc/thuoc-giam-dau/{slug}
   * Nếu product thuộc category leaf, dùng parent.slug khi có.
   */
  categorySlug?: string;
  /** Slug của danh mục trực tiếp (cấp 2 nếu có, cấp 1 nếu không). */
  subcategorySlug?: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  shortDescription: string;
  category: { id: string; name: string; slug: string };
  ingredients: string;
  usage: string; // Chỉ định
  dosage: string; // Liều lượng
  sideEffects?: string;
  storage: string; // Bảo quản
  expiryMonths: number; // Hạn dùng từ NSX
  manufacturer: string;
  images: string[]; // Gallery
  relatedProducts?: ProductSummary[]; // Same category
  crossSellSuggestions?: ProductSummary[]; // AI suggest
}

export interface ProductReview {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ProductFilter {
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  countries?: string[];
  inStockOnly?: boolean;
  prescriptionOnly?: 'all' | 'required' | 'otc';
  rating?: number; // 4+ only
}

export type ProductSort =
  | 'best_selling'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating_desc';

export interface ProductListResponse {
  products: ProductSummary[];
  total: number;
  page: number;
  pageSize: number;
  facets?: {
    brands: { name: string; count: number }[];
    countries: { name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}

export interface SearchResponse {
  query: string;
  results: ProductSummary[];
  total: number;
  suggestions?: string[]; // Did you mean...
  semanticMatches?: { product: ProductSummary; score: number }[]; // AI matches
}
