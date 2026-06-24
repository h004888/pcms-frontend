// =====================================================
// PCMS - Addresses feature types
// =====================================================

export interface Address {
  id: string;
  label: 'Nhà' | 'Công ty' | 'Khác';
  name: string;
  phone: string;
  line: string;
  province: string;
  isDefault: boolean;
}

export type CreateAddressRequest = Omit<Address, 'id'>;
export type UpdateAddressRequest = Partial<Address>;
