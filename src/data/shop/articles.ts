// =====================================================
// Mock data: Bài viết sức khỏe
// Dùng cho /customer/bai-viet (list + detail)
// =====================================================

export type ArticleCategory =
  | 'sức khỏe tổng quát'
  | 'dinh dưỡng'
  | 'thai kỳ & trẻ em'
  | 'bệnh mạn tính'
  | 'phòng bệnh'
  | 'mẹo vặt';

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string; // tóm tắt ngắn
  content: string; // HTML/markdown
  author: string;
  authorTitle?: string;
  publishedAt: string; // ISO
  readingMinutes: number;
  cover?: string; // ảnh bìa
  tags: string[];
  relatedArticleSlugs: string[];
}

const now = Date.now();
const day = (n: number) => new Date(now - n * 86400000).toISOString();

export const ARTICLES: Article[] = [
  {
    slug: 'huong-dan-su-dung-paracetamol-dung-cach',
    title: 'Hướng dẫn sử dụng Paracetamol đúng cách cho cả gia đình',
    category: 'sức khỏe tổng quát',
    excerpt:
      'Paracetamol là thuốc hạ sốt, giảm đau phổ biến nhưng dễ dùng sai. Bài viết hướng dẫn liều chuẩn theo cân nặng, cảnh báo quá liều, và tương tác cần tránh.',
    content: `## Khi nào nên dùng Paracetamol?

Paracetamol (acetaminophen) là lựa chọn hàng đầu cho:
- **Sốt** trên 38,5°C ở người lớn, trên 38°C ở trẻ em
- **Đau nhẹ đến vừa**: đau đầu, đau răng, đau cơ, đau khớp
- **Đau bụng kinh**, đau sau tiêm chủng
- **Đau sau phẫu thuật nhẹ**

## Liều dùng chuẩn theo cân nặng

Liều khuyến cáo: **10–15 mg/kg mỗi 4–6 giờ**, tối đa 4 liều/24 giờ.

| Đối tượng | Liều/lần | Khoảng cách | Tối đa/24h |
|-----------|----------|-------------|------------|
| Người lớn & trẻ > 12 tuổi | 500 mg – 1 g | 4–6 giờ | 4 g |
| Trẻ 6–12 tuổi | 250 – 500 mg | 4–6 giờ | 2 g |
| Trẻ 6 tháng – 6 tuổi | 10–15 mg/kg | 4–6 giờ | theo cân nặng |

## Cảnh báo quá liều

- Quá liều cấp (> 10 g ở người lớn) gây **hoại tử tế bào gan**, có thể tử vong
- Triệu chứng sớm (24 giờ đầu) thường mờ nhạt: buồn nôn, nôn, chán ăn
- **Cần nhập viện cấp cứu ngay** nếu nghi ngờ quá liều, dù chưa có triệu chứng
- Có thuốc giải độc **N-acetylcysteine (NAC)** nếu đến viện trong vòng 8–10 giờ

## Tương tác cần tránh

- **Rượu**: tăng độc tính gan — không uống rượu khi đang dùng paracetamol
- **Warfarin**: dùng liều cao kéo dài có thể tăng INR
- **Isoniazid** (thuốc lao): tăng nguy cơ viêm gan
- Không dùng chung với thuốc khác chứa paracetamol (tránh quá liều) — kiểm tra thành phần trên bao bì

## Khi nào cần gặp bác sĩ

- Sốt cao > 39°C không hạ sau 3 ngày
- Đau kéo dài > 5 ngày không giảm
- Phát ban, vàng da, nước tiểu sẫm màu
- Có bệnh gan, thận mạn tính`,
    author: 'DS. Nguyễn Văn An',
    authorTitle: 'Dược sĩ lâm sàng, 12 năm kinh nghiệm',
    publishedAt: day(5),
    readingMinutes: 6,
    tags: ['paracetamol', 'hạ sốt', 'giảm đau'],
    relatedArticleSlugs: ['dung-thuoc-khong-ke-don-sao-cho-an-toan'],
  },
  {
    slug: 'dung-thuoc-khong-ke-don-sao-cho-an-toan',
    title: 'Dùng thuốc không kê đơn (OTC) sao cho an toàn?',
    category: 'sức khỏe tổng quát',
    excerpt:
      'Thuốc OTC (không cần đơn bác sĩ) vẫn có thể gây hại nếu dùng sai. Hướng dẫn 5 bước để tự dùng thuốc an toàn tại nhà.',
    content: `## Thuốc OTC là gì?

Thuốc OTC (Over-the-counter) là thuốc không cần đơn của bác sĩ, có thể mua tại nhà thuốc. Tuy nhiên, "không cần đơn" không có nghĩa là "không có hại".

## 5 nguyên tắc vàng

1. **Đọc kỹ hướng dẫn trước khi dùng** — đặc biệt phần "Chống chỉ định" và "Tác dụng phụ"
2. **Không dùng quá liều khuyến cáo** — "nhiều hơn" không có nghĩa là "tốt hơn"
3. **Không kéo dài thời gian dùng** — nếu không đỡ sau 3–5 ngày, đi khám
4. **Cảnh giác tương tác thuốc** — báo cho dược sĩ biết các thuốc đang dùng
5. **Để xa tầm tay trẻ em** — bảo quản trong tủ có khóa

## Nhóm thuốc OTC phổ biến cần thận trọng

### Paracetamol + Ibuprofen
- Phối hợp có thể tăng hiệu quả hạ sốt nhưng cần dùng **cách nhau 4–6 giờ**, không dùng đồng thời
- Trẻ em: chỉ dùng khi có chỉ định của bác sĩ/dược sĩ

### Thuốc kháng histamin (Cetirizine, Loratadine)
- Thế hệ 1 (Chlorpheniramine) gây buồn ngủ nặng — không lái xe
- Thế hệ 2 (Cetirizine, Loratadine) ít buồn ngủ hơn

### Thuốc kháng acid (Omeprazole, Pantoprazole OTC)
- Chỉ dùng ≤ 14 ngày không kê đơn
- Che giấu triệu chứng nặng — đi khám nếu kéo dài

## Khi nào cần dừng thuốc và đi khám ngay

- Phản ứng dị ứng: phát ban, khó thở, sưng mặt
- Tiêu hóa: đau dạ dày dữ dội, nôn ra máu, phân đen
- Thần kinh: đau đầu nặng, chóng mặt, nhìn mờ
- Triệu chứng không cải thiện sau 3–5 ngày`,
    author: 'DS. Trần Thị Bình',
    authorTitle: 'Dược sĩ cộng đồng, Bệnh viện Bạch Mai',
    publishedAt: day(12),
    readingMinutes: 8,
    tags: ['OTC', 'tự dùng thuốc', 'an toàn'],
    relatedArticleSlugs: ['huong-dan-su-dung-paracetamol-dung-cach'],
  },
  {
    slug: 'dinh-duong-cho-ba-bau',
    title: 'Dinh dưỡng 3 tháng đầu thai kỳ: những điều mẹ cần biết',
    category: 'thai kỳ & trẻ em',
    excerpt:
      '3 tháng đầu là giai đoạn quan trọng nhất cho sự phát triển thai nhi. Hướng dẫn dinh dưỡng, bổ sung vitamin cần thiết và những thực phẩm cần tránh.',
    content: `## Vai trò của 3 tháng đầu

3 tháng đầu thai kỳ là giai đoạn hình thành các cơ quan quan trọng của thai nhi (não, tim, ống thần kinh). Dinh dưỡng đúng giúp giảm 50–70% nguy cơ dị tật bẩm sinh.

## Bổ sung bắt buộc

### Acid Folic (Vitamin B9)
- **Liều: 400–800 mcg/ngày**, bắt đầu từ trước khi có thai 1 tháng
- Phòng dị tật ống thần kinh (nứt đốt sống, vô sọ)
- Có trong: rau xanh đậm, đậu lăng, cam, bánh mì nguyên cám

### Sắt
- 27 mg/ngày từ tuần thứ 12 (khi lượng máu tăng)
- Kết hợp vitamin C để tăng hấp thu
- Tránh uống cùng canxi, trà, cà phê

### Canxi + Vitamin D
- 1000 mg canxi + 600 IU vitamin D/ngày
- Giúp phát triển xương và răng thai nhi

### Omega-3 (DHA)
- 200–300 mg DHA/ngày
- Quan trọng cho phát triển não và thị lực

## Thực phẩm cần tránh

- **Cá có hàm lượng thủy ngân cao**: cá mập, cá kiếm, cá ngừ đóng hộp > 170g/tuần
- **Thực phẩm sống**: sushi, thịt tái, trứng sống, phô mai chưa tiệt trùng
- **Rượu bia**: không có ngưỡng an toàn
- **Caffeine**: tối đa 200 mg/ngày (~1–2 cốc cà phê)
- **Gan động vật**: quá nhiều vitamin A có thể gây dị tật

## Triệu chứng thường gặp & cách xử lý

### Ốm nghén (60–80% mẹ bầu)
- Ăn nhiều bữa nhỏ, tránh để bụng đói
- Gừng tươi: hãm nước uống ấm
- Vitamin B6 (10–25 mg, 3 lần/ngày) — hỏi bác sĩ trước

### Mệt mỏi
- Nghỉ ngơi nhiều hơn, ngủ trưa 30–60 phút
- Sắt có thể gây táo bón — uống nhiều nước, ăn chất xơ

## Khám thai định kỳ

- Lần đầu: 8–12 tuần
- Siêu âm sàng lọc dị tật: 11–13 tuần (đo độ mờ da gáy)
- Double test/triple test: 15–20 tuần
- Siêu âm 4D: 22–24 tuần`,
    author: 'BS. Lê Hoàng Yến',
    authorTitle: 'Bác sĩ Sản phụ khoa, BV Từ Dũ',
    publishedAt: day(20),
    readingMinutes: 10,
    tags: ['thai kỳ', 'dinh dưỡng', 'acid folic', 'omega-3'],
    relatedArticleSlugs: ['lam-sao-de-be-an-ngon-hon'],
  },
  {
    slug: 'tang-huyet-ap-song-lau-nhu-the-nao',
    title: 'Tăng huyết áp — sống lâu và khỏe mạnh với bệnh mạn tính',
    category: 'bệnh mạn tính',
    excerpt:
      'Tăng huyết áp là "kẻ giết người thầm lặng". Hướng dẫn chẩn đoán, điều trị, và thay đổi lối sống để kiểm soát huyết áp bền vững.',
    content: `## Huyết áp bình thường là bao nhiêu?

| Phân loại | Tâm thu (mmHg) | Tâm trương (mmHg) |
|-----------|----------------|-------------------|
| Bình thường | < 120 | < 80 |
| Tiền tăng huyết áp | 120–139 | 80–89 |
| Tăng huyết áp độ 1 | 140–159 | 90–99 |
| Tăng huyết áp độ 2 | ≥ 160 | ≥ 100 |

## Tại sao gọi là "kẻ giết người thầm lặng"?

80% người tăng huyết áp **không có triệu chứng** giai đoạn đầu. Bệnh âm thầm gây tổn thương:
- Tim: phì đại, suy tim, nhồi máu
- Não: đột quỵ, sa sút trí tuệ
- Thận: suy thận mạn
- Mắt: xuất huyết võng mạc, mù lòa
- Mạch máu: phình, bóc tách động mạch chủ

## Điều trị không dùng thuốc (rất quan trọng)

### DASH diet
- Giàu rau xanh, trái cây, ngũ cốc nguyên hạt
- Cá 2 lần/tuần
- Hạn chế muối < 5 g/ngày
- Giảm đồ uống có đường

### Vận động
- 150 phút/tuần vận động vừa phải (đi bộ nhanh, bơi, đạp xe)
- Chia 30 phút × 5 ngày/tuần
- Tập sức mạnh 2 lần/tuần

### Giảm cân
- BMI mục tiêu: 18,5–22,9
- Giảm 5–10% cân nặng đã có thể giảm 5–20 mmHg

### Hạn chế
- **Rượu**: ≤ 2 đơn vị/ngày (nam), ≤ 1 đơn vị/ngày (nữ)
- **Thuốc lá**: bỏ hoàn toàn
- **Caffeine**: hạn chế nếu nhạy cảm

## Nhóm thuốc thường dùng

| Nhóm | Ví dụ | Cơ chế |
|------|-------|--------|
| Ức chế men chuyển (ACEI) | Enalapril, Lisinopril | Giãn mạch, giảm tải cho tim |
| Chẹn beta | Atenolol, Metoprolol | Giảm nhịp tim, co bóp |
| Chẹn kênh canxi | Amlodipine, Nifedipine | Giãn mạch máu |
| Lợi tiểu | Hydrochlorothiazide, Furosemide | Giảm thể tích tuần hoàn |

## Tự theo dõi tại nhà

- Đo huyết áp **2 lần/ngày** (sáng trước khi uống thuốc, tối trước khi ngủ)
- Ghi vào sổ, mang theo khi khám
- Huyết áp mục tiêu: < 130/80 mmHg (theo hướng dẫn VNHA 2022)
- Gọi cấp cứu nếu HA > 180/120 mmHg kèm triệu chứng (đau ngực, khó thở, nhìn mờ)`,
    author: 'BS. Phạm Minh Tuấn',
    authorTitle: 'Bác sĩ Tim mạch, BV Chợ Rẫy',
    publishedAt: day(30),
    readingMinutes: 12,
    tags: ['tăng huyết áp', 'tim mạch', 'lối sống'],
    relatedArticleSlugs: ['dinh-duong-cho-ba-bau'],
  },
  {
    slug: 'phong-cum-mua-bang-vaccine',
    title: 'Phòng cúm mùa bằng vaccine: ai nên tiêm, khi nào, ở đâu?',
    category: 'phòng bệnh',
    excerpt:
      'Vaccine cúm giảm 40–60% nguy cơ mắc và 70–80% nguy cơ biến chứng nặng. Hướng dẫn tiêm chủng cho các nhóm nguy cơ cao.',
    content: `## Vaccine cúm hoạt động thế nào?

Vaccine cúm kích thích cơ thể tạo kháng thể chống lại các chủng virus cúm. Có 2 loại:

### Vaccine bất hoạt (IIV) — tiêm bắp
- Phổ biến nhất
- Chứa 3–4 chủng virus đã bất hoạt
- An toàn cho trẻ từ 6 tháng tuổi

### Vaccine sống giảm độc lực (LAIV) — xịt mũi
- Dùng cho người 2–49 tuổi khỏe mạnh, không mang thai
- Không dùng cho người suy giảm miễn dịch

## Lịch tiêm

- **Tiêm nhắc hằng năm** vì virus cúm thay đổi liên tục (WHO cập nhật thành phần vaccine mỗi năm)
- Thời điểm tốt nhất: **trước mùa cúm 2–4 tuần** (tại VN: tháng 9–11 hằng năm, trước mùa cúm tháng 12–3)
- Có thể tiêm quanh năm nếu chưa kịp

## Ai nên tiêm?

### Nhóm ưu tiên cao
- Trẻ em 6 tháng – 5 tuổi
- Người ≥ 65 tuổi
- Phụ nữ mang thai (bất kỳ tam cá nguyệt nào)
- Người có bệnh mạn: tim mạch, hô hấp, đái tháo đường, suy giảm miễn dịch, béo phì

### Nhóm nên tiêm
- Nhân viên y tế
- Người chăm sóc trẻ nhỏ, người cao tuổi
- Người làm việc trong môi trường đông người

### Ai KHÔNG nên tiêm
- Dị ứng nặng với thành phần vaccine (hiếm)
- Trẻ < 6 tháng tuổi
- Đang sốt cao (hoãn tiêm khi khỏe)

## Tác dụng phụ

- **Thường gặp** (1–2 ngày): đau, sưng tại chỗ tiêm, sốt nhẹ, mệt mỏi
- **Hiếm gặp**: phản ứng dị ứng nặng (1/1.000.000 liều)
- Vaccine cúm **KHÔNG gây bệnh cúm**

## Giá & địa điểm

- Tại các cơ sở y tế, trung tâm tiêm chủng (VNVC, Pasteur,…)
- Giá: 200.000 – 500.000 đồng/liều (tùy loại 3 chủng hay 4 chủng)
- Trẻ em chưa tiêm bao giờ: cần 2 liều cách nhau 4 tuần`,
    author: 'BS. Hoàng Thị Mai',
    authorTitle: 'Bác sĩ Y học dự phòng, CDC Việt Nam',
    publishedAt: day(45),
    readingMinutes: 7,
    tags: ['vaccine', 'cúm', 'phòng bệnh'],
    relatedArticleSlugs: ['tang-huyet-ap-song-lau-nhu-the-nao'],
  },
  {
    slug: 'lam-sao-de-be-an-ngon-hon',
    title: 'Làm sao để bé ăn ngon hơn? 7 mẹo thực tế từ chuyên gia',
    category: 'thai kỳ & trẻ em',
    excerpt:
      'Biếng ăn ở trẻ em là nỗi lo thường gặp. 7 nguyên tắc giúp trẻ ăn uống thoải mái, đủ chất mà không cần ép.',
    content: `## Hiểu nguyên nhân biếng ăn

Trẻ biếng ăn có thể do:
- **Sinh lý**: giai đoạn 2–3 tuổi (kén ăn tự nhiên)
- **Bệnh lý**: viêm amidan, thiếu máu, nhiễm trùng
- **Tâm lý**: bị ép ăn, ăn khi đang chơi
- **Thói quen**: ăn vặt trước bữa, uống sữa nhiều

## 7 nguyên tắc vàng

### 1. Không ép ăn
- Ép ăn tạo vòng xoắn tiêu cực: trẻ sợ ăn → càng biếng
- Nếu trẻ không ăn sau 20–30 phút, bỏ đi, đợi bữa sau

### 2. Bữa ăn có giờ giấc cố định
- 3 bữa chính + 2 bữa phụ
- Không cho ăn vặt ngoài bữa
- Bữa ăn không quá 30 phút

### 3. Trẻ ngồi ăn cùng gia đình
- Quan sát người lớn ăn → học theo
- Tránh mở TV, điện thoại trong bữa ăn

### 4. Đa dạng thực phẩm
- Mỗi tuần thử 1 món mới
- Trình bày đẹp, cắt hình thù ngộ nghĩnh

### 5. Để trẻ tham gia
- Đi chợ cùng mẹ
- Rửa rau, bày biện bàn ăn
- Trẻ tự xúc ăn dù vương vãi

### 6. Không dùng đồ ăn làm phần thưởng
- Tránh "ăn hết cơm sẽ được ăn kẹo"
- Tạo mối liên hệ tích cực với thức ăn

### 7. Bổ sung vi chất khi cần
- Kẽm: kích thích vị giác
- Vitamin nhóm B: tăng chuyển hóa
- Lysine: hỗ trợ hấp thu đạm

## Khi nào cần gặp bác sĩ

- Trẻ < 1 tuổi biếng ăn kéo dài > 2 tuần
- Sụt > 5% cân nặng trong 3 tháng
- Kèm sốt, nôn, tiêu chảy
- Chậm tăng trưởng, da xanh, tóc khô`,
    author: 'BS. Nguyễn Hà Linh',
    authorTitle: 'Bác sĩ Nhi khoa, BV Nhi Trung ương',
    publishedAt: day(60),
    readingMinutes: 8,
    tags: ['trẻ em', 'dinh dưỡng', 'biếng ăn'],
    relatedArticleSlugs: ['dinh-duong-cho-ba-bau'],
  },
  {
    slug: 'roi-loan-giac-ngu-nguyen-nhan-va-cach-dieu-tri',
    title: 'Rối loạn giấc ngủ — nguyên nhân và 7 cách cải thiện không dùng thuốc',
    category: 'sức khỏe tổng quát',
    excerpt:
      '1/3 người trưởng thành gặp rối loạn giấc ngủ. Hướng dẫn vệ sinh giấc ngủ (sleep hygiene) theo khuyến cáo của Hiệp hội Giấc ngủ Hoa Kỳ.',
    content: `## Tại sao giấc ngủ quan trọng?

Giấc ngủ không chỉ để nghỉ ngơi. Trong giấc ngủ sâu, cơ thể:
- Củng cố trí nhớ, học tập
- Sửa chữa tế bào, mô
- Điều hòa hormone (cortisol, melatonin, GH)
- Tăng cường hệ miễn dịch

Thiếu ngủ mạn tính tăng nguy cơ:
- Béo phì, đái tháo đường type 2
- Tăng huyết áp, bệnh tim mạch
- Trầm cảm, lo âu
- Tai nạn giao thông, sai sót công việc

## Bao nhiêu giờ ngủ là đủ?

| Nhóm tuổi | Số giờ/đêm |
|-----------|------------|
| Trẻ 3–5 tuổi | 10–13 giờ |
| Trẻ 6–13 tuổi | 9–11 giờ |
| Thanh thiếu niên 14–17 | 8–10 giờ |
| Người lớn 18–64 | 7–9 giờ |
| Người ≥ 65 tuổi | 7–8 giờ |

## 7 nguyên tắc vệ sinh giấc ngủ

### 1. Giờ ngủ - thức dậy cố định
- Cả tuần (kể cả cuối tuần) đều cùng giờ
- Sai lệch < 1 giờ

### 2. Phòng ngủ tối, mát, yên tĩnh
- Nhiệt độ 18–22°C
- Rèm cản sáng, nút tai nếu cần
- Không đồng hồ kim phát sáng trong tầm nhìn

### 3. Giường chỉ để ngủ
- Không xem TV, làm việc trên giường
- Não bộ sẽ liên kết "giường = ngủ"

### 4. Tránh caffeine sau 14h
- Cà phê, trà đặc, nước tăng lực
- Caffeine có thời gian bán hủy 5–6 giờ

### 5. Tránh rượu bia
- Rượu giúp buồn ngủ NHƯNG phá giấc ngủ sâu
- Gây thức giấc giữa đêm

### 6. Vận động đều đặn nhưng không sát giờ ngủ
- Tập buổi sáng hoặc chiều tối (trước 19h)

### 7. Thư giãn trước khi ngủ 1 giờ
- Đọc sách nhẹ
- Nghe nhạc êm, thiền, yoga
- Tránh màn hình sáng (TV, điện thoại)

## Khi nào cần dùng thuốc

- Sau 3 tháng thay đổi lối sống mà không cải thiện
- Có dấu hiệu ngưng thở khi ngủ (ngáy to, buồn ngủ ban ngày)
- Mất ngủ kéo dài > 3 tháng ảnh hưởng chất lượng cuộc sống

Các thuốc phổ biến (cần kê đơn):
- **Melatonin** (3–5 mg trước ngủ 30 phút) — dùng ngắn hạn
- **Benzodiazepine** (Diazepam, Alprazolam) — nhiều tác dụng phụ
- **Z-drugs** (Zolpidem) — dễ phụ thuộc
- **Thuốc chống trầm cảm** (Trazodone, Mirtazapine) — nếu có trầm cảm kèm theo`,
    author: 'BS. Đặng Thị Hương',
    authorTitle: 'Bác sĩ Tâm thần, BV Bạch Mai',
    publishedAt: day(75),
    readingMinutes: 9,
    tags: ['giấc ngủ', 'mất ngủ', 'lối sống'],
    relatedArticleSlugs: ['tang-huyet-ap-song-lau-nhu-the-nao'],
  },
];

export const ARTICLE_CATEGORIES: { id: ArticleCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'sức khỏe tổng quát', label: 'Sức khỏe tổng quát' },
  { id: 'dinh dưỡng', label: 'Dinh dưỡng' },
  { id: 'thai kỳ & trẻ em', label: 'Thai kỳ & Trẻ em' },
  { id: 'bệnh mạn tính', label: 'Bệnh mạn tính' },
  { id: 'phòng bệnh', label: 'Phòng bệnh' },
  { id: 'mẹo vặt', label: 'Mẹo vặt' },
];

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getArticlesByCategory(category: ArticleCategory | 'all'): Article[] {
  if (category === 'all') return ARTICLES;
  return ARTICLES.filter((a) => a.category === category);
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return ARTICLES;
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
