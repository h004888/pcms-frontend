// =====================================================
// Mock data: Video y khoa
// Dùng cho /video
// =====================================================

export interface VideoItem {
  id: string;
  title: string;
  source: 'WHO' | 'Bộ Y tế' | 'PCMS';
  category: 'phòng bệnh' | 'điều trị' | 'dinh dưỡng' | 'tâm lý';
  duration: string; // mm:ss
  description: string;
  url: string; // placeholder
}

export const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Rửa tay đúng cách — 6 bước',
    source: 'Bộ Y tế',
    category: 'phòng bệnh',
    duration: '1:30',
    description: 'Hướng dẫn rửa tay 6 bước theo khuyến cáo của WHO.',
    url: '/video/v1',
  },
  {
    id: 'v2',
    title: 'Cách đo huyết áp tại nhà',
    source: 'PCMS',
    category: 'điều trị',
    duration: '3:15',
    description: 'Hướng dẫn đo huyết áp đúng tư thế, đúng thời điểm.',
    url: '/video/v2',
  },
  {
    id: 'v3',
    title: 'Phân biệt cảm cúm và cảm lạnh',
    source: 'WHO',
    category: 'phòng bệnh',
    duration: '2:45',
    description: 'Triệu chứng, cách phân biệt và khi nào cần đi khám.',
    url: '/video/v3',
  },
  {
    id: 'v4',
    title: 'Dinh dưỡng cho người tiểu đường',
    source: 'PCMS',
    category: 'dinh dưỡng',
    duration: '5:20',
    description: 'Thực phẩm nên ăn, nên tránh, và cách lên thực đơn.',
    url: '/video/v4',
  },
  {
    id: 'v5',
    title: 'Vận động phục hồi sau đột quỵ',
    source: 'Bộ Y tế',
    category: 'điều trị',
    duration: '8:10',
    description: 'Bài tập phục hồi chức năng cho bệnh nhân đột quỵ.',
    url: '/video/v5',
  },
  {
    id: 'v6',
    title: 'Quản lý stress và lo âu',
    source: 'PCMS',
    category: 'tâm lý',
    duration: '4:50',
    description: 'Kỹ thuật thở, thiền, và thay đổi lối sống để giảm stress.',
    url: '/video/v6',
  },
];

export function getVideoById(id: string): VideoItem | undefined {
  return VIDEOS.find((v) => v.id === id);
}