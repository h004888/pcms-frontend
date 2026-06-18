// =====================================================
// Health quiz questions database — multi-step form scoring
// Mỗi câu hỏi có weight 0-3 (low risk → high risk)
// Tổng score = sum / max → risk level
// =====================================================

export interface QuizQuestion {
  id: string;
  text: string;
  options: { label: string; score: number }[];
}

export interface QuizDefinition {
  slug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  /** Risk thresholds theo % score (0-1). Default: low ≥0.7, med ≥0.4, high <0.4 */
  thresholds?: { low: number; medium: number };
  advice: {
    low: string;
    medium: string;
    high: string;
  };
}

export const QUIZZES: QuizDefinition[] = [
  {
    slug: 'tim-mach',
    title: 'Nguy cơ tim mạch',
    description: 'Đánh giá nguy cơ mắc bệnh tim mạch trong 10 năm tới (Framingham-inspired).',
    questions: [
      {
        id: 'age',
        text: 'Tuổi của bạn?',
        options: [
          { label: 'Dưới 35', score: 0 },
          { label: '35-44', score: 1 },
          { label: '45-54', score: 2 },
          { label: '55-64', score: 3 },
          { label: 'Trên 65', score: 3 },
        ],
      },
      {
        id: 'gender',
        text: 'Giới tính sinh học?',
        options: [
          { label: 'Nam', score: 2 },
          { label: 'Nữ', score: 0 },
        ],
      },
      {
        id: 'smoking',
        text: 'Bạn có hút thuốc lá?',
        options: [
          { label: 'Không', score: 0 },
          { label: 'Đã bỏ > 5 năm', score: 1 },
          { label: 'Đang hút', score: 3 },
        ],
      },
      {
        id: 'bp',
        text: 'Huyết áp thường của bạn?',
        options: [
          { label: 'Bình thường (< 120/80)', score: 0 },
          { label: 'Cao nhẹ (120-139/80-89)', score: 1 },
          { label: 'Cao (≥ 140/90)', score: 2 },
          { label: 'Đang dùng thuốc HA', score: 2 },
        ],
      },
      {
        id: 'family',
        text: 'Gia đình có người mắc bệnh tim mạch sớm (nam <55, nữ <65)?',
        options: [
          { label: 'Không', score: 0 },
          { label: 'Có 1 người', score: 1 },
          { label: 'Có ≥ 2 người', score: 2 },
        ],
      },
      {
        id: 'exercise',
        text: 'Bạn có tập thể dục đều đặn ≥30 phút/ngày, ≥5 ngày/tuần?',
        options: [
          { label: 'Có, thường xuyên', score: 0 },
          { label: 'Thỉnh thoảng', score: 1 },
          { label: 'Hiếm khi / không', score: 2 },
        ],
      },
    ],
    advice: {
      low: 'Nguy cơ tim mạch của bạn thấp. Duy trì lối sống lành mạnh, khám sức khỏe định kỳ 1 năm/lần.',
      medium:
        'Nguy cơ trung bình. Nên điều chỉnh lối sống (ăn uống, vận động) và tư vấn bác sĩ để đánh giá chi tiết.',
      high:
        'Nguy cơ cao. Vui lòng gặp bác sĩ tim mạch sớm để được tư vấn và xét nghiệm chuyên sâu.',
    },
  },
  {
    slug: 'tri-nho',
    title: 'Trí nhớ & Tập trung',
    description: 'Sàng lọc sớm suy giảm nhận thức — không thay thế chẩn đoán y khoa.',
    questions: [
      {
        id: 'freq-forget',
        text: 'Bạn có hay quên những việc vừa xảy ra (ví dụ: quên vừa nói gì)?',
        options: [
          { label: 'Hiếm khi', score: 0 },
          { label: 'Thỉnh thoảng (1-2 lần/tuần)', score: 1 },
          { label: 'Thường xuyên (hầu như ngày nào)', score: 3 },
        ],
      },
      {
        id: 'word-finding',
        text: 'Bạn có khó tìm từ ngữ thông dụng khi nói?',
        options: [
          { label: 'Không', score: 0 },
          { label: 'Thỉnh thoảng', score: 1 },
          { label: 'Thường xuyên', score: 2 },
        ],
      },
      {
        id: 'focus',
        text: 'Bạn có khó tập trung đọc sách/xem phim > 30 phút?',
        options: [
          { label: 'Không', score: 0 },
          { label: 'Đôi khi', score: 1 },
          { label: 'Thường xuyên', score: 2 },
        ],
      },
      {
        id: 'navigation',
        text: 'Bạn có hay quên đường đi quen thuộc?',
        options: [
          { label: 'Không', score: 0 },
          { label: 'Hiếm khi', score: 1 },
          { label: 'Thường xuyên', score: 3 },
        ],
      },
      {
        id: 'sleep',
        text: 'Bạn có ngủ đủ 7-8 tiếng/đêm?',
        options: [
          { label: 'Có, đều đặn', score: 0 },
          { label: 'Thỉnh thoảng', score: 1 },
          { label: 'Hiếm khi', score: 2 },
        ],
      },
    ],
    advice: {
      low: 'Chức năng nhận thức tốt. Duy trì đọc sách, học kỹ năng mới, ngủ đủ giấc.',
      medium:
        'Có dấu hiệu suy giảm nhẹ. Nên tăng cường vận động thể chất, ngủ đủ giấc, hạn chế rượu bia, tập thiền.',
      high:
        'Có dấu hiệu đáng lo ngại. Nên khám chuyên khoa thần kinh để được đánh giá chi tiết (MMSE, MoCA).',
    },
  },
  {
    slug: 'hen',
    title: 'Kiểm soát hen (ACT)',
    description: 'Asthma Control Test — đánh giá mức độ kiểm soát hen trong 4 tuần qua.',
    questions: [
      {
        id: 'work-days',
        text: 'Trong 4 tuần qua, bạn có bao nhiêu ngày hen ảnh hưởng đến công việc/học tập?',
        options: [
          { label: 'Không ngày nào', score: 0 },
          { label: '1-3 ngày', score: 1 },
          { label: '4-10 ngày', score: 2 },
          { label: '11-19 ngày', score: 3 },
          { label: '20-30 ngày', score: 4 },
        ],
      },
      {
        id: 'shortness',
        text: 'Bạn có bị khó thở > 1 lần/ngày không?',
        options: [
          { label: 'Không', score: 0 },
          { label: '1-2 ngày/tuần', score: 1 },
          { label: '3-6 ngày/tuần', score: 2 },
          { label: '1-2 lần/ngày', score: 3 },
          { label: '> 2 lần/ngày', score: 4 },
        ],
      },
      {
        id: 'night',
        text: 'Bạn có bị triệu chứng hen về đêm?',
        options: [
          { label: 'Không', score: 0 },
          { label: '1-2 lần/tháng', score: 1 },
          { label: '1 lần/tuần', score: 2 },
          { label: '2-3 đêm/tuần', score: 3 },
          { label: '≥ 4 đêm/tuần', score: 4 },
        ],
      },
      {
        id: 'inhaler',
        text: 'Bạn có dùng thuốc cắt cơn (salbutamol) > 2 lần/tuần?',
        options: [
          { label: 'Không', score: 0 },
          { label: '≤ 1 lần/tuần', score: 1 },
          { label: '2-3 lần/tuần', score: 2 },
          { label: '4-5 lần/tuần', score: 3 },
          { label: '> 5 lần/tuần', score: 4 },
        ],
      },
      {
        id: 'control',
        text: 'Bạn đánh giá mức kiểm soát hen trong 4 tuần qua?',
        options: [
          { label: 'Hoàn toàn kiểm soát', score: 0 },
          { label: 'Phần lớn kiểm soát', score: 1 },
          { label: 'Một phần kiểm soát', score: 2 },
          { label: 'Kiểm soát kém', score: 3 },
          { label: 'Không kiểm soát', score: 4 },
        ],
      },
    ],
    thresholds: { low: 0.5, medium: 0.25 },
    advice: {
      low: 'Hen được kiểm soát tốt (> 20 điểm ACT). Tiếp tục dùng thuốc theo đơn và khám định kỳ.',
      medium:
        'Hen kiểm soát một phần (16-19 điểm ACT). Cần đánh giá lại phác đồ điều trị với bác sĩ.',
      high:
        'Hen kiểm soát kém (≤ 15 điểm ACT). Nên gặp bác sĩ sớm để điều chỉnh thuốc — KHÔNG tự ý tăng liều.',
    },
  },
];

export function getQuizBySlugFull(slug: string): QuizDefinition | undefined {
  return QUIZZES.find((q) => q.slug === slug);
}

/** Tính score từ answers */
export function computeScore(quiz: QuizDefinition, answers: Record<string, number>): {
  totalScore: number;
  maxScore: number;
  ratio: number;
  level: 'low' | 'medium' | 'high';
} {
  const totalScore = quiz.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const maxScore = quiz.questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0);
  const ratio = maxScore > 0 ? totalScore / maxScore : 0;
  const t = quiz.thresholds ?? { low: 0.4, medium: 0.6 };
  const level: 'low' | 'medium' | 'high' = ratio < t.low ? 'low' : ratio < t.medium ? 'medium' : 'high';
  return { totalScore, maxScore, ratio, level };
}
