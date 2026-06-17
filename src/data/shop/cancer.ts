// =====================================================
// Mock data: Bệnh ung thư (Cancer info)
// Dùng cho /chuyen-trang-ung-thu
// =====================================================

export interface CancerArticle {
  slug: string;
  name: string;
  category: 'phổ biến' | 'hiếm gặp' | 'trẻ em';
  shortDesc: string;
  symptoms: string[];
  riskFactors: string[];
  screening: string;
  treatment: string;
  prevention: string;
}

export const CANCER_ARTICLES: CancerArticle[] = [
  {
    slug: 'ung-thu-vu',
    name: 'Ung thư vú',
    category: 'phổ biến',
    shortDesc: 'Loại ung thư phổ biến nhất ở nữ giới Việt Nam.',
    symptoms: ['Khối u ở vú hoặc nách', 'Thay đổi hình dạng núm vú', 'Tiết dịch bất thường'],
    riskFactors: ['Nữ giới, tuổi > 40', 'Tiền sử gia đình', 'Béo phì, ít vận động'],
    screening: 'Chụp nhũ ảnh mỗi 1-2 năm cho phụ nữ > 40 tuổi.',
    treatment: 'Phẫu thuật, hóa trị, xạ trị, liệu pháp nội tiết — tùy giai đoạn.',
    prevention: 'Cho con bú, giảm cân, hạn chế rượu bia, tập thể dục đều đặn.',
  },
  {
    slug: 'ung-thu-phoi',
    name: 'Ung thư phổi',
    category: 'phổ biến',
    shortDesc: 'Nguyên nhân gây tử vong hàng đầu do ung thư ở cả hai giới.',
    symptoms: ['Ho kéo dài', 'Ho ra máu', 'Khó thở, đau ngực', 'Sụt cân không rõ nguyên nhân'],
    riskFactors: ['Hút thuốc lá (90% ca)', 'Tiếp xúc khói thuốc thụ động', 'Ô nhiễm không khí'],
    screening: 'Chụp CT ngực liều thấp hàng năm cho người hút thuốc > 30 gói-năm.',
    treatment: 'Phẫu thuật (giai đoạn sớm), hóa trị, xạ trị, liệu pháp nhắm trúng đích.',
    prevention: 'Bỏ thuốc lá — biện pháp hiệu quả nhất.',
  },
  {
    slug: 'ung-thu-dai-trang',
    name: 'Ung thư đại trực tràng',
    category: 'phổ biến',
    shortDesc: 'Có xu hướng trẻ hóa, phát hiện sớm có thể chữa khỏi.',
    symptoms: ['Thay đổi thói quen đi cầu', 'Máu trong phân', 'Đau bụng, đầy hơi', 'Mệt mỏi, sụt cân'],
    riskFactors: ['Tuổi > 50', 'Tiền sử gia đình', 'Polyp đại tràng', 'Chế độ ăn nhiều thịt đỏ'],
    screening: 'Nội soi đại tràng mỗi 10 năm cho người > 50 tuổi.',
    treatment: 'Phẫu thuật, hóa trị, liệu pháp nhắm trúng đích.',
    prevention: 'Ăn nhiều rau xanh, vận động, hạn chế thịt đỏ.',
  },
  {
    slug: 'ung-thu-mau',
    name: 'Ung thư máu (Leukemia)',
    category: 'phổ biến',
    shortDesc: 'Ung thư tế bào máu, phổ biến ở trẻ em và người trưởng thành.',
    symptoms: ['Mệt mỏi, xanh xao', 'Sốt kéo dài', 'Chảy máu/bầm tím dễ', 'Đau xương khớp'],
    riskFactors: ['Tiếp xúc bức xạ', 'Tiếp xúc hóa chất (benzen)', 'Hội chứng di truyền'],
    screening: 'Khám sức khỏe định kỳ, xét nghiệm công thức máu.',
    treatment: 'Hóa trị, ghép tế bào gốc, liệu pháp nhắm trúng đích.',
    prevention: 'Tránh tiếp xúc bức xạ/hóa chất, khám sức khỏe định kỳ.',
  },
];

export function getCancerBySlug(slug: string): CancerArticle | undefined {
  return CANCER_ARTICLES.find((c) => c.slug === slug);
}