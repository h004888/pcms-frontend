// =====================================================
// Mock data: Vaccines
// Dùng cho /tiem-chung (VACCINE-HOME)
// =====================================================

export interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  price: number;
  ageRange: string; // 'Từ 6 tháng tuổi'
  description: string;
  doses: number;
  schedule: string;
  sideEffects: string;
  category: 'trẻ em' | 'người lớn' | 'phụ nữ mang thai' | 'người cao tuổi';
}

export const VACCINES: Vaccine[] = [
  {
    id: 'vac-cum',
    name: 'Vaccine Cúm mùa (Influenza)',
    manufacturer: 'Sanofi',
    origin: 'Pháp',
    price: 350000,
    ageRange: 'Từ 6 tháng tuổi',
    description: 'Phòng các chủng cúm mùa phổ biến, hiệu quả ~6-12 tháng.',
    doses: 1,
    schedule: 'Tiêm nhắc lại hàng năm',
    sideEffects: 'Đau tại chỗ, sốt nhẹ 1-2 ngày.',
    category: 'trẻ em',
  },
  {
    id: 'vac-covid',
    name: 'Vaccine COVID-19',
    manufacturer: 'AstraZeneca',
    origin: 'Anh',
    price: 0,
    ageRange: 'Từ 5 tuổi',
    description: 'Phòng COVID-19 theo khuyến cáo Bộ Y tế. Miễn phí tại các cơ sở công.',
    doses: 2,
    schedule: 'Theo lịch Bộ Y tế',
    sideEffects: 'Mệt mỏi, sốt, đau tay.',
    category: 'người lớn',
  },
  {
    id: 'vac-viem-gan-b',
    name: 'Vaccine Viêm gan B',
    manufacturer: 'GSK',
    origin: 'Anh',
    price: 250000,
    ageRange: 'Mọi lứa tuổi',
    description: 'Phòng viêm gan B — bệnh có thể dẫn đến xơ gan, ung thư gan.',
    doses: 3,
    schedule: '0, 1, 6 tháng',
    sideEffects: 'Đau tại chỗ, sốt nhẹ.',
    category: 'trẻ em',
  },
  {
    id: 'vac-uon-van',
    name: 'Vaccine Uốn ván (VAT)',
    manufacturer: 'Sanofi',
    origin: 'Pháp',
    price: 120000,
    ageRange: 'Phụ nữ mang thai',
    description: 'Phòng uốn ván cho mẹ và bé sơ sinh. Tiêm trong thai kỳ.',
    doses: 1,
    schedule: 'Tuần 27-36 thai kỳ',
    sideEffects: 'Đau tại chỗ, sốt nhẹ.',
    category: 'phụ nữ mang thai',
  },
  {
    id: 'vac-phoi-cum',
    name: 'Vaccine Phế cầu (Pneumococcal)',
    manufacturer: 'Pfizer',
    origin: 'Mỹ',
    price: 1500000,
    ageRange: 'Trẻ em, người > 65 tuổi',
    description: 'Phòng viêm phổi, viêm màng não do phế cầu khuẩn.',
    doses: 1,
    schedule: 'Tiêm 1 liều duy nhất',
    sideEffects: 'Đau tại chỗ, sốt nhẹ.',
    category: 'người cao tuổi',
  },
  {
    id: 'vac-cum-quadrivalent',
    name: 'Vaccine Cúm tứ giá',
    manufacturer: 'Abbott',
    origin: 'Mỹ',
    price: 480000,
    ageRange: 'Từ 3 tuổi',
    description: 'Phòng 4 chủng cúm A + B, hiệu quả cao hơn vaccine 3 chủng.',
    doses: 1,
    schedule: 'Hàng năm',
    sideEffects: 'Đau tay, sốt nhẹ.',
    category: 'người lớn',
  },
];

export function getVaccinesByCategory(category: Vaccine['category']): Vaccine[] {
  return VACCINES.filter((v) => v.category === category);
}

export function getVaccineById(id: string): Vaccine | undefined {
  return VACCINES.find((v) => v.id === id);
}