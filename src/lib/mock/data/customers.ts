// =====================================================
// PCMS - Mock Customers seed (15 records)
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface MockCustomer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  status: CustomerStatus;
  points: number;
  tier: LoyaltyTier;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

const NAMES = [
  ['Nguyễn Văn Khách', '0901111222', 'MALE'],
  ['Trần Thị Hoa', '0912222333', 'FEMALE'],
  ['Lê Văn Bình', '0923333444', 'MALE'],
  ['Phạm Thị Mai', '0934444555', 'FEMALE'],
  ['Hoàng Văn Đức', '0945555666', 'MALE'],
  ['Vũ Thị Lan', '0956666777', 'FEMALE'],
  ['Đỗ Văn Minh', '0967777888', 'MALE'],
  ['Bùi Thị Ngọc', '0978888999', 'FEMALE'],
  ['Đặng Văn Phú', '0989999000', 'MALE'],
  ['Ngô Thị Quỳnh', '0990000111', 'FEMALE'],
  ['Dương Văn Sơn', '0901111333', 'MALE'],
  ['Trương Thị Tuyết', '0912222444', 'FEMALE'],
  ['Phan Văn Uy', '0923333555', 'MALE'],
  ['Lý Thị Vân', '0934444666', 'FEMALE'],
  ['Võ Văn Xuân', '0944444777', 'MALE'],
] as const;

const TIERS: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
const STATUSES: CustomerStatus[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE', 'BLOCKED'];

export const SEED_CUSTOMERS: MockCustomer[] = NAMES.map(([name, phone, gender], i) => ({
  id: uuid(),
  code: `CUST-2026${String(i + 1).padStart(4, '0')}`,
  name,
  phone,
  email: `${name.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@gmail.com`,
  address: `${i + 10} Lý Tự Trọng, Quận ${(i % 12) + 1}, TP.HCM`,
  dob: `19${70 + (i % 30)}-0${(i % 9) + 1}-15`,
  gender: gender as Gender,
  status: STATUSES[i % STATUSES.length],
  points: Math.floor(Math.random() * 5000),
  tier: TIERS[i % TIERS.length],
  totalSpent: Math.floor(Math.random() * 20_000_000),
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-06-22T10:00:00Z',
}));
