// =====================================================
// AI responses database — smart mock cho /ai/chat
// Match theo keyword, fallback về generic response
// =====================================================

export interface AIIntent {
  keywords: string[];
  response: string;
  /** Optional follow-up suggestions */
  followUp?: string[];
}

export const AI_INTENTS: AIIntent[] = [
  {
    keywords: ['paracetamol', 'acetaminophen', 'hạ sốt'],
    response:
      'Paracetamol (acetaminophen) là thuốc giảm đau, hạ sốt phổ biến. Liều người lớn: 500mg-1g/lần, tối đa 4g/ngày, cách nhau ≥4 giờ.\n\n⚠️ Không dùng cho người suy gan nặng. Tránh uống rượu khi dùng thuốc.\n\nBạn đang dùng cho ai?',
    followUp: ['Liều cho trẻ em', 'Có dùng được cho bà bầu?', 'Tương tác với thuốc khác'],
  },
  {
    keywords: ['amoxicillin', 'kháng sinh', 'nhiễm trùng'],
    response:
      'Amoxicillin là kháng sinh nhóm beta-lactam, dùng trong nhiễm trùng hô hấp, tai mũi họng, tiết niệu.\n\nLiều người lớn: 250-500mg mỗi 8 giờ, dùng 5-7 ngày. Trẻ em: 25-50mg/kg/ngày chia 3 lần.\n\n⚠️ PHẢI có đơn bác sĩ. Dùng đủ liều dù triệu chứng đã giảm. Ngưng thuốc nếu có phát ban, sưng mặt.',
    followUp: ['Dị ứng Penicillin', 'Dùng khi mang thai', 'Tương tác với rượu'],
  },
  {
    keywords: ['bà bầu', 'mang thai', 'thai kỳ', 'pregnancy'],
    response:
      'Một số thuốc an toàn trong thai kỳ: Paracetamol (giảm đau/sốt), Vitamin B, Canxi, Sắt.\n\n⚠️ TRÁNH: Aspirin (3 tháng cuối), Ibuprofen, Tetracycline, Retinol liều cao, hầu hết thuốc kê đơn.\n\nMọi thuốc đều cần hỏi bác sĩ trước khi dùng. Bạn đang ở tuần thứ bao nhiêu?',
    followUp: ['Vitamin cho bà bầu', 'Vắc xin khi mang thai', 'Thuốc ho an toàn'],
  },
  {
    keywords: ['trẻ em', 'bé', 'con tôi', 'pediatric'],
    response:
      'Trẻ em cần dùng thuốc theo cân nặng, không theo tuổi. Paracetamol: 10-15mg/kg mỗi 4-6 giờ.\n\nKhông dùng Aspirin cho trẻ < 18 tuổi (nguy cơ Reye). Không tự ý dùng kháng sinh.\n\nBạn có thể cho biết tuổi + cân nặng + triệu chứng để tôi tư vấn cụ thể hơn?',
    followUp: ['Liều Paracetamol theo cân nặng', 'Vitamin cho trẻ', 'Siro ho nào tốt?'],
  },
  {
    keywords: ['tương tác', 'kết hợp', 'uống cùng'],
    response:
      'Tương tác thuốc có thể tăng/giảm tác dụng, gây tác dụng phụ nguy hiểm. Ví dụ phổ biến:\n\n• Ibuprofen + Aspirin: tăng nguy cơ xuất huyết dạ dày\n• Metformin + rượu: tăng nguy cơ hạ đường huyết\n• Amlodipine + Ibuprofen: giảm tác dụng hạ áp\n\nBạn dùng kết hợp thuốc gì?',
    followUp: ['Kiểm tra tương tác', 'Thuốc với thức ăn', 'Thuốc với đồ uống'],
  },
  {
    keywords: ['đau đầu', 'migraine'],
    response:
      'Đau đầu nhẹ: Paracetamol 500mg hoặc Ibuprofen 400mg, uống với nước, nghỉ ngơi.\n\nĐau đầu kéo dài > 3 ngày, kèm sốt, nôn, mờ mắt → đi khám ngay.\n\nNguyên nhân thường gặp: stress, mất nước, thiếu ngủ, màn hình nhiều. Bạn bị đau bao lâu rồi?',
    followUp: ['Đau nửa đầu', 'Đau đầu khi mang thai', 'Thuốc giảm đau không kê đơn'],
  },
  {
    keywords: ['vitamin', 'bổ sung', 'supplement'],
    response:
      'Vitamin thiết yếu: D3 (1000-2000 IU/ngày), C (500-1000mg), B-complex, Omega-3.\n\n⚠️ Không tự ý bổ sung vitamin A, D, K liều cao (tích tụ trong cơ thể).\n\nBạn đang cần bổ sung cho mục đích gì?',
    followUp: ['Vitamin cho người lớn', 'Vitamin cho trẻ em', 'Vitamin cho bà bầu'],
  },
  {
    keywords: ['cảm cúm', 'cảm lạnh', 'sổ mũi', 'ho'],
    response:
      'Cảm thường (do rhinovirus) tự khỏi trong 7-10 ngày. Điều trị triệu chứng: Paracetamol (sốt/đau), thuốc thông mũi, mật ong (ho).\n\nCúm (do influenza virus) có thể nặng hơn. Nên tiêm vaccine cúm hàng năm.\n\nKhám bác sĩ nếu: sốt > 39°C, khó thở, đau ngực, triệu chứng kéo dài > 10 ngày.',
    followUp: ['Siro ho', 'Thuốc thông mũi', 'Tiêm vaccine cúm'],
  },
  {
    keywords: ['covid', 'corona'],
    response:
      'Triệu chứng COVID-19: sốt, ho, mệt mỏi, mất vị giác/khứu giác. Hầu hết ca nhẹ tự khỏi trong 5-7 ngày.\n\nNên test nhanh nếu có triệu chứng. Nhóm nguy cơ cao (cao tuổi, bệnh nền) → đi khám sớm.\n\nVaccine COVID-19 miễn phí tại các cơ sở công. Bạn có triệu chứng cụ thể nào?',
    followUp: ['Vaccine COVID', 'Test nhanh', 'Theo dõi tại nhà'],
  },
  {
    keywords: ['tiểu đường', 'đường huyết', 'diabetes'],
    response:
      'Tiểu đường type 2: Metformin 500mg/lần, 2-3 lần/ngày sau ăn là lựa chọn đầu tay. Theo dõi đường huyết thường xuyên, HbA1c mỗi 3 tháng.\n\nChế độ ăn: hạn chế đường, tinh bột trắng; ưu tiên rau xanh, protein nạc. Vận động 30 phút/ngày.\n\n⚠️ Không tự ý ngưng thuốc. Bạn đang dùng thuốc gì?',
    followUp: ['Đo đường huyết tại nhà', 'Chế độ ăn cho người tiểu đường', 'Bệnh nền đi kèm'],
  },
];

const FALLBACK_RESPONSE = `Tôi hiểu bạn đang quan tâm. Đây là thông tin tham khảo, không thay thế tư vấn y khoa.\n\nĐể tôi hỗ trợ chính xác hơn, bạn có thể mô tả chi tiết:\n• Triệu chứng cụ thể (đau, sốt, ho...)\n• Thời gian xuất hiện (bao lâu, khi nào)\n• Thuốc đang dùng\n• Đối tượng (người lớn, trẻ em, bà bầu)\n\nNgoài ra bạn có thể đặt lịch tư vấn 1-1 với dược sĩ tại /dat-lich-tu-van.`;

const FALLBACK_FOLLOWUP = [
  'Tư vấn dược sĩ 1-1',
  'Tra cứu thuốc',
  'Đặt lịch tư vấn',
];

export function getAIResponse(query: string): { response: string; followUp?: string[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { response: 'Bạn muốn hỏi về vấn đề gì?', followUp: [] };

  for (const intent of AI_INTENTS) {
    if (intent.keywords.some((k) => q.includes(k))) {
      return { response: intent.response, followUp: intent.followUp };
    }
  }

  return { response: FALLBACK_RESPONSE, followUp: FALLBACK_FOLLOWUP };
}
