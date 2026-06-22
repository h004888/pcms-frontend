// =====================================================
// PCMS - Mock Branches seed (5 records)
// =====================================================

import type { BranchStatus } from '@/types/common';

export interface MockBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  province: string;
  phone: string;
  email?: string;
  managerId?: string;
  status: BranchStatus;
  openHours: string;
  createdAt: string;
  updatedAt: string;
}

export const SEED_BRANCHES: MockBranch[] = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    code: 'BR-HCM-01',
    name: 'Nhà thuốc PCMS Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé',
    province: 'Hồ Chí Minh',
    phone: '02838234567',
    email: 'q1@pcms.vn',
    managerId: 'b0000003-0000-0000-0000-000000000003',
    status: 'ACTIVE',
    openHours: '07:00 - 22:00',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'b0000002-0000-0000-0000-000000000002',
    code: 'BR-HCM-02',
    name: 'Nhà thuốc PCMS Bình Thạnh',
    address: '456 Xô Viết Nghệ Tĩnh, Phường 21',
    province: 'Hồ Chí Minh',
    phone: '02838987654',
    email: 'binhthanh@pcms.vn',
    managerId: 'b0000003-0000-0000-0000-000000000003',
    status: 'ACTIVE',
    openHours: '07:30 - 22:30',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'b0000003-0000-0000-0000-000000000003',
    code: 'BR-HN-01',
    name: 'Nhà thuốc PCMS Hoàn Kiếm',
    address: '78 Tràng Tiền, Phường Tràng Tiền',
    province: 'Hà Nội',
    phone: '02439391234',
    email: 'hoankiem@pcms.vn',
    managerId: 'b0000004-0000-0000-0000-000000000004',
    status: 'ACTIVE',
    openHours: '07:00 - 23:00',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'b0000004-0000-0000-0000-000000000004',
    code: 'BR-HN-02',
    name: 'Nhà thuốc PCMS Cầu Giấy',
    address: '99 Xuân Thủy, Phường Dịch Vọng',
    province: 'Hà Nội',
    phone: '02437654321',
    email: 'caugiay@pcms.vn',
    status: 'ACTIVE',
    openHours: '07:30 - 22:00',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'b0000005-0000-0000-0000-000000000005',
    code: 'BR-DN-01',
    name: 'Nhà thuốc PCMS Hải Châu',
    address: '12 Lê Duẩn, Phường Thạch Thang',
    province: 'Đà Nẵng',
    phone: '02363889999',
    email: 'haichau@pcms.vn',
    status: 'INACTIVE',
    openHours: '08:00 - 21:30',
    createdAt: '2026-03-05T00:00:00Z',
    updatedAt: '2026-06-15T08:00:00Z',
  },
];
