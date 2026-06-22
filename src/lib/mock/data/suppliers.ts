// =====================================================
// PCMS - Mock Suppliers seed (12 records)
// Top nhà cung cấp dược phẩm tại VN (DHG, Traphaco, Imexpharm, ...)
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import type { SupplierStatus } from '@/types/common';

export interface MockSupplier {
  id: string;
  name: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  bankName?: string;
  bankAccount?: string;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
}

function sup(
  name: string,
  taxCode: string,
  contactPerson: string,
  phone: string,
  email: string,
  address: string,
  bankName: string,
  bankAccount: string,
  status: SupplierStatus = 'ACTIVE'
): MockSupplier {
  return {
    id: uuid(),
    name,
    taxCode,
    contactPerson,
    phone,
    email,
    address,
    bankName,
    bankAccount,
    status,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  };
}

export const SEED_SUPPLIERS: MockSupplier[] = [
  sup(
    'Công ty CP Dược Hậu Giang (DHG Pharma)',
    '0300512543',
    'Nguyễn Văn Hùng',
    '02923891234',
    'contact@dhgpharma.com.vn',
    '288 Bis Nguyễn Văn Cừ, P. An Hòa, Q. Ninh Kiều, TP. Cần Thơ',
    'Vietcombank Cần Thơ',
    '71110001234567'
  ),
  sup(
    'Công ty CP Traphaco',
    '0100108606',
    'Trần Túc Mã',
    '02436830125',
    'info@traphaco.com.vn',
    '75 Yên Ninh, P. Quán Thánh, Q. Ba Đình, TP. Hà Nội',
    'Techcombank Hà Nội',
    '10230001234567'
  ),
  sup(
    'Công ty CP Dược phẩm Imexpharm',
    '1400102609',
    'Nguyễn Quốc Định',
    '02723872468',
    'imexpharm@imexpharm.com',
    'Số 4, Đường 30/4, P. 1, TP. Cao Lãnh, Đồng Tháp',
    'BIDV Đồng Tháp',
    '60110001234567'
  ),
  sup(
    'Công ty CP Sanofi Việt Nam',
    '0300522974',
    'Phạm Thị Thanh Hương',
    '02838221690',
    'contact.vn@sanofi.com',
    'Số 10, Đường Hàm Nghi, P. Mỹ Đình 2, Q. Nam Từ Liêm, Hà Nội',
    'HSBC Việt Nam',
    '00110001234567'
  ),
  sup(
    'Công ty TNHH AstraZeneca Việt Nam',
    '0302490706',
    'Leon Wang',
    '02835228899',
    'vn.contact@astrazeneca.com',
    'Tầng 18, Tòa nhà Bitexco Financial, 2 Hải Triều, Q. 1, TP.HCM',
    'Standard Chartered VN',
    '88810001234567'
  ),
  sup(
    'Công ty TNHH GSK Việt Nam',
    '0312108423',
    'Lê Thanh Tùng',
    '02838297889',
    'vn.info@gsk.com',
    'Tầng 7, Tòa nhà Saigon Centre, 65 Lê Lợi, Q. 1, TP.HCM',
    'Citibank VN',
    '77710001234567'
  ),
  sup(
    'Công ty CP Pymepharco',
    '4400101934',
    'Trần Văn Hải',
    '02573882233',
    'pymepharco@pymepharco.com.vn',
    'Số 166 - 170 Nguyễn Huệ, TP. Tuy Hòa, Phú Yên',
    'VietinBank Phú Yên',
    '12210001234567'
  ),
  sup(
    'Công ty CP Dược phẩm Hà Tây',
    '0500239116',
    'Lê Văn Sơn',
    '02433823298',
    'hataypharma@hataypharma.vn',
    'Số 10A Quốc lộ 6, P. Phúc Lâm, Q. Hà Đông, TP. Hà Nội',
    'Agribank Hà Tây',
    '21110001234567'
  ),
  sup(
    'Công ty CP Dược phẩm Bidiphar',
    '3300101418',
    'Phạm Văn Thanh',
    '02523856234',
    'bidiphar@bidiphar.vn',
    '498 Nguyễn Du, P. Trung Đô, TP. Vinh, Nghệ An',
    'Vietcombank Nghệ An',
    '45110001234567'
  ),
  sup(
    'Công ty CP Dược phẩm OPC',
    '0300485099',
    'Nguyễn Bá Bình',
    '02838994889',
    'opc@opcpharma.com',
    'Số 1017 Nguyễn Trãi, P. 14, Q. 5, TP.HCM',
    'ACB TP.HCM',
    '32110001234567'
  ),
  sup(
    'Công ty CP SPM (Stada Việt Nam)',
    '0314567890',
    'Vũ Thị Lan',
    '02473009988',
    'stada.vn@stada.com',
    'Tầng 5, Tòa nhà Capital Place, 29 Liễu Giai, Q. Ba Đình, Hà Nội',
    'VPBank Hà Nội',
    '18810001234567',
    'INACTIVE'
  ),
  sup(
    'Công ty TNHH Merck Việt Nam',
    '0312894567',
    'Christoph Mueller',
    '02835268866',
    'vn.info@merck.com',
    'Tầng 12, Bitexco Tower, 2 Hải Triều, Q. 1, TP.HCM',
    'Deutsche Bank VN',
    '99910001234567'
  ),
];