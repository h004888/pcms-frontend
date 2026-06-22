// =====================================================
// PCMS - Mock Users seed (20 records, mix 5 roles)
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_BRANCHES } from './branches';
import type { UserStatus } from '@/types/common';

export type UserRole =
  | 'ADMIN'
  | 'CEO'
  | 'BRANCH_MANAGER'
  | 'PHARMACIST'
  | 'CUSTOMER';

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  branchId: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Lấy 3 branch UUID làm việc với (uuid tĩnh để seed customer/medicine liên kết được)
export const branchHcm = SEED_BRANCHES[0].id;
export const branchHn = SEED_BRANCHES[2].id;
export const branchDn = SEED_BRANCHES[4].id;

function user(
  role: UserRole,
  fullName: string,
  email: string,
  branchId: string | null,
  status: UserStatus = 'ACTIVE'
): MockUser {
  return {
    id: uuid(),
    email,
    fullName,
    phone: '090' + Math.floor(1000000 + Math.random() * 8999999),
    role,
    branchId,
    status,
    lastLoginAt: '2026-06-22T08:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  };
}

export const SEED_USERS: MockUser[] = [
  // Hard-coded well-known IDs cho admin + 2 pharmacist (để login dễ nhớ)
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@pcms.vn',
    fullName: 'System Administrator',
    phone: '0901234567',
    role: 'ADMIN',
    branchId: null,
    status: 'ACTIVE',
    lastLoginAt: '2026-06-22T10:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'pharmacist01@pcms.vn',
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    role: 'PHARMACIST',
    branchId: branchHcm,
    status: 'ACTIVE',
    lastLoginAt: '2026-06-22T09:30:00Z',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-06-22T09:30:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'ceo@pcms.vn',
    fullName: 'Trần Thị Mai',
    phone: '0933456789',
    role: 'CEO',
    branchId: null,
    status: 'ACTIVE',
    lastLoginAt: '2026-06-22T07:45:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T07:45:00Z',
  },
  user('BRANCH_MANAGER', 'Lê Hoàng Nam', 'manager.hcm@pcms.vn', branchHcm),
  user('BRANCH_MANAGER', 'Phạm Thị Hương', 'manager.hn@pcms.vn', branchHn),
  user('PHARMACIST', 'Đỗ Quang Minh', 'pharmacist02@pcms.vn', branchHcm),
  user('PHARMACIST', 'Hoàng Thị Lan', 'pharmacist03@pcms.vn', branchHn),
  user('PHARMACIST', 'Vũ Đình Khoa', 'pharmacist04@pcms.vn', branchDn),
  user('PHARMACIST', 'Bùi Thanh Tùng', 'pharmacist05@pcms.vn', branchHcm),
  user('PHARMACIST', 'Ngô Bích Ngọc', 'pharmacist06@pcms.vn', branchHn, 'INACTIVE'),
  user('CUSTOMER', 'Khách hàng VIP', 'vip.customer@gmail.com', null),
  user('CUSTOMER', 'Lê Văn Cường', 'cuong.le@gmail.com', null),
  user('CUSTOMER', 'Trần Thị Dung', 'dung.tran@gmail.com', null),
  user('CUSTOMER', 'Phạm Văn Em', 'em.pham@gmail.com', null),
  user('CUSTOMER', 'Hoàng Thị Phượng', 'phuong.hoang@gmail.com', null),
  user('CUSTOMER', 'Vũ Văn Giang', 'giang.vu@gmail.com', null, 'LOCKED'),
  user('PHARMACIST', 'Đặng Thị Hoa', 'pharmacist07@pcms.vn', branchDn),
  user('BRANCH_MANAGER', 'Nguyễn Văn Hùng', 'manager.dn@pcms.vn', branchDn),
  user('CUSTOMER', 'Bùi Thị Lan', 'lan.bui@gmail.com', null),
  user('CUSTOMER', 'Đỗ Văn Khải', 'khai.do@gmail.com', null),
];
