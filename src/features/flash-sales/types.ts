// =====================================================
// PCMS - Flash Sales feature types
// =====================================================

export interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercent: number;
  imageUrl?: string;
  slug?: string;
}

export interface FlashSale {
  id: string;
  name?: string;
  startTime?: string;
  endTime?: string;
  endsAt?: string;
  status?: string;
  products?: FlashSaleProduct[];
}