// =====================================================
// Mock data: Stores / Branches
// Dùng cho /he-thong-cua-hang (STORE-LOCATOR)
// =====================================================

export interface StoreHours {
  day: string; // 'T2', 'T3', ...
  open: string; // '06:00'
  close: string; // '23:00'
}

export interface Store {
  id: string;
  name: string;
  province: string; // slug
  provinceName: string;
  district: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hours: StoreHours[];
  services: string[]; // 'bán thuốc', 'tư vấn', 'tiêm chủng', 'đo huyết áp'
  isFlagship: boolean;
}

const DEFAULT_HOURS: StoreHours[] = [
  { day: 'T2', open: '06:00', close: '23:00' },
  { day: 'T3', open: '06:00', close: '23:00' },
  { day: 'T4', open: '06:00', close: '23:00' },
  { day: 'T5', open: '06:00', close: '23:00' },
  { day: 'T6', open: '06:00', close: '23:00' },
  { day: 'T7', open: '06:00', close: '23:00' },
  { day: 'CN', open: '06:00', close: '23:00' },
];

export const STORES: Store[] = [
  {
    id: 'store-hcm-q1',
    name: 'PCMS Quận 1',
    province: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    address: '12 Lê Lợi, Bến Nghé',
    phone: '028-1234-5678',
    lat: 10.7769,
    lng: 106.7009,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn', 'đo huyết áp'],
    isFlagship: true,
  },
  {
    id: 'store-hcm-q3',
    name: 'PCMS Quận 3',
    province: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh',
    district: 'Quận 3',
    address: '456 Võ Văn Tần',
    phone: '028-2345-6789',
    lat: 10.7831,
    lng: 106.6892,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn'],
    isFlagship: false,
  },
  {
    id: 'store-hcm-binh-thanh',
    name: 'PCMS Bình Thạnh',
    province: 'ho-chi-minh',
    provinceName: 'TP. Hồ Chí Minh',
    district: 'Bình Thạnh',
    address: '78 Xô Viết Nghệ Tĩnh',
    phone: '028-3456-7890',
    lat: 10.8014,
    lng: 106.7101,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn', 'tiêm chủng'],
    isFlagship: false,
  },
  {
    id: 'store-hn-ba-dinh',
    name: 'PCMS Ba Đình',
    province: 'ha-noi',
    provinceName: 'Hà Nội',
    district: 'Ba Đình',
    address: '15 Lý Thường Kiệt',
    phone: '024-1111-2222',
    lat: 21.0285,
    lng: 105.8542,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn', 'tiêm chủng'],
    isFlagship: true,
  },
  {
    id: 'store-hn-cau-giay',
    name: 'PCMS Cầu Giấy',
    province: 'ha-noi',
    provinceName: 'Hà Nội',
    district: 'Cầu Giấy',
    address: '234 Trần Thái Tông',
    phone: '024-3333-4444',
    lat: 21.0291,
    lng: 105.7848,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn'],
    isFlagship: false,
  },
  {
    id: 'store-dn-hai-chau',
    name: 'PCMS Hải Châu',
    province: 'da-nang',
    provinceName: 'Đà Nẵng',
    district: 'Hải Châu',
    address: '67 Bạch Đằng',
    phone: '0236-555-6666',
    lat: 16.0544,
    lng: 108.2022,
    hours: DEFAULT_HOURS,
    services: ['bán thuốc', 'tư vấn', 'tiêm chủng'],
    isFlagship: true,
  },
];

export const PROVINCES = [
  { slug: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', count: 0 },
  { slug: 'ha-noi', name: 'Hà Nội', count: 0 },
  { slug: 'da-nang', name: 'Đà Nẵng', count: 0 },
];

// Auto-compute counts
PROVINCES.forEach((p) => {
  p.count = STORES.filter((s) => s.province === p.slug).length;
});

export function getStoresByProvince(province: string): Store[] {
  return STORES.filter((s) => s.province === province);
}

export function getStoreById(id: string): Store | undefined {
  return STORES.find((s) => s.id === id);
}