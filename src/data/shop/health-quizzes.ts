// =====================================================
// Mock data: Bài kiểm tra sức khỏe (Health quizzes)
// Dùng cho /suc-khoe/kiem-tra
// =====================================================

export interface HealthQuiz {
  slug: string;
  title: string;
  category: 'thần kinh' | 'tim mạch' | 'nội tiết' | 'hô hấp' | 'tiêu hóa' | 'tổng quát';
  durationMin: number;
  questionsCount: number;
  description: string;
  icon: 'Brain' | 'Heart' | 'Droplet' | 'Wind' | 'Pill' | 'Stethoscope';
  color: 'info' | 'danger' | 'primary' | 'warning' | 'accent' | 'success';
}

export const HEALTH_QUIZZES: HealthQuiz[] = [
  {
    slug: 'tri-nho',
    title: 'Trí nhớ & Tập trung',
    category: 'thần kinh',
    durationMin: 5,
    questionsCount: 10,
    description: 'Đánh giá chức năng nhận thức, trí nhớ ngắn hạn và khả năng tập trung.',
    icon: 'Brain',
    color: 'info',
  },
  {
    slug: 'tim-mach',
    title: 'Nguy cơ tim mạch',
    category: 'tim mạch',
    durationMin: 7,
    questionsCount: 12,
    description: 'Ước tính nguy cơ mắc bệnh tim mạch trong 10 năm tới theo Framingham.',
    icon: 'Heart',
    color: 'danger',
  },
  {
    slug: 'tien-dai-thao-duong',
    title: 'Tiền đái tháo đường',
    category: 'nội tiết',
    durationMin: 5,
    questionsCount: 8,
    description: 'Sàng lọc nguy cơ tiền đái tháo đường type 2.',
    icon: 'Droplet',
    color: 'primary',
  },
  {
    slug: 'hen',
    title: 'Kiểm soát hen (ACT)',
    category: 'hô hấp',
    durationMin: 3,
    questionsCount: 5,
    description: 'Bảng hỏi ACT chuẩn quốc tế — đánh giá mức độ kiểm soát hen.',
    icon: 'Wind',
    color: 'warning',
  },
  {
    slug: 'gerd',
    title: 'Trào ngược dạ dày',
    category: 'tiêu hóa',
    durationMin: 4,
    questionsCount: 7,
    description: 'Đánh giá triệu chứng GERD, đề xuất khám chuyên khoa nếu cần.',
    icon: 'Pill',
    color: 'accent',
  },
  {
    slug: 'suy-giap',
    title: 'Suy giáp',
    category: 'nội tiết',
    durationMin: 5,
    questionsCount: 8,
    description: 'Sàng lọc triệu chứng suy giáp thường gặp ở phụ nữ > 35 tuổi.',
    icon: 'Stethoscope',
    color: 'success',
  },
];

export function getQuizBySlug(slug: string): HealthQuiz | undefined {
  return HEALTH_QUIZZES.find((q) => q.slug === slug);
}