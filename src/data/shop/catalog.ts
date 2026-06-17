// =====================================================
// Mock catalog data for Phase 2 development
// 30 sample products across 5 categories
// Replace with real B2B API when backend is ready
// =====================================================

import type {
  Category,
  ProductDetail,
  ProductSummary,
  ProductReview,
  SearchResponse,
} from '@/types/shop/catalog';

export const CATEGORIES: Category[] = [
  {
    id: 'thuoc',
    slug: 'thuoc',
    name: 'Thuốc',
    icon: 'Pill',
    productCount: 1240,
    children: [
      { id: 'thuoc-khang-sinh', slug: 'thuoc-khang-sinh', name: 'Kháng sinh, kháng nấm', productCount: 180 },
      { id: 'thuoc-giam-dau', slug: 'thuoc-giam-dau', name: 'Giảm đau, hạ sốt', productCount: 220 },
      { id: 'thuoc-tim-mach', slug: 'thuoc-tim-mach', name: 'Tim mạch & máu', productCount: 150 },
      { id: 'thuoc-tieu-hoa', slug: 'thuoc-tieu-hoa', name: 'Tiêu hoá & gan mật', productCount: 130 },
      { id: 'thuoc-than-kinh', slug: 'thuoc-than-kinh', name: 'Thần kinh', productCount: 95 },
      { id: 'thuoc-ung-thu', slug: 'thuoc-ung-thu', name: 'Điều trị ung thư', productCount: 60 },
    ],
  },
  {
    id: 'tpcn',
    slug: 'thuc-pham-chuc-nang',
    name: 'Thực phẩm chức năng',
    icon: 'Heart',
    productCount: 850,
    children: [
      { id: 'vitamin', slug: 'vitamin-khoang-chat', name: 'Vitamin & Khoáng chất', productCount: 220 },
      { id: 'mien-dich', slug: 'mien-dich-de-khang', name: 'Miễn dịch - Đề kháng', productCount: 145 },
      { id: 'sinh-ly', slug: 'sinh-ly-noi-tiet', name: 'Sinh lý - Nội tiết tố', productCount: 90 },
      { id: 'mat', slug: 'mat-thi-luc', name: 'Mắt - Thị lực', productCount: 75 },
      { id: 'tieu-hoa', slug: 'tieu-hoa', name: 'Tiêu hoá', productCount: 110 },
      { id: 'nao', slug: 'than-kinh-nao', name: 'Thần kinh não', productCount: 65 },
    ],
  },
  {
    id: 'duoc-my-pham',
    slug: 'duoc-my-pham',
    name: 'Dược mỹ phẩm',
    icon: 'Stethoscope',
    productCount: 620,
  },
  {
    id: 'cham-soc-ca-nhan',
    slug: 'cham-soc-ca-nhan',
    name: 'Chăm sóc cá nhân',
    icon: 'Baby',
    productCount: 480,
  },
  {
    id: 'thiet-bi-y-te',
    slug: 'thiet-bi-y-te',
    name: 'Thiết bị y tế',
    icon: 'FlaskConical',
    productCount: 320,
  },
];

const PHARMA = [
  { name: 'Sanofi', country: 'Pháp' },
  { name: 'Pfizer', country: 'Mỹ' },
  { name: 'GSK', country: 'Anh' },
  { name: 'Bayer', country: 'Đức' },
  { name: 'AstraZeneca', country: 'Anh' },
  { name: 'Traphaco', country: 'Việt Nam' },
  { name: 'DHG Pharma', country: 'Việt Nam' },
  { name: 'Imexpharm', country: 'Việt Nam' },
  { name: 'Hasan-Dermapharm', country: 'Việt Nam' },
];

const PRODUCTS_DATA: Array<Omit<ProductDetail, 'id' | 'slug'>> = [
  // === 1. Paracetamol (giảm đau) ===
  {
    sku: 'PAR-500-MG-20',
    name: 'Paracetamol 500mg (hộp 20 viên)',
    price: 18000,
    originalPrice: 25000,
    discountPercent: 28,
    unit: 'Hộp',
    thumbnail: '/placeholder-products/paracetamol.svg',
    country: 'Pháp',
    brand: 'Sanofi',
    prescriptionRequired: false,
    stockStatus: 'in_stock',
    rating: 4.6,
    reviewCount: 248,
    tags: ['Bán chạy', 'Hot'],
    description:
      'Paracetamol là thuốc giảm đau, hạ sốt phổ biến. Hiệu quả trong điều trị đau nhẹ đến vừa (đau đầu, đau răng, đau cơ, đau bụng kinh) và hạ sốt trong cảm cúm, nhiễm trùng.',
    shortDescription: 'Giảm đau, hạ sốt hiệu quả, dùng được cho cả gia đình.',
    category: { id: 'thuoc-giam-dau', name: 'Giảm đau, hạ sốt', slug: 'thuoc-giam-dau' },
    ingredients: 'Paracetamol 500mg, tá dược vừa đủ 1 viên.',
    usage:
      'Người lớn và trẻ em trên 12 tuổi: 1-2 viên/lần, cách nhau 4-6 giờ. Tối đa 8 viên/24 giờ. Trẻ em 6-12 tuổi: 1/2-1 viên/lần.',
    dosage: '500mg / lần',
    sideEffects:
      'Hiếm gặp: phản ứng dị ứng (phát ban, ngứa), tổn thương gan khi dùng quá liều. Ngưng thuốc và gặp bác sĩ nếu có triệu chứng bất thường.',
    storage: 'Bảo quản nơi khô ráo, tránh ánh sáng, dưới 30°C. Để xa tầm tay trẻ em.',
    expiryMonths: 36,
    manufacturer: 'Sanofi-Aventis Việt Nam',
    images: ['/placeholder-products/paracetamol-1.svg', '/placeholder-products/paracetamol-2.svg'],
  },
  // === 2. Amoxicillin ===
  {
    sku: 'AMX-500-MG-12',
    name: 'Amoxicillin 500mg (hộp 12 viên)',
    price: 65000,
    unit: 'Hộp',
    thumbnail: '/placeholder-products/amoxicillin.svg',
    country: 'Anh',
    brand: 'GSK',
    prescriptionRequired: true,
    stockStatus: 'in_stock',
    rating: 4.4,
    reviewCount: 87,
    tags: ['Thuốc kê đơn'],
    description:
      'Amoxicillin là kháng sinh nhóm beta-lactam, phổ rộng, dùng trong điều trị nhiễm trùng đường hô hấp, tai mũi họng, tiết niệu, da và mô mềm.',
    shortDescription: 'Kháng sinh phổ rộng — cần đơn thuốc từ bác sĩ.',
    category: { id: 'thuoc-khang-sinh', name: 'Kháng sinh, kháng nấm', slug: 'thuoc-khang-sinh' },
    ingredients: 'Amoxicillin 500mg (dạng trihydrate).',
    usage:
      'Người lớn: 250-500mg mỗi 8 giờ, tùy mức độ nhiễm trùng. Trẻ em: 25-50mg/kg/ngày chia 3 lần. Dùng đủ liệu trình 5-7 ngày theo chỉ định bác sĩ.',
    dosage: '500mg / 8 giờ',
    sideEffects: 'Buồn nôn, tiêu chảy, phát ban. Hiếm: phản ứng phản vệ.',
    storage: 'Bảo quản dưới 25°C, tránh ẩm.',
    expiryMonths: 24,
    manufacturer: 'GlaxoSmithKline',
    images: ['/placeholder-products/amoxicillin-1.svg'],
  },
  // === 3. Vitamin C ===
  {
    sku: 'VITC-1000-MG-30',
    name: 'Vitamin C 1000mg (hộp 30 viên sủi)',
    price: 85000,
    originalPrice: 110000,
    discountPercent: 23,
    unit: 'Hộp',
    thumbnail: '/placeholder-products/vitamin-c.svg',
    country: 'Mỹ',
    brand: 'Pfizer',
    prescriptionRequired: false,
    stockStatus: 'in_stock',
    rating: 4.7,
    reviewCount: 312,
    tags: ['Bán chạy'],
    description:
      'Vitamin C 1000mg viên sủi giúp tăng cường sức đề kháng, chống oxy hóa, hỗ trợ hấp thu sắt, đẹp da. Hương cam dễ uống, phù hợp cả gia đình.',
    shortDescription: 'Tăng đề kháng, đẹp da, viên sủi hương cam dễ uống.',
    category: { id: 'vitamin', name: 'Vitamin & Khoáng chất', slug: 'vitamin-khoang-chat' },
    ingredients: 'Vitamin C (Ascorbic acid) 1000mg, natri bicarbonate, hương cam tổng hợp.',
    usage: 'Hòa tan 1 viên vào 200ml nước, uống 1 viên/ngày. Không dùng cho người sỏi thận, suy thận.',
    dosage: '1000mg / ngày',
    sideEffects: 'Dùng liều cao (>2000mg/ngày) có thể gây rối loạn tiêu hóa, sỏi thận.',
    storage: 'Nơi khô ráo, tránh ánh sáng trực tiếp, dưới 30°C.',
    expiryMonths: 24,
    manufacturer: 'Pfizer',
    images: ['/placeholder-products/vitaminc-1.svg'],
  },
  // === 4. Omega-3 ===
  {
    sku: 'OMG3-1000-MG-60',
    name: 'Omega-3 1000mg (hộp 60 viên)',
    price: 320000,
    originalPrice: 420000,
    discountPercent: 24,
    unit: 'Hộp',
    thumbnail: '/placeholder-products/omega3.svg',
    country: 'Na Uy',
    brand: 'AstraZeneca',
    prescriptionRequired: false,
    stockStatus: 'in_stock',
    rating: 4.8,
    reviewCount: 156,
    tags: ['Bán chạy', 'Hot'],
    description:
      'Omega-3 EPA & DHA tinh khiết từ cá hồi Na Uy. Hỗ trợ tim mạch, giảm triglyceride, tốt cho mắt, não và hệ miễn dịch.',
    shortDescription: 'Omega-3 EPA+DHA tinh khiết từ Na Uy, tốt cho tim mạch và não.',
    category: { id: 'mien-dich', name: 'Miễn dịch - Đề kháng', slug: 'mien-dich-de-khang' },
    ingredients: 'Fish oil 1000mg (EPA 180mg, DHA 120mg), Vitamin E.',
    usage: 'Uống 1-2 viên/ngày sau bữa ăn. Nên dùng liên tục ít nhất 3 tháng.',
    dosage: '1000mg / ngày',
    sideEffects: 'Có thể gây ợ tanh. Dùng với bữa ăn để giảm.',
    storage: 'Nơi khô ráo, tránh ánh sáng, nhiệt độ phòng. Sau khi mở, bảo quản trong tủ lạnh.',
    expiryMonths: 24,
    manufacturer: 'AstraZeneca',
    images: ['/placeholder-products/omega3-1.svg'],
  },
  // === 5. Calcium + D3 ===
  {
    sku: 'CAL-D3-600-MG-60',
    name: 'Canxi + Vitamin D3 600mg (hộp 60 viên)',
    price: 180000,
    unit: 'Hộp',
    thumbnail: '/placeholder-products/calcium.svg',
    country: 'Việt Nam',
    brand: 'Traphaco',
    prescriptionRequired: false,
    stockStatus: 'in_stock',
    rating: 4.5,
    reviewCount: 89,
    description:
      'Bổ sung canxi và vitamin D3 cho xương chắc khỏe, răng trắng bóng, phòng loãng xương, đặc biệt cho người lớn tuổi, phụ nữ mang thai và cho con bú.',
    shortDescription: 'Bổ sung canxi + D3 cho xương chắc khỏe, ngừa loãng xương.',
    category: { id: 'vitamin', name: 'Vitamin & Khoáng chất', slug: 'vitamin-khoang-chat' },
    ingredients: 'Calcium carbonate 600mg, Vitamin D3 400 IU, Magnesium, Kẽm.',
    usage: 'Uống 1-2 viên/ngày với bữa ăn. Không uống cùng sắt.',
    dosage: '600mg / ngày',
    sideEffects: 'Táo bón, đầy bụng nếu dùng liều cao.',
    storage: 'Nơi khô ráo, dưới 30°C.',
    expiryMonths: 36,
    manufacturer: 'Traphaco',
    images: ['/placeholder-products/calcium-1.svg'],
  },
  // === 6-15: Add more variations ===
  ...generateMoreProducts(),
];

// Helper to generate 10 more products with variations
function generateMoreProducts(): Array<Omit<ProductDetail, 'id' | 'slug'>> {
  const result: Array<Omit<ProductDetail, 'id' | 'slug'>> = [];
  const templateProducts = [
    { name: 'Ibuprofen 400mg', cat: 'thuoc-giam-dau', price: 35000, desc: 'Giảm đau kháng viêm NSAID, hiệu quả cho đau đầu, đau răng, đau cơ.', unit: 'Hộp' },
    { name: 'Cetirizine 10mg', cat: 'thuoc-tieu-hoa', price: 28000, desc: 'Kháng histamin thế hệ 2, điều trị dị ứng, mề đay, viêm mũi dị ứng.', unit: 'Hộp' },
    { name: 'Salbutamol 100mcg', cat: 'thuoc-hong', price: 95000, desc: 'Thuốc giãn phế quản dạng hít, điều trị hen suyễn và COPD.', unit: 'Hộp' },
    { name: 'Atorvastatin 20mg', cat: 'thuoc-tim-mach', price: 145000, desc: 'Statin giảm cholesterol, phòng ngừa bệnh tim mạch, đột quỵ.', unit: 'Hộp' },
    { name: 'Metformin 500mg', cat: 'thuoc-tieu-hoa', price: 48000, desc: 'Thuốc tiểu đường type 2 phổ biến nhất, kiểm soát đường huyết.', unit: 'Hộp' },
    { name: 'Omeprazole 20mg', cat: 'thuoc-tieu-hoa', price: 68000, desc: 'PPI ức chế tiết acid dạ dày, điều trị trào ngược và viêm loét dạ dày.', unit: 'Hộp' },
    { name: 'Melatonin 3mg', cat: 'than-kinh-nao', price: 220000, desc: 'Hỗ trợ giấc ngủ tự nhiên, điều hòa nhịp sinh học, an toàn khi dùng ngắn hạn.', unit: 'Hộp' },
    { name: 'Sắt Fumarat + Folic', cat: 'vitamin-khoang-chat', price: 95000, desc: 'Bổ sung sắt cho phụ nữ mang thai và người thiếu máu, kết hợp acid folic.', unit: 'Hộp' },
    { name: 'Glucosamine 1500mg', cat: 'co-xuong-khop', price: 380000, desc: 'Hỗ trợ sụn khớp, giảm đau khớp cho người thoái hóa khớp.', unit: 'Hộp' },
    { name: 'Kem chống nắng SPF 50+', cat: 'duoc-my-pham', price: 280000, original: 360000, desc: 'Kem chống nắng vật lý lai hóa học, bảo vệ khỏi UVA/UVB.', unit: 'Tuýp' },
  ];

  for (let i = 0; i < templateProducts.length; i++) {
    const t = templateProducts[i];
    const pharma = PHARMA[i % PHARMA.length];
    result.push({
      sku: `SKU-${1000 + i + 6}`,
      name: t.name,
      price: t.price,
      originalPrice: t.original,
      discountPercent: t.original ? Math.round(((t.original - t.price) / t.original) * 100) : undefined,
      unit: t.unit,
      thumbnail: `/placeholder-products/${t.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
      country: pharma.country,
      brand: pharma.name,
      prescriptionRequired: i % 3 === 1, // ~33% require prescription
      stockStatus: i === 7 ? 'low_stock' : 'in_stock',
      rating: 4.2 + (i % 7) * 0.1,
      reviewCount: 30 + i * 17,
      tags: i % 4 === 0 ? ['Bán chạy'] : i % 5 === 0 ? ['Mới'] : undefined,
      description: t.desc,
      shortDescription: t.desc.substring(0, 80) + '...',
      category: { id: t.cat, name: t.cat.replace(/-/g, ' '), slug: t.cat },
      ingredients: 'Thành phần chính theo công thức dược phẩm, tá dược vừa đủ.',
      usage: 'Theo chỉ định của bác sĩ hoặc hướng dẫn trên bao bì. Không tự ý tăng liều.',
      dosage: t.name.includes('mg') ? t.name.match(/(\d+)\s*mg/)?.[0] || 'Theo chỉ định' : 'Theo chỉ định',
      sideEffects: 'Hiếm gặp: rối loạn tiêu hóa, dị ứng. Ngưng thuốc và gặp bác sĩ nếu có triệu chứng bất thường.',
      storage: 'Bảo quản nơi khô ráo, tránh ánh sáng, dưới 30°C.',
      expiryMonths: 24 + (i % 3) * 12,
      manufacturer: pharma.name,
      images: [`/placeholder-products/${t.name.toLowerCase().replace(/\s+/g, '-')}-1.svg`],
    });
  }
  return result;
}

export const PRODUCTS: ProductDetail[] = PRODUCTS_DATA.map((p, idx) => ({
  ...p,
  id: `prod-${idx + 1}`,
  slug: p.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''),
}));

// === Sample reviews for first product ===
export const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    customerName: 'Nguyễn Văn A',
    customerAvatar: undefined,
    rating: 5,
    title: 'Tốt, giá rẻ',
    body: 'Mình dùng cho cả gia đình khi bị cảm sốt, hiệu quả nhanh. Giá cả phải chăng, đóng gói cẩn thận.',
    isVerifiedPurchase: true,
    helpfulCount: 24,
    createdAt: '2026-05-12T10:30:00Z',
  },
  {
    id: 'rev-2',
    customerName: 'Trần Thị B',
    customerAvatar: undefined,
    rating: 4,
    body: 'Hạ sốt nhanh, dùng được cho bé trên 6 tuổi. Đóng gói cẩn thận, ship nhanh.',
    isVerifiedPurchase: true,
    helpfulCount: 12,
    createdAt: '2026-05-08T14:20:00Z',
  },
  {
    id: 'rev-3',
    customerName: 'Lê Văn C',
    customerAvatar: undefined,
    rating: 4,
    title: 'Tạm ổn',
    body: 'Dùng được nhưng giá hơi cao so với ngoài. Tuy nhiên mua online tiện, giao tận nơi.',
    isVerifiedPurchase: true,
    helpfulCount: 3,
    createdAt: '2026-04-25T09:00:00Z',
  },
  {
    id: 'rev-4',
    customerName: 'Phạm Thị D',
    customerAvatar: undefined,
    rating: 5,
    body: 'Đóng hộp chắc chắn, hạn dùng còn xa. Dược sĩ Long Châu tư vấn nhiệt tình.',
    isVerifiedPurchase: true,
    helpfulCount: 8,
    createdAt: '2026-04-18T16:45:00Z',
  },
  {
    id: 'rev-5',
    customerName: 'Hoàng Văn E',
    customerAvatar: undefined,
    rating: 3,
    body: 'Hạ sốt ok nhưng mình nghĩ thuốc generic giá rẻ hơn mà tác dụng tương đương.',
    isVerifiedPurchase: false,
    helpfulCount: 1,
    createdAt: '2026-04-10T11:15:00Z',
  },
];

// === Bestseller subset (top 8 by review count) ===
export function getBestsellers(limit = 8): ProductSummary[] {
  return [...PRODUCTS]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, limit)
    .map(stripToSummary);
}

function stripToSummary(p: ProductDetail): ProductSummary {
  // Resolve categorySlug (L1) và subcategorySlug (L2 nếu có)
  // Product.category.slug có thể là slug L1 hoặc L2
  const directCat = CATEGORIES.find((c) => c.id === p.category.id || c.slug === p.category.slug);
  const parentCat = CATEGORIES.find((c) => c.children?.some((ch) => ch.id === p.category.id || ch.slug === p.category.slug));
  const isL2 = Boolean(parentCat);
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    unit: p.unit,
    thumbnail: p.thumbnail,
    country: p.country,
    brand: p.brand,
    prescriptionRequired: p.prescriptionRequired,
    stockStatus: p.stockStatus,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags,
    categorySlug: isL2 ? parentCat!.slug : directCat?.slug,
    subcategorySlug: p.category.slug,
  };
}

export function getProductBySlug(slug: string): ProductDetail | null {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductsByCategory(
  categorySlug: string,
  options: { search?: string; sort?: string; page?: number; pageSize?: number } = {}
): { products: ProductSummary[]; total: number; facets: any } {
  let filtered = PRODUCTS.filter(
    (p) => p.category.slug === categorySlug || p.category.id === categorySlug
  );

  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  // Facets
  const brands: Record<string, number> = {};
  const countries: Record<string, number> = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  for (const p of filtered) {
    brands[p.brand] = (brands[p.brand] ?? 0) + 1;
    countries[p.country] = (countries[p.country] ?? 0) + 1;
    minPrice = Math.min(minPrice, p.price);
    maxPrice = Math.max(maxPrice, p.price);
  }

  // Sort
  switch (options.sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => a.sku.localeCompare(b.sku));
      break;
    case 'rating_desc':
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      // best_selling by review count
      filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  }

  const total = filtered.length;
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 24;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    products: paginated.map(stripToSummary),
    total,
    facets: {
      brands: Object.entries(brands).map(([name, count]) => ({ name, count })),
      countries: Object.entries(countries).map(([name, count]) => ({ name, count })),
      priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
    },
  };
}

export function searchProducts(
  query: string,
  options: { page?: number; pageSize?: number } = {}
): SearchResponse {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { query, results: [], total: 0 };
  }
  // Simple contains search
  const matches = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
  );
  const sorted = matches.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  return {
    query,
    results: sorted.map(stripToSummary),
    total: sorted.length,
  };
}
