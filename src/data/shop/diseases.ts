// =====================================================
// Mock data: Bệnh thường gặp (Common diseases)
// Tra cứu thông tin bệnh: triệu chứng, nguyên nhân, điều trị
// =====================================================

export type DiseaseCategory =
  | 'hô hấp'
  | 'tiêu hóa'
  | 'tim mạch'
  | 'nội tiết'
  | 'thần kinh'
  | 'cơ xương khớp'
  | 'da liễu'
  | 'nhi khoa';

export interface Disease {
  slug: string;
  name: string;
  category: DiseaseCategory;
  icd10?: string; // mã ICD-10
  summary: string; // mô tả ngắn
  symptoms: string[]; // triệu chứng
  causes: string[]; // nguyên nhân
  riskFactors: string[]; // yếu tố nguy cơ
  diagnosis: string[]; // chẩn đoán
  treatment: string; // điều trị
  prevention: string[]; // phòng ngừa
  whenToSeeDoctor: string; // khi nào cần đi khám
  relatedArticleSlugs: string[];
}

export const DISEASES: Disease[] = [
  {
    slug: 'cum-mua',
    name: 'Cúm mùa (Influenza)',
    category: 'hô hấp',
    icd10: 'J10-J11',
    summary:
      'Cúm mùa là bệnh nhiễm trùng đường hô hấp cấp do virus cúm (influenza A, B). Bệnh thường tự khỏi trong 5–7 ngày nhưng có thể gây biến chứng nặng ở nhóm nguy cơ cao.',
    symptoms: [
      'Sốt cao đột ngột 38–40°C',
      'Ớn lạnh, đổ mồ hôi',
      'Đau đầu, đau cơ, đau khớp dữ dội',
      'Ho khan, đau họng',
      'Sổ mũi, nghẹt mũi',
      'Mệt mỏi, kiệt sức (kéo dài 1–2 tuần)',
    ],
    causes: [
      'Virus Influenza A (H1N1, H3N2) — chiếm ~70% ca',
      'Virus Influenza B',
      'Lây qua đường giọt bắn (ho, hắt hơi)',
      'Tiếp xúc với bề mặt nhiễm virus rồi đưa tay lên mũi/miệng/mắt',
    ],
    riskFactors: [
      'Trẻ em < 5 tuổi, đặc biệt < 2 tuổi',
      'Người ≥ 65 tuổi',
      'Phụ nữ mang thai',
      'Bệnh mạn: hen, COPD, tim mạch, đái tháo đường, suy giảm miễn dịch',
      'Béo phì (BMI > 40)',
      'Cư trú tại viện dưỡng lão',
    ],
    diagnosis: [
      'Lâm sàng: triệu chứng điển hình + dịch tễ',
      'Test nhanh kháng nguyên virus (15–30 phút) — độ nhạy 50–70%',
      'RT-PCR (real-time PCR) — tiêu chuẩn vàng, độ nhạy > 95%',
      'Công thức máu: thường giảm bạch cầu lympho',
    ],
    treatment:
      '**Hỗ trợ** (hầu hết ca): nghỉ ngơi, bù nước, hạ sốt (paracetamol). Tránh aspirin ở trẻ em (hội chứng Reye). **Kháng virus** (nếu có yếu tố nguy cơ cao hoặc nhập viện): Oseltamivir (Tamiflu) 75 mg x 2 lần/ngày x 5 ngày, tốt nhất trong 48 giờ đầu. **Kháng sinh**: chỉ khi có bội nhiễm vi khuẩn (viêm phổi, viêm xoang).',
    prevention: [
      'Tiêm vaccine cúm hằng năm (hiệu quả 40–60%)',
      'Rửa tay thường xuyên với xà phòng hoặc dung dịch sát khuẩn',
      'Đeo khẩu trang khi đến nơi đông người',
      'Tránh tiếp xúc gần với người bệnh',
      'Che miệng khi ho/hắt hơi',
      'Tăng cường sức đề kháng: ăn uống, ngủ đủ, vận động',
    ],
    whenToSeeDoctor:
      'Khó thở, đau ngực, sốt cao > 3 ngày không hạ, nôn không uống được, lú lẫn, da xanh tím. Nhóm nguy cơ cao (trẻ < 2 tuổi, người > 65, mang thai, bệnh mạn) nên đi khám sớm trong 48 giờ đầu để được kê kháng virus.',
    relatedArticleSlugs: ['phong-cum-mua-bang-vaccine'],
  },
  {
    slug: 'tieu-duong-type-2',
    name: 'Đái tháo đường type 2',
    category: 'nội tiết',
    icd10: 'E11',
    summary:
      'Đái tháo đường type 2 là bệnh rối loạn chuyển hóa mạn tính, đặc trưng bởi tăng đường huyết do đề kháng insulin hoặc thiếu insulin tương đối. Chiếm 90–95% các ca đái tháo đường.',
    symptoms: [
      'Khát nhiều, uống nhiều (polydipsia)',
      'Tiểu nhiều, tiểu đêm (polyuria)',
      'Sụt cân không rõ nguyên nhân',
      'Mệt mỏi, uể oải',
      'Nhìn mờ',
      'Vết thương lâu lành',
      'Nhiễm trùng tái phát (nấm âm đạo, tiết niệu)',
    ],
    causes: [
      'Đề kháng insulin (tế bào không đáp ứng với insulin)',
      'Suy giảm chức năng tế bào β tụy (giảm tiết insulin)',
      'Yếu tố di truyền + lối sống',
    ],
    riskFactors: [
      'Thừa cân, béo phì (BMI > 25)',
      'Ít vận động',
      'Tiền sử gia đình có người đái tháo đường',
      'Tuổi ≥ 45',
      'Tiền đái tháo đường (rối loạn đường huyết đói)',
      'Hội chứng buồng trứng đa nang (PCOS)',
      'Tiền sử đái tháo đường thai kỳ',
      'Tăng huyết áp, rối loạn lipid máu',
    ],
    diagnosis: [
      'Đường huyết lúc đói ≥ 126 mg/dL (7 mmol/L), xét nghiệm 2 lần',
      'Đường huyết ngẫu nhiên ≥ 200 mg/dL (11,1 mmol/L) + có triệu chứng',
      'HbA1c ≥ 6,5%',
      'Nghiệm pháp dung nạp glucose (OGTT) 2 giờ ≥ 200 mg/dL',
    ],
    treatment:
      '**Thay đổi lối sống** (nền tảng): giảm cân 5–10%, vận động 150 phút/tuần, DASH/Mediterranean diet. **Thuốc uống**: Metformin (hàng đầu), Sulfonylurea (Gliclazide), DPP-4 inhibitor (Sitagliptin), GLP-1 agonist (Semaglutide), SGLT2 inhibitor (Empagliflozin). **Insulin**: khi thuốc uống không đủ kiểm soát. **Mục tiêu đường huyết**: đói 80–130 mg/dL, sau ăn 2h < 180 mg/dL, HbA1c < 7%.',
    prevention: [
      'Duy trì BMI 18,5–22,9',
      'Vận động 30 phút/ngày',
      'Ăn nhiều rau xanh, giảm tinh bột tinh chế, đường',
      'Khám sức khỏe định kỳ 6 tháng/lần (nếu > 45 tuổi)',
      'Bỏ thuốc lá, hạn chế rượu',
    ],
    whenToSeeDoctor:
      'Có triệu chứng kinh điển (khát nhiều, tiểu nhiều, sụt cân). Người có yếu tố nguy cơ nên tầm soát đường huyết định kỳ 1–3 năm/lần. Đường huyết > 300 mg/dL hoặc có triệu chứng nhiễm toan ceton (buồn nôn, nôn, thở nhanh sâu, hơi thở mùi táo) cần cấp cứu ngay.',
    relatedArticleSlugs: ['tang-huyet-ap-song-lau-nhu-the-nao', 'dinh-duong-cho-ba-bau'],
  },
  {
    slug: 'viem-da-co-dia',
    name: 'Viêm da cơ địa (Atopic Dermatitis / Eczema)',
    category: 'da liễu',
    icd10: 'L20',
    summary:
      'Viêm da cơ địa là bệnh viêm da mạn tính, tái phát, thường gặp ở trẻ em. Đặc trưng bởi khô da, ngứa, mẩn đỏ. Có liên quan đến cơ địa dị ứng (hen, viêm mũi dị ứng).',
    symptoms: [
      'Da khô, bong vảy, thô ráp',
      'Ngứa dữ dội (đặc biệt về đêm)',
      'Mẩn đỏ, sưng, có thể phù nề',
      'Mụn nước, rỉ dịch (khi cấp)',
      'Dày da, lichen hóa (khi mạn)',
      'Ở trẻ nhỏ: thường ở má, khuỷu, đầu gối',
      'Ở người lớn: khuỷu, khoeo, cổ, mặt',
    ],
    causes: [
      'Rối loạn hàng rào bảo vệ da (giảm filaggrin, ceramide)',
      'Phản ứng viêm quá mức với tác nhân kích thích',
      'Yếu tố di truyền (gen filaggrin, TẾ BÀO Th2)',
      'Liên quan với "cuộc diễu hành dị ứng" (atopic march): eczema → hen → viêm mũi dị ứng',
    ],
    riskFactors: [
      'Tiền sử gia đình có bệnh dị ứng',
      'Khí hậu khô hanh, lạnh',
      'Tiếp xúc chất gây kích ứng: xà phòng, len, chất tẩy rửa',
      'Stress, mất ngủ',
      'Dị ứng thức ăn (sữa bò, trứng, đậu phộng) — thường ở trẻ nhỏ',
      'Nhiễm trùng da (tụ cầu)',
    ],
    diagnosis: [
      'Chủ yếu dựa lâm sàng (tiêu chuẩn Hanifin & Rajka)',
      'Xét nghiệm IgE toàn phần tăng, có thể có dị nguyên đặc hiệu IgE',
      'Test áp da (patch test) nếu nghi ngờ dị ứng tiếp xúc',
      'Sinh thiết da (hiếm khi cần)',
    ],
    treatment:
      '**Nền tảng**: dưỡng ẩm thường xuyên (2–3 lần/ngày) ngay cả khi không có triệu chứng. Dùng sản phẩm không mùi, không chất bảo quản. **Cấp tính**: corticosteroid bôi (Hydrocortisone 1% cho mặt, Betamethasone cho thân/chi), bôi đúng vùng, đúng thời gian (1–2 tuần). **Nặng/kháng steroid**: Tacrolimus, Pimecrolimus (ức chế calcineurin). **Sinh học**: Dupilumab (tiêm dưới da) cho ca nặng. **Chống ngứa**: kháng histamin đường uống.',
    prevention: [
      'Dưỡng ẩm hằng ngày, đặc biệt sau tắm',
      'Tắm nước ấm (không nóng), 5–10 phút',
      'Dùng sữa tắm dịu nhẹ, pH thấp',
      'Tránh xà phòng mạnh, chất tẩy rửa',
      'Mặc quần áo cotton rộng rãi',
      'Cắt móng tay trẻ để tránh gãi',
      'Tránh thức ăn gây dị ứng (nếu đã xác định)',
    ],
    whenToSeeDoctor:
      'Bùng phát nặng không đáp ứng với dưỡng ẩm + corticoid bôi. Có dấu hiệu bội nhiễm (mủ, sốt, da đỏ lan rộng). Ảnh hưởng giấc ngủ, sinh hoạt. Trẻ < 1 tuổi mới xuất hiện cần khám để phân biệt với bệnh khác.',
    relatedArticleSlugs: ['roi-loan-giac-ngu-nguyen-nhan-va-cach-dieu-tri'],
  },
  {
    slug: 'dau-vai-gay',
    name: 'Đau vai gáy (Cervicalgia)',
    category: 'cơ xương khớp',
    icd10: 'M54.2',
    summary:
      'Đau vai gáy là hội chứng đau vùng cổ-vai-gáy, phổ biến ở người làm việc văn phòng. Hầu hết là do căng cơ, sai tư thế; cần loại trừ nguyên nhân nặng (thoát vị đĩa đệm, viêm khớp).',
    symptoms: [
      'Đau cổ, vai, gáy — thường một bên',
      'Cứng cổ, khó xoay đầu',
      'Có thể lan xuống vai, cánh tay, đầu (gây đau đầu)',
      'Căng cơ cổ khi sờ nắn',
      'Tê, dị cảm tay nếu chèn ép thần kinh',
      'Đau tăng khi giữ một tư thế lâu',
    ],
    causes: [
      'Căng cơ do sai tư thế (ngồi lâu, cúi đầu nhiều)',
      'Thoái hóa cột sống cổ (tuổi trung niên)',
      'Thoát vị đĩa đệm cổ',
      'Chấn thương (whiplash)',
      'Viêm khớp, viêm cơ',
      'Stress, căng thẳng (tăng co cơ)',
    ],
    riskFactors: [
      'Làm việc văn phòng, sử dụng máy tính > 4 giờ/ngày',
      'Tư thế cúi đầu xem điện thoại ("text neck")',
      'Lái xe đường dài',
      'Ít vận động',
      'Stress, mất ngủ',
      'Béo phì',
    ],
    diagnosis: [
      'Chủ yếu lâm sàng: hỏi bệnh, khám vận động cổ',
      'Chụp X-quang cổ thường quy: phát hiện thoái hóa, gai xương',
      'MRI cổ: khi nghi ngờ thoát vị đĩa đệm, chèn ép tủy',
      'Điện cơ (EMG): khi có triệu chứng thần kinh',
    ],
    treatment:
      '**Cấp tính**: nghỉ ngơi, chườm nóng/lạnh, paracetamol hoặc NSAID ngắn ngày. **Vật lý trị liệu**: xoa bóp, kéo giãn, siêu âm trị liệu, điện xung. **Tập luyện**: bài tập cổ vai gáy (kéo giãn, tăng cường sức mạnh). **Thuốc giãn cơ** (Eperisone) nếu căng cơ nhiều. **Tiêm corticosteroid** cạnh khớp nếu viêm. **Phẫu thuật** (hiếm): khi thoát vị đĩa đệm gây chèn ép tủy sống nặng.',
    prevention: [
      'Tư thế làm việc đúng: màn hình ngang tầm mắt, lưng tựa ghế',
      'Nghỉ giải lao 5 phút mỗi 30–60 phút',
      'Bài tập cổ vai gáy hằng ngày (10–15 phút)',
      'Gối ngủ phù hợp (không quá cao, không quá thấp)',
      'Yoga, bơi, pilates giúp tăng sức mạnh cơ cổ',
      'Tránh nằm xem điện thoại',
    ],
    whenToSeeDoctor:
      'Đau dữ dội không giảm sau 1–2 tuần tự chăm sóc. Có triệu chứng thần kinh: tê tay, yếu tay, đi không vững. Đau kèm sốt, sụt cân (nghi ngờ nhiễm trùng, ung thư). Sau chấn thương (tai nạn, ngã).',
    relatedArticleSlugs: ['roi-loan-giac-ngu-nguyen-nhan-va-cach-dieu-tri'],
  },
  {
    slug: 'viem-xoang',
    name: 'Viêm xoang (Sinusitis)',
    category: 'hô hấp',
    icd10: 'J01-J32',
    summary:
      'Viêm xoang là tình trạng viêm niêm mạc các xoang cạnh mũi. Chia thành cấp (< 4 tuần), bán cấp (4–12 tuần), mạn (> 12 tuần). Triệu chứng điển hình: nghẹt mũi, đau mặt, chảy mũi.',
    symptoms: [
      'Nghẹt mũi, khó thở bằng mũi',
      'Chảy mũi đặc, màu vàng/xanh (cấp tính)',
      'Đau mặt, nhức vùng xoang (trán, gò má, giữa 2 mắt)',
      'Giảm khứu giác',
      'Ho, đặc biệt nặng hơn về đêm',
      'Sốt nhẹ, mệt mỏi',
      'Đau đầu, đau răng hàm trên',
    ],
    causes: [
      'Nhiễm virus (phổ biến nhất, sau cảm cúm)',
      'Nhiễm vi khuẩn (S. pneumoniae, H. influenzae, M. catarrhalis)',
      'Dị ứng (viêm mũi dị ứng)',
      'Vẹo vách ngăn mũi, polyp mũi',
      'Răng nhiễm trùng (xoang hàm)',
      'Ô nhiễm, khói thuốc',
    ],
    riskFactors: [
      'Tiền sử viêm mũi dị ứng, hen',
      'Vẹo vách ngăn, polyp mũi',
      'Hút thuốc lá, tiếp xúc khói thuốc',
      'Suy giảm miễn dịch',
      'Trào ngược dạ dày thực quản (GERD)',
      'Bơi lội thường xuyên',
    ],
    diagnosis: [
      'Lâm sàng: triệu chứng + nội soi mũi (niêm mạc phù nề, mủ)',
      'CT scan xoang: tiêu chuẩn vàng cho chẩn đoán, đánh giá mức độ',
      'X-quang xoang: ít giá trị, gần như đã thay thế bằng CT',
      'Cấy mủ xoang: khi nghi ngờ vi khuẩn kháng thuốc',
    ],
    treatment:
      '**Cấp tính do virus** (90%): điều trị triệu chứng — rửa mũi nước muối sinh lý, thuốc co mạch mũi (Xylometazoline, tối đa 5–7 ngày), paracetamol giảm đau. **Vi khuẩn**: kháng sinh Amoxicillin-clavulanate 500/125 mg × 3 lần/ngày × 7–10 ngày (hàng đầu). **Bổ sung**: corticoid xịt mũi (Mometasone, Fluticasone) giảm viêm. **Mạn tính/phẫu thuật**: nội soi mũi xoang (FESS), mở lỗ thông xoang, cắt polyp.',
    prevention: [
      'Rửa mũi nước muối hằng ngày',
      'Tránh chất gây dị ứng: bụi, phấn hoa, lông thú',
      'Không hút thuốc, tránh khói thuốc',
      'Điều trị tốt viêm mũi dị ứng, GERD',
      'Uống đủ nước, giữ ẩm không khí',
      'Tiêm vaccine cúm hằng năm',
    ],
    whenToSeeDoctor:
      'Triệu chứng > 10 ngày không cải thiện hoặc nặng dần. Sốt cao > 39°C, đau mặt dữ dội, phù nề quanh mắt (nghi biến chứng). Chảy mũi một bên có máu (cần loại trừ u). Giảm thị lực, đau đầu dữ dội (cấp cứu).',
    relatedArticleSlugs: ['cum-mua'],
  },
  {
    slug: 'roi-loan-tieu-hoa',
    name: 'Rối loạn tiêu hóa chức năng (Functional Dyspepsia)',
    category: 'tiêu hóa',
    icd10: 'K30',
    summary:
      'Rối loạn tiêu hóa chức năng là tình trạng đau, khó chịu vùng thượng vị kéo dài mà không tìm thấy tổn thương thực thể khi nội soi. Ảnh hưởng 10–20% dân số, gây giảm chất lượng cuộc sống đáng kể.',
    symptoms: [
      'Đau hoặc nóng rát vùng thượng vị (trên rốn)',
      'Ăn nhanh no, đầy bụng sau ăn',
      'Buồn nôn, ói (ít gặp)',
      'Ợ hơi, ợ chua, đầy hơi',
      'Triệu chứng kéo dài > 4–8 tuần',
      'Không giảm cân, không sốt (khác với tổn thương thực thể)',
    ],
    causes: [
      'Tăng nhạy cảm thụ cảm visceral (nội tạng)',
      'Rối loạn vận động dạ dày-tá tràng',
      'Stress, lo âu, trầm cảm',
      'Thay đổi microbiome đường ruột',
      'Yếu tố tâm lý xã hội',
    ],
    riskFactors: [
      'Nữ giới (tỷ lệ mắc cao hơn nam)',
      'Tuổi trẻ-trung niên',
      'Stress, mất ngủ',
      'Tiền sử nhiễm H. pylori',
      'Hút thuốc, rượu bia',
      'Chế độ ăn không điều độ',
    ],
    diagnosis: [
      'Lâm sàng theo tiêu chuẩn ROME IV: triệu chứng ≥ 8 tuần, ≥ 1 tiêu chí',
      'Nội soi dạ dày-tá tràng: loại trừ viêm loét, ung thư',
      'Test H. pylori (urea breath test, test phân)',
      'Siêu âm bụng: loại trừ bệnh gan-mật-tụy',
      'Xét nghiệm máu: công thức máu, chức năng gan, đường huyết',
    ],
    treatment:
      '**Giải thích + giáo dục** là quan trọng nhất (bệnh lành tính, không phải ung thư). **Điều trị triệu chứng**: PPI (Omeprazole 20 mg sáng, 4–8 tuần) cho triệu chứng giống loét. **Prokinetics** (Domperidone, Itopride) cho triệu chứng đầy bụng, chậm tiêu. **Thuốc chống co thắt** (Buscopan) cho đau co cứng. **Diệt H. pylori** nếu dương tính. **Tâm lý**: liệu pháp nhận thức hành vi, giảm stress.',
    prevention: [
      'Ăn uống điều độ, đúng giờ',
      'Ăn chậm, nhai kỹ',
      'Hạn chế thức ăn cay, nhiều dầu mỡ, cà phê, rượu',
      'Quản lý stress: tập thể dục, thiền, yoga',
      'Ngủ đủ giấc',
      'Không hút thuốc lá',
    ],
    whenToSeeDoctor:
      'Sụt cân không chủ ý, khó nuốt, nôn ra máu, đau nặng về đêm, thiếu máu (hoa mắt, da xanh). Triệu chứng > 8 tuần không cải thiện. Tiền sử gia đình ung thư dạ dày. Tuổi > 50 có triệu chứng tiêu hóa mới xuất hiện (cần nội soi loại trừ).',
    relatedArticleSlugs: ['roi-loan-giac-ngu-nguyen-nhan-va-cach-dieu-tri'],
  },
];

export const DISEASE_CATEGORIES: { id: DiseaseCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'hô hấp', label: 'Hô hấp' },
  { id: 'tiêu hóa', label: 'Tiêu hóa' },
  { id: 'tim mạch', label: 'Tim mạch' },
  { id: 'nội tiết', label: 'Nội tiết' },
  { id: 'thần kinh', label: 'Thần kinh' },
  { id: 'cơ xương khớp', label: 'Cơ xương khớp' },
  { id: 'da liễu', label: 'Da liễu' },
  { id: 'nhi khoa', label: 'Nhi khoa' },
];

export function getDiseaseBySlug(slug: string): Disease | null {
  return DISEASES.find((d) => d.slug === slug) ?? null;
}

export function getDiseasesByCategory(category: DiseaseCategory | 'all'): Disease[] {
  if (category === 'all') return DISEASES;
  return DISEASES.filter((d) => d.category === category);
}

export function searchDiseases(query: string): Disease[] {
  const q = query.trim().toLowerCase();
  if (!q) return DISEASES;
  return DISEASES.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.symptoms.some((s) => s.toLowerCase().includes(q))
  );
}
