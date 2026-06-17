// =====================================================
// Mock data: Dược liệu (Herbs)
// Tra cứu thông tin dược liệu: tên Latin, bộ phận dùng, công dụng
// =====================================================

export type HerbCategory =
  | 'rễ củ'
  | 'lá'
  | 'hoa'
  | 'quả hạt'
  | 'vỏ thân'
  | 'toàn cây';

export interface Herb {
  slug: string;
  name: string; // tên tiếng Việt
  latinName: string; // tên khoa học
  category: HerbCategory;
  parts: string[]; // bộ phận dùng
  description: string;
  traditionalUses: string[]; // công dụng theo YHCT
  activeCompounds: string[]; // hoạt chất chính
  preparation: string; // cách bào chế
  dosage: string;
  warnings: string; // cảnh báo
  relatedIngredientSlugs: string[];
}

export const HERBS: Herb[] = [
  {
    slug: 'nghe-vang',
    name: 'Nghệ vàng',
    latinName: 'Curcuma longa L.',
    category: 'rễ củ',
    parts: ['Thân rễ (rhizoma)'],
    description:
      'Nghệ vàng là cây thân thảo thuộc họ Gừng (Zingiberaceae), được trồng phổ biến ở Việt Nam. Thân rễ chứa curcumin — hoạt chất chống viêm, chống oxy hóa mạnh.',
    traditionalUses: [
      'Trị viêm loét dạ dày tá tràng',
      'Lành sẹo, liền vết thương',
      'Giảm đau bụng kinh',
      'Hỗ trợ tiêu hóa, kích thích mật',
    ],
    activeCompounds: ['Curcumin (3–5%)', 'Demethoxycurcumin', 'Tinh dầu (turmerone, atlantone)'],
    preparation:
      'Phơi khô thân rễ, nghiền thành bột. Bào chế dạng viên nang, cao, hoặc dùng tươi giã đắp ngoài da.',
    dosage:
      'Bột nghệ: 1–3 g/ngày chia 2–3 lần. Curcumin tinh khiết: 500–1000 mg/ngày. Nên uống cùng piperine (từ hạt tiêu đen) để tăng hấp thu 20 lần.',
    warnings:
      'Tránh dùng liều cao kéo dài (> 8 tuần) vì có thể gây kích ứng dạ dày. Thận trọng với người sỏi mật, đang dùng thuốc chống đông.',
    relatedIngredientSlugs: ['omega-3'],
  },
  {
    slug: 'gung',
    name: 'Gừng',
    latinName: 'Zingiber officinale Roscoe',
    category: 'rễ củ',
    parts: ['Thân rễ tươi hoặc khô'],
    description:
      'Gừng là cây gia vị và dược liệu quý, được sử dụng hàng ngàn năm trong YHCT Việt Nam và thế giới. Có tác dụng ấm, kích thích tiêu hóa, chống buồn nôn.',
    traditionalUses: [
      'Chống buồn nôn (thai kỳ, say tàu xe, sau phẫu thuật)',
      'Trị cảm lạnh, ớn lạnh',
      'Hỗ trợ tiêu hóa, giảm đầy bụng',
      'Giảm đau cơ, khớp',
    ],
    activeCompounds: ['Gingerol', 'Shogaol', 'Zingiberene', 'β-bisabolene'],
    preparation:
      'Gừng tươi: rửa sạch, thái lát, hãm nước nóng 10–15 phút. Gừng khô: nghiền bột, làm trà hoặc viên nang.',
    dosage:
      'Gừng tươi: 2–4 g/ngày. Bột gừng: 0,5–2 g/ngày. Trà gừng: 1–2 cốc/ngày. Không dùng quá 4 g/ngày (phụ nữ mang thai: không quá 1 g/ngày).',
    warnings:
      'Tăng nguy cơ chảy máu khi dùng chung thuốc chống đông (warfarin). Thận trọng với người sỏi mật. Liều cao gây ợ nóng, tiêu chảy.',
    relatedIngredientSlugs: ['omega-3', 'ibuprofen'],
  },
  {
    slug: 'atiso',
    name: 'Atisô',
    latinName: 'Cynara scolymus L.',
    category: 'hoa',
    parts: ['Lá bắc (cụm hoa)', 'Lá'],
    description:
      'Atisô là cây thân thảo lưu niên có nguồn gốc Địa Trung Hải, hiện trồng nhiều ở Đà Lạt, Sapa. Từ lâu được dùng để bảo vệ gan, lợi mật.',
    traditionalUses: [
      'Hỗ trợ chức năng gan, lợi mật',
      'Giảm cholesterol máu',
      'Lợi tiểu, giải độc',
      'Trị chậm tiêu, đầy bụng',
    ],
    activeCompounds: ['Cynarin', 'Cynaropikrin', 'Flavonoid', 'Inulin'],
    preparation:
      'Hãm 5–10 g lá atisô khô với 200 ml nước sôi, để 10 phút, lọc uống. Có thể sắc uống. Dạng cao, viên nang cũng phổ biến.',
    dosage:
      'Trà atisô: 2–3 cốc/ngày. Cao atisô: 1–2 g/ngày. Liệu trình 4–8 tuần, nghỉ 2–4 tuần trước khi dùng lại.',
    warnings:
      'Dị ứng với họ Cúc (Asteraceae) như cúc, hoa hướng dương. Tắc mật: chống chỉ định. Tương tác với thuốc chuyển hóa qua CYP3A4.',
    relatedIngredientSlugs: ['vitamin-c'],
  },
  {
    slug: 'bacha',
    name: 'Bạc hà',
    latinName: 'Mentha haplocalyx Briq.',
    category: 'lá',
    parts: ['Lá và ngọn non (tươi hoặc khô)'],
    description:
      'Bạc hà là cây thân thảo dễ trồng, chứa tinh dầu menthol. Là dược liệu thông dụng nhất trong YHCT và cũng được dùng rộng rãi trong y học hiện đại.',
    traditionalUses: [
      'Giải cảm, hạ sốt',
      'Thông mũi, giảm ho',
      'Trị đau đầu, đau nửa đầu',
      'Trị rối loạn tiêu hóa, đầy hơi',
    ],
    activeCompounds: ['Menthol (50–80%)', 'Menthone', 'Menthyl acetate', 'Flavonoid'],
    preparation:
      'Hãm 3–6 g lá bạc hà khô với nước sôi 5–10 phút, uống nóng. Tinh dầu bạc hà dùng xông hơi hoặc bôi ngoài (tránh vùng mặt trẻ nhỏ).',
    dosage:
      'Trà bạc hà: 1–2 cốc/ngày. Tinh dầu bạc hà: 0,2–0,4 ml/lần, tối đa 3 lần/ngày.',
    warnings:
      'Không bôi tinh dầu bạc hà lên mũi/mặt trẻ sơ sinh và trẻ < 2 tuổi (gây co thắt thanh quản). Trào ngược dạ dày: có thể nặng hơn.',
    relatedIngredientSlugs: ['paracetamol'],
  },
  {
    slug: 'la-lot',
    name: 'Lá lốt',
    latinName: 'Piper lolot C. DC.',
    category: 'lá',
    parts: ['Lá tươi'],
    description:
      'Lá lốt là cây thân thảo mọc hoang và được trồng phổ biến ở Việt Nam làm gia vị và dược liệu. Vị cay, tính ấm, có tác dụng tán hàn, trừ thấp.',
    traditionalUses: [
      'Trị đau nhức xương khớp (phong thấp)',
      'Trị đau bụng lạnh, tiêu chảy',
      'Trị ra mồ hôi tay chân',
      'Giảm đau răng',
    ],
    activeCompounds: ['Tinh dầu (β-caryophyllene)', 'Piperine', 'Flavonoid'],
    preparation:
      'Lá tươi: rửa sạch, giã nát, đắp ngoài hoặc sắc uống. Lá khô: hãm nước sôi 10 phút, uống như trà.',
    dosage:
      'Sắc uống: 8–16 g lá khô/ngày. Đắp ngoài: dùng lá tươi giã nát, đắp lên vùng đau 2–3 lần/ngày.',
    warnings:
      'Không dùng dài ngày vì có thể gây táo bón. Phụ nữ có thai: thận trọng.',
    relatedIngredientSlugs: ['ibuprofen'],
  },
  {
    slug: 'sam-ngoc-linh',
    name: 'Sâm Ngọc Linh',
    latinName: 'Panax vietnamensis Ha & Grushv.',
    category: 'rễ củ',
    parts: ['Thân rễ và rễ củ'],
    description:
      'Sâm Ngọc Linh là loài sâm đặc hữu của Việt Nam, phát hiện ở vùng núi Ngọc Linh (Kon Tum, Quảng Nam). Chứa nhiều saponin quý, là dược liệu quốc bảo.',
    traditionalUses: [
      'Bồi bổ sức khỏe, tăng cường sinh lực',
      'Hỗ trợ điều trị ung thư (kết hợp hóa trị)',
      'Tăng cường miễn dịch',
      'Chống stress, mệt mỏi',
    ],
    activeCompounds: ['Saponin dammaran (hơn 50 loại, trong đó MR2, ginsenosid Rb1, Rg1)', 'Polyacetylene', 'Acid amin'],
    preparation:
      'Sắc uống: thái lát, sắc với nước 30 phút. Ngâm mật ong: ngâm 1 phần sâm tươi với 5 phần mật ong, để 1 tháng. Hãm trà: dùng lát sâm khô.',
    dosage:
      '4–10 g sâm tươi/ngày, hoặc 1–2 g sâm khô. Liệu trình 1–3 tháng, nghỉ 1 tháng trước khi dùng lại.',
    warnings:
      'Sâm Ngọc Linh thật rất quý hiếm và đắt đỏ, thị trường có nhiều hàng giả. Mua tại các đại lý uy tín. Không dùng cho người đang sốt cao, phụ nữ mang thai, trẻ em dưới 12 tuổi.',
    relatedIngredientSlugs: ['vitamin-c', 'omega-3'],
  },
  {
    slug: 'tra-xanh',
    name: 'Trà xanh',
    latinName: 'Camellia sinensis (L.) Kuntze',
    category: 'lá',
    parts: ['Lá non và búp tươi'],
    description:
      'Trà xanh chứa nhiều polyphenol đặc biệt là EGCG (epigallocatechin gallate) — chất chống oxy hóa mạnh. Được tiêu thụ rộng rãi làm thức uống và dược liệu.',
    traditionalUses: [
      'Chống oxy hóa, làm chậm lão hóa',
      'Hỗ trợ giảm cân, tăng chuyển hóa',
      'Phòng ngừa ung thư (nghiên cứu dịch tễ)',
      'Cải thiện tỉnh táo, tập trung (do caffeine)',
    ],
    activeCompounds: ['EGCG', 'Catechin', 'Caffeine (2–4%)', 'L-theanine', 'Flavonoid'],
    preparation:
      'Hãm 2–3 g lá trà với 200 ml nước sôi (80°C, không dùng nước sôi 100°C để tránh đắng), để 2–3 phút, uống khi còn ấm.',
    dosage:
      '2–3 cốc trà/ngày. Không uống lúc bụng đói. Không nên uống sau 16h (gây mất ngủ).',
    warnings:
      'Caffeine: thận trọng với người mất ngủ, lo âu, tim mạch. Tương tác với thuốc chống đông, một số thuốc tâm thần.',
    relatedIngredientSlugs: ['omega-3', 'vitamin-c'],
  },
  {
    slug: 'toi',
    name: 'Tỏi',
    latinName: 'Allium sativum L.',
    category: 'rễ củ',
    parts: ['Củ (tép tỏi)'],
    description:
      'Tỏi là gia vị phổ biến và dược liệu cổ truyền. Chứa allicin — hợp chất sulfur hình thành khi tỏi bị nghiền/giã, có nhiều tác dụng sinh học.',
    traditionalUses: [
      'Kháng khuẩn, kháng nấm, kháng virus',
      'Hạ cholesterol máu, phòng xơ vữa động mạch',
      'Hạ huyết áp nhẹ',
      'Tăng cường miễn dịch',
    ],
    activeCompounds: ['Allicin', 'Diallyl sulfide', 'S-allyl cysteine', 'Flavonoid'],
    preparation:
      'Giã/nghiền tỏi tươi, để 10 phút trước khi nấu (để enzyme alliinase tạo allicin). Ăn sống 1–2 tép/ngày hoặc chế biến cùng món ăn. Dạng viên nang dầu tỏi.',
    dosage:
      'Tỏi tươi: 1–2 tép/ngày. Bột tỏi: 300–1000 mg/ngày. Dầu tỏi: 300 mg/ngày.',
    warnings:
      'Trước phẫu thuật: ngưng tỏi 7–10 ngày (tăng chảy máu). Tương tác với thuốc chống đông (warfarin), thuốc trị HIV (saquinavir).',
    relatedIngredientSlugs: ['omega-3', 'canxi'],
  },
];

export const HERB_CATEGORIES: { id: HerbCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'rễ củ', label: 'Rễ củ' },
  { id: 'lá', label: 'Lá' },
  { id: 'hoa', label: 'Hoa' },
  { id: 'quả hạt', label: 'Quả hạt' },
  { id: 'vỏ thân', label: 'Vỏ thân' },
  { id: 'toàn cây', label: 'Toàn cây' },
];

export function getHerbBySlug(slug: string): Herb | null {
  return HERBS.find((h) => h.slug === slug) ?? null;
}

export function getHerbsByCategory(category: HerbCategory | 'all'): Herb[] {
  if (category === 'all') return HERBS;
  return HERBS.filter((h) => h.category === category);
}

export function searchHerbs(query: string): Herb[] {
  const q = query.trim().toLowerCase();
  if (!q) return HERBS;
  return HERBS.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.latinName.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q)
  );
}
