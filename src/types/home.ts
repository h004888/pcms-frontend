// =====================================================
// PCMS Home Page DTOs (mirror backend HomePageResponse + partners)
// =====================================================

export interface HomeBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export interface BestSeller {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  imageUrl: string;
  soldCount: number;
}

export interface CategoryTeaser {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface VideoTeaser {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeId: string;
}

export interface HealthQuizTeaser {
  available: boolean;
  url: string;
}

export interface QuickLink {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface HomePageResponse {
  heroBanners: HomeBanner[];
  subPromos: HomeBanner[];
  bestSellers: BestSeller[];
  featuredCategories: CategoryTeaser[];
  brands: Brand[];
  healthQuizTeaser: HealthQuizTeaser;
  videosTeaser: VideoTeaser[];
  quickLinks: QuickLink[];
}

export interface FlashSale {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  items?: FlashSaleItem[];
}

export interface FlashSaleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

export interface HealthArticle {
  id: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  viewCount: number;
  status: string;
}

export interface Disease {
  id: string;
  slug: string;
  name: string;
  body: string;
  targetAudience: 'MALE' | 'FEMALE' | 'ELDERLY' | 'CHILD' | 'ALL';
  severity?: string;
  season?: string;
}

export interface HomeBannerAdmin {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'DELETED';
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
}
