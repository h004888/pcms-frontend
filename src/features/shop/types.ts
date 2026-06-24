// =====================================================
// PCMS - Shop feature types (customer-portal-service)
// =====================================================

export interface ShopHomeData {
  hero?: {
    title: string;
    subtitle: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    icon?: string;
  }>;
  bestsellers?: Array<{
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    imageUrl?: string;
    slug: string;
  }>;
  flashSale?: {
    id: string;
    endsAt: string;
    products: Array<{
      id: string;
      name: string;
      price: number;
      oldPrice?: number;
      discountPercent: number;
    }>;
  };
  healthTools?: Array<{
    id: string;
    title: string;
    slug: string;
    icon?: string;
  }>;
  stores?: Array<{
    id: string;
    name: string;
    address: string;
    distance?: number;
  }>;
  videos?: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    duration: number;
  }>;
}

export interface ShopSearchResult {
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
    manufacturer?: string;
  }>;
  total: number;
  suggestions?: string[];
}

export interface DrugLookupResult {
  id: string;
  name: string;
  registrationNumber?: string;
  manufacturer?: string;
  activeIngredient?: string;
  dosage?: string;
  indication?: string;
}