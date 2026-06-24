// =====================================================
// PCMS - Stores feature types
// =====================================================

export interface StoreLocation {
  id: string;
  name: string;
  code: string;
  address: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  services?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface StoreLocatorResponse {
  stores: StoreLocation[];
  total: number;
}