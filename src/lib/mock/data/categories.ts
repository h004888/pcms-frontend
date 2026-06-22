// =====================================================
// PCMS - Mock Categories seed (10 records)
// Phân loại theo nhóm dược lý thông dụng tại VN
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';

export interface MockCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

function cat(
  code: string,
  name: string,
  description?: string,
  parentId: string | null = null
): MockCategory {
  return {
    id: uuid(),
    code,
    name,
    description,
    parentId,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-22T10:00:00Z',
  };
}

export const SEED_CATEGORIES: MockCategory[] = [
  cat('CAT-CAM', 'Thuốc cảm cúm & ho', 'Thuốc điều trị triệu chứng cảm, ho, sổ mũi'),
  cat('CAT-DAU', 'Thuốc giảm đau & hạ sốt', 'Paracetamol, Ibuprofen, Aspirin và các NSAID'),
  cat('CAT-KHANG-SINH', 'Kháng sinh', 'Nhóm kháng sinh phổ biến: beta-lactam, macrolid, quinolone'),
  cat('CAT-VITAMIN', 'Vitamin & thực phẩm chức năng', 'Bổ sung vitamin, khoáng chất, tăng đề kháng'),
  cat('CAT-TIEU-HOA', 'Thuốc tiêu hóa', 'Điều trị dạ dày, tá tràng, men tiêu hóa'),
  cat('CAT-TIM-MACH', 'Thuốc tim mạch & huyết áp', 'Thuốc điều trị tăng huyết áp, mỡ máu, tim mạch'),
  cat('CAT-DA-LIEU', 'Thuốc da liễu', 'Thuốc bôi ngoài da, kem dưỡng ẩm, chống nấm'),
  cat('CAT-MAT', 'Thuốc nhỏ mắt & nhãn khoa', 'Nước mắt nhân tạo, thuốc tra mắt'),
  cat('CAT-CHO-XE', 'Chăm sóc cá nhân', 'Vật tư y tế, bông băng, khẩu trang, nước rửa tay'),
  cat('CAT-KE-DON', 'Thuốc kê đơn', 'Nhóm thuốc phải có đơn từ bác sĩ (Rx-only)'),
];
