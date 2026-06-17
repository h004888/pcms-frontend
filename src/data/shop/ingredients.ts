// =====================================================
// Mock data: Hoạt chất / Dược chất (Ingredients)
// Tra cứu thông tin hoạt chất: công thức, tác dụng, thuốc chứa
// =====================================================

export type IngredientCategory =
  | 'giảm đau'
  | 'kháng sinh'
  | 'vitamin'
  | 'khoáng chất'
  | 'tim mạch'
  | 'tiêu hóa'
  | 'thần kinh'
  | 'hormone';

export interface Ingredient {
  slug: string;
  name: string;
  latinName?: string;
  category: IngredientCategory;
  formula?: string; // công thức hóa học
  description: string; // mô tả ngắn
  mechanism: string; // cơ chế tác dụng
  indications: string[]; // chỉ định
  dosage: string; // liều dùng tham khảo
  sideEffects: string;
  contraindications: string; // chống chỉ định
  interactions: string[]; // tương tác thuốc
  relatedProducts: string[]; // productIds trong catalog
  relatedIngredientSlugs: string[];
}

export const INGREDIENTS: Ingredient[] = [
  {
    slug: 'paracetamol',
    name: 'Paracetamol',
    latinName: 'Acetaminophen',
    category: 'giảm đau',
    formula: 'C₈H₉NO₂',
    description:
      'Paracetamol (acetaminophen) là thuốc giảm đau, hạ sốt phổ biến. Là lựa chọn hàng đầu cho đau nhẹ-vừa và sốt ở mọi lứa tuổi.',
    mechanism:
      'Ức chế enzyme cyclooxygenase (COX) ở thần kinh trung ương, giảm tổng hợp prostaglandin — chất trung gian gây đau và sốt. Không có tác dụng chống viêm rõ rệt ngoại biên.',
    indications: [
      'Đau đầu, đau răng, đau cơ, đau khớp',
      'Đau bụng kinh',
      'Hạ sốt trong cảm cúm, nhiễm trùng',
      'Đau sau phẫu thuật nhẹ',
    ],
    dosage:
      'Người lớn & trẻ > 12 tuổi: 500mg – 1g mỗi 4–6 giờ, tối đa 4g/24h. Trẻ 6–12 tuổi: 250–500mg. Trẻ < 6 tuổi: theo cân nặng (10–15 mg/kg).',
    sideEffects:
      'Hiếm gặp ở liều điều trị. Quá liều (> 10g/24h ở người lớn) gây hoại tử tế bào gan — cần nhập viện cấp cứu.',
    contraindications:
      'Suy gan nặng, dị ứng paracetamol, nghiện rượu. Thận trọng với bệnh nhân suy thận.',
    interactions: [
      'Rượu: tăng độc tính gan',
      'Warfarin: tăng INR khi dùng liều cao kéo dài',
      'Isoniazid: tăng nguy cơ độc gan',
    ],
    relatedProducts: ['prod-1', 'prod-2'],
    relatedIngredientSlugs: ['ibuprofen'],
  },
  {
    slug: 'amoxicillin',
    name: 'Amoxicillin',
    latinName: 'Amoxicillin trihydrate',
    category: 'kháng sinh',
    formula: 'C₁₆H₁₉N₃O₅S',
    description:
      'Amoxicillin là kháng sinh nhóm beta-lactam phổ rộng, dùng điều trị nhiều loại nhiễm trùng do vi khuẩn nhạy cảm.',
    mechanism:
      'Ức chế tổng hợp vách tế bào vi khuẩn bằng cách gắn vào penicillin-binding proteins (PBP), gây ly giải và chết tế bào.',
    indications: [
      'Nhiễm trùng đường hô hấp trên (viêm họng, viêm xoang, viêm tai giữa)',
      'Viêm phổi cộng đồng',
      'Nhiễm trùng tiết niệu',
      'Nhiễm trùng da và mô mềm',
    ],
    dosage:
      'Người lớn: 250–500mg mỗi 8 giờ, hoặc 500–875mg mỗi 12 giờ. Trẻ em: 25–50 mg/kg/ngày chia 3 lần. Thời gian điều trị 5–7 ngày (có thể 10–14 ngày tùy bệnh).',
    sideEffects:
      'Buồn nôn, tiêu chảy, phát ban. Hiếm: phản ứng phản vệ, viêm đại tràng giả mạc.',
    contraindications:
      'Dị ứng với penicillin hoặc beta-lactam. Thận trọng với bệnh nhân có tiền sử dị ứng thuốc.',
    interactions: [
      'Methotrexate: giảm thải trừ, tăng độc tính',
      'Probenecid: tăng nồng độ amoxicillin',
      'Thuốc tránh thai: giảm hiệu quả (gây tranh cãi)',
    ],
    relatedProducts: ['prod-2'],
    relatedIngredientSlugs: ['paracetamol'],
  },
  {
    slug: 'vitamin-c',
    name: 'Vitamin C (Acid Ascorbic)',
    latinName: 'Ascorbic acid',
    category: 'vitamin',
    formula: 'C₆H₈O₆',
    description:
      'Vitamin C là vitamin tan trong nước, chống oxy hóa mạnh, cần thiết cho tổng hợp collagen, hấp thu sắt, và chức năng miễn dịch.',
    mechanism:
      'Cofactor cho các enzyme prolyl hydroxylase và lysyl hydroxylase cần cho tổng hợp collagen. Chống oxy hóa bằng cách nhường electron, trung hòa gốc tự do.',
    indications: [
      'Phòng và điều trị thiếu hụt vitamin C (bệnh scorbut)',
      'Tăng cường sức đề kháng',
      'Hỗ trợ hấp thu sắt (đặc biệt sắt non-heme)',
      'Phục hồi sau ốm, phẫu thuật',
    ],
    dosage:
      'Bổ sung hằng ngày: 75–90 mg (người lớn). Hút thuốc: +35 mg/ngày. Liều điều trị: 500–1000 mg/ngày chia 2–3 lần. Không vượt 2000 mg/ngày.',
    sideEffects:
      'Liều cao (> 1g/ngày) có thể gây rối loạn tiêu hóa, sỏi thận oxalate, tăng hấp thu sắt quá mức.',
    contraindications:
      'Sỏi thận oxalate, suy thận, bệnh tan máu (G6PD), thalassemia.',
    interactions: [
      'Sắt: tăng hấp thu (lợi)',
      'Warfarin: liều cao có thể giảm tác dụng',
      'Aspirin: giảm bài tiết aspirin',
    ],
    relatedProducts: ['prod-3'],
    relatedIngredientSlugs: ['canxi'],
  },
  {
    slug: 'omega-3',
    name: 'Omega-3 (EPA & DHA)',
    latinName: 'Eicosapentaenoic acid, Docosahexaenoic acid',
    category: 'tim mạch',
    description:
      'Omega-3 là axit béo không no chuỗi dài, thiết yếu, có nhiều trong cá hồi, cá thu, dầu cá. Hai dạng hoạt tính sinh học chính là EPA và DHA.',
    mechanism:
      'EPA là tiền chất của series-3 prostaglandin và series-5 leukotrien (chống viêm), giảm triglyceride huyết thanh. DHA quan trọng cho cấu trúc màng tế bào thần kinh và võng mạc.',
    indications: [
      'Tăng triglyceride máu (chỉ định chính)',
      'Phòng ngừa bệnh tim mạch (thứ phát)',
      'Hỗ trợ phát triển trí nhớ, thị lực',
      'Giảm viêm mạn (viêm khớp dạng thấp)',
    ],
    dosage:
      '1–4 g EPA + DHA/ngày tùy chỉ định. Phòng bệnh: 250–500 mg/ngày. Tăng triglyceride: 2–4 g/ngày chia 2 lần. Uống cùng bữa ăn có chất béo để tăng hấp thu.',
    sideEffects:
      'Ợ tanh, đầy bụng, tiêu chảy (liều cao). Tăng nguy cơ chảy máu khi dùng cùng thuốc chống đông.',
    contraindications:
      'Dị ứng cá/hải sản, đang dùng thuốc chống đông liều cao. Thận trọng trước phẫu thuật (ngưng 2 tuần trước).',
    interactions: [
      'Warfarin/heparin: tăng nguy cơ chảy máu',
      'Thuốc hạ áp: tăng nhẹ tác dụng',
      'Vitamin E: cạnh tranh hấp thu',
    ],
    relatedProducts: ['prod-4'],
    relatedIngredientSlugs: ['canxi', 'vitamin-c'],
  },
  {
    slug: 'canxi',
    name: 'Canxi (Calcium)',
    latinName: 'Calcium carbonate',
    category: 'khoáng chất',
    formula: 'CaCO₃',
    description:
      'Canxi là khoáng chất phong phú nhất trong cơ thể, thành phần chính của xương và răng. Quan trọng cho co cơ, dẫn truyền thần kinh, đông máu.',
    mechanism:
      'Cấu trúc tinh thể hydroxyapatite trong xương. Ion Ca²⁺ ngoại bào đóng vai trò co cơ, phát tín hiệu tế bào, giải phóng neurotransmitter và hormone.',
    indications: [
      'Phòng và điều trị loãng xương',
      'Bổ sung cho phụ nữ mang thai, cho con bú',
      'Trẻ em đang tăng trưởng',
      'Người lớn tuổi, mãn kinh',
    ],
    dosage:
      'Nhu cầu hằng ngày: 1000–1200 mg (người lớn). Bổ sung: 500–600 mg/lần, 2 lần/ngày cùng bữa ăn. Không dùng quá 500–600 mg/lần (hấp thu kém).',
    sideEffects:
      'Táo bón, đầy bụng, sỏi thận (hiếm khi dùng đúng liều). Tăng canxi máu khi quá liều.',
    contraindications:
      'Tăng canxi máu, sỏi thận canxi, suy thận nặng.',
    interactions: [
      'Sắt: cạnh tranh hấp thu (uống cách nhau 2 giờ)',
      'Tetracycline, quinolone: giảm hấp thu kháng sinh',
      'Levothyroxine: giảm hấp thu hormone giáp',
      'Vitamin D: tăng hấp thu canxi (lợi)',
    ],
    relatedProducts: ['prod-5'],
    relatedIngredientSlugs: ['vitamin-c', 'omega-3'],
  },
  {
    slug: 'ibuprofen',
    name: 'Ibuprofen',
    latinName: 'Ibuprofenum',
    category: 'giảm đau',
    formula: 'C₁₃H₁₈O₂',
    description:
      'Ibuprofen là NSAID (thuốc chống viêm không steroid) dùng giảm đau, hạ sốt, chống viêm. Hiệu quả hơn paracetamol cho đau có viêm.',
    mechanism:
      'Ức chế không chọn lọc enzyme COX-1 và COX-2, giảm tổng hợp prostaglandin ở cả trung ương và ngoại biên.',
    indications: [
      'Đau khớp, viêm khớp dạng thấp',
      'Đau đầu, đau răng, đau cơ',
      'Thống kinh',
      'Hạ sốt (khi paracetamol không hiệu quả)',
    ],
    dosage:
      'Người lớn: 200–400 mg mỗi 4–6 giờ, tối đa 1200 mg/ngày (OTC) hoặc 2400 mg/ngày (kê đơn). Uống cùng thức ăn để giảm kích ứng dạ dày.',
    sideEffects:
      'Đau dạ dày, buồn nôn, loét dạ dày, tăng men gan, tăng huyết áp, suy thận (dùng lâu dài).',
    contraindications:
      'Loét dạ dày tá tràng tiến triển, suy thận nặng, 3 tháng cuối thai kỳ, dị ứng NSAID.',
    interactions: [
      'Warfarin: tăng nguy cơ chảy máu',
      'ACEI, ARB: giảm tác dụng hạ áp, tăng nguy cơ suy thận',
      'Lithium: tăng nồng độ lithium',
      'Methotrexate: tăng độc tính',
    ],
    relatedProducts: [],
    relatedIngredientSlugs: ['paracetamol'],
  },
];

export const INGREDIENT_CATEGORIES: { id: IngredientCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'giảm đau', label: 'Giảm đau' },
  { id: 'kháng sinh', label: 'Kháng sinh' },
  { id: 'vitamin', label: 'Vitamin' },
  { id: 'khoáng chất', label: 'Khoáng chất' },
  { id: 'tim mạch', label: 'Tim mạch' },
  { id: 'tiêu hóa', label: 'Tiêu hóa' },
  { id: 'thần kinh', label: 'Thần kinh' },
  { id: 'hormone', label: 'Hormone' },
];

export function getIngredientBySlug(slug: string): Ingredient | null {
  return INGREDIENTS.find((i) => i.slug === slug) ?? null;
}

export function getIngredientsByCategory(category: IngredientCategory | 'all'): Ingredient[] {
  if (category === 'all') return INGREDIENTS;
  return INGREDIENTS.filter((i) => i.category === category);
}

export function searchIngredients(query: string): Ingredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return INGREDIENTS;
  return INGREDIENTS.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.latinName?.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
  );
}
