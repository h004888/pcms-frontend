// =====================================================
// PCMS - Mock Medicines seed (30 records)
// Mix categories, suppliers, statuses, giá VND
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_CATEGORIES } from './categories';

export type MedicineStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export interface MockMedicine {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  supplierId: string;
  price: number;
  unit: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  description?: string;
  manufacturer: string;
  activeIngredient: string;
  status: MedicineStatus;
  createdAt: string;
  updatedAt: string;
}

// Tạo 3 supplier UUID cố định để share giữa các medicine
const SUP_DHG = 'c0000001-0000-0000-0000-000000000001';
const SUP_TRAPHACO = 'c0000002-0000-0000-0000-000000000002';
const SUP_IMEXPHARM = 'c0000003-0000-0000-0000-000000000003';

export const SEED_MEDICINES: MockMedicine[] = [
  // Thuốc cảm cúm
  med('MD001', 'Decolgen Forte', 0, SUP_DHG, 25000, 'box', 'Paracetamol + Pseudoephedrine', 'DHG Pharma'),
  med('MD002', 'Tiffy Dey', 0, SUP_DHG, 18000, 'box', 'Paracetamol + Chlorpheniramine', 'DHG Pharma'),
  med('MD003', 'Panadol Extra', 0, SUP_IMEXPHARM, 32000, 'box', 'Paracetamol + Caffeine', 'GSK VN'),
  med('MD004', 'Efferalgan 500mg', 1, SUP_IMEXPHARM, 45000, 'box', 'Paracetamol', 'Bristol-Myers'),

  // Giảm đau
  med('MD005', 'Ibuprofen 400mg', 1, SUP_TRAPHACO, 22000, 'box', 'Ibuprofen', 'Traphaco'),
  med('MD006', 'Aspirin 81mg', 1, SUP_DHG, 15000, 'strip', 'Acetylsalicylic acid', 'Bayer VN'),
  med('MD007', 'Voltaren 50mg', 1, SUP_IMEXPHARM, 85000, 'box', 'Diclofenac', 'Novartis'),

  // Kháng sinh
  med('MD008', 'Augmentin 1g', 2, SUP_IMEXPHARM, 145000, 'box', 'Amoxicillin + Clavulanic acid', 'GSK VN', true),
  med('MD009', 'Ciprobay 500mg', 2, SUP_IMEXPHARM, 98000, 'box', 'Ciprofloxacin', 'Bayer VN', true),
  med('MD010', 'Azithromycin 500mg', 2, SUP_TRAPHACO, 75000, 'box', 'Azithromycin', 'Traphaco', true),
  med('MD011', 'Amoxicillin 500mg', 2, SUP_DHG, 35000, 'box', 'Amoxicillin', 'DHG Pharma', true),

  // Vitamin
  med('MD012', 'Vitamin C 500mg', 3, SUP_TRAPHACO, 28000, 'bottle', 'Ascorbic acid', 'Traphaco'),
  med('MD013', 'Omega-3 Fish Oil', 3, SUP_IMEXPHARM, 185000, 'bottle', 'Fish oil EPA/DHA', 'Nature Made'),
  med('MD014', 'Multivitamin Centrum', 3, SUP_IMEXPHARM, 285000, 'bottle', 'Multivitamin & minerals', 'Pfizer'),
  med('MD015', 'Vitamin D3 1000IU', 3, SUP_TRAPHACO, 95000, 'bottle', 'Cholecalciferol', 'Nature’s Bounty'),

  // Tiêu hóa
  med('MD016', 'Nexium 40mg', 4, SUP_IMEXPHARM, 165000, 'box', 'Esomeprazole', 'AstraZeneca'),
  med('MD017', 'Smecta', 4, SUP_IMEXPHARM, 55000, 'box', 'Diosmectite', 'Ipsen'),
  med('MD018', 'Enterogermina', 4, SUP_IMEXPHARM, 78000, 'box', 'Bacillus clausii', 'Sanofi'),

  // Tim mạch
  med('MD019', 'Concor 5mg', 5, SUP_IMEXPHARM, 195000, 'box', 'Bisoprolol', 'Merck', true),
  med('MD020', 'Crestor 10mg', 5, SUP_IMEXPHARM, 245000, 'box', 'Rosuvastatin', 'AstraZeneca', true),
  med('MD021', 'Amlor 5mg', 5, SUP_IMEXPHARM, 125000, 'box', 'Amlodipine', 'Pfizer', true),

  // Da liễu
  med('MD022', 'Beprosazone', 6, SUP_DHG, 45000, 'tube', 'Betamethasone', 'DHG Pharma'),
  med('MD023', 'Ketoconazole cream', 6, SUP_TRAPHACO, 38000, 'tube', 'Ketoconazole', 'Traphaco'),

  // Mắt
  med('MD024', 'Refresh Tears', 7, SUP_IMEXPHARM, 65000, 'bottle', 'Carboxymethylcellulose', 'Allergan'),
  med('MD025', 'Tobrex eye drops', 7, SUP_IMEXPHARM, 89000, 'bottle', 'Tobramycin', 'Alcon', true),

  // Chăm sóc cá nhân
  med('MD026', 'Khẩu trang y tế 4 lớp', 8, SUP_DHG, 35000, 'box', 'Không dược chất', 'DHG Pharma'),
  med('MD027', 'Bông y tế Bạch Tuyết', 8, SUP_TRAPHACO, 18000, 'pack', 'Cotton', 'Bạch Tuyết'),
  med('MD028', 'Nước rửa tay Lifebuoy', 8, SUP_DHG, 42000, 'bottle', 'Chlorhexidine', 'Unilever'),

  // Thuốc kê đơn khác
  med('MD029', 'Glucophage 500mg', 5, SUP_IMEXPHARM, 95000, 'box', 'Metformin', 'Merck', true),
  med('MD030', 'Salbutamol inhaler', 4, SUP_IMEXPHARM, 145000, 'box', 'Salbutamol', 'GSK VN', true),
];

function med(
  sku: string,
  name: string,
  catIdx: number,
  supplierId: string,
  price: number,
  unit: string,
  activeIngredient: string,
  manufacturer: string,
  prescriptionRequired = false,
  status: MedicineStatus = 'ACTIVE'
): MockMedicine {
  return {
    id: uuid(),
    sku,
    name,
    categoryId: SEED_CATEGORIES[catIdx]?.id ?? SEED_CATEGORIES[0].id,
    supplierId,
    price,
    unit,
    prescriptionRequired,
    manufacturer,
    activeIngredient,
    status,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  };
}

export const SEED_SUPPLIERS = {
  DHG: SUP_DHG,
  TRAPHACO: SUP_TRAPHACO,
  IMEXPHARM: SUP_IMEXPHARM,
};
