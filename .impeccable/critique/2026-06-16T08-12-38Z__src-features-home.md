---
target: src/features/home
total_score: 20
p0_count: 2
p1_count: 2
timestamp: 2026-06-16T08-12-38Z
slug: src-features-home
---
# Critique: PCMS Home Dashboard

**Target:** `src/features/home/components/HomeView.tsx` (route `/home`)
**Slug:** `src-features-home`
**Date:** 2026-06-16

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Loading spinner thay vì skeleton; lỗi fetch chỉ `console.error` — user không biết data load thất bại. |
| 2 | Match Between System and Real World | 3 | Tiếng Việt, thuật ngữ dược (Lô, SKU, đơn thuốc) đúng; nhưng "Tổng đơn" trùng với "Đơn hàng hôm nay" phá vỡ mental model. |
| 3 | User Control and Freedom | 2 | Không có undo/cancel, không có refresh-data CTA khi lỗi, không có cách nào dismiss banner trống. |
| 4 | Consistency and Standards | 3 | Card/StatCard/Button được dùng nhất quán; quick-action tiles lại tự phát minh style khác (4 màu nền khác nhau). |
| 5 | Error Prevention | 2 | Không có guardrail: nếu backend down, dashboard trống mà không có thông báo; không có empty-state guidance. |
| 6 | Recognition Rather than Recall | 3 | Quick actions visible; menu sidebar; nhưng không có recent items, không có lịch sử thao tác. |
| 7 | Flexibility and Efficiency of Use | 1 | Không có keyboard shortcut. Không bulk action. Một spinner chặn cả page — không thể làm việc song song khi data load chậm. |
| 8 | Aesthetic and Minimalist Design | 2 | 8 StatCard = "hero-metric template" anti-pattern. 4 quick-action tiles dùng 4 màu pastel khác nhau tranh chú ý. Nghi vấn thiếu tính cách rõ ràng. |
| 9 | Error Recovery | 1 | `try/catch` chỉ `console.error`. User hoàn toàn không biết data load thất bại — không có retry, không có thông báo, không có fallback. |
| 10 | Help and Documentation | 1 | Không có help text, tooltip, hay FAQ. Stat cards không có giải thích "Cảnh báo tồn kho" nghĩa là gì (so với gì?). |
| **Total** | | **20/40** | **Acceptable — cần cải thiện đáng kể trước khi dược sĩ dùng hằng ngày.** |

## Anti-Patterns Verdict

**Verdict:** Dashboard mang cảm giác SaaS generic hơn là "bàn làm việc dược sĩ". Một số dấu hiệu AI-slop có mặt; tổng thể chưa đạt bản sắc đã chốt trong PRODUCT.md ("Hiện đại, nhanh, gọn") và DESIGN.md ("Full palette, navy/indigo + teal, sans + mono").

**LLM assessment:**
- **"Xin chào, {tên} 👋"** — wave emoji + first-name-only là generic AI greeting reflex. Dược sĩ đang bận, không cần vỗ vai.
- **4 quick-action tiles với 4 background màu khác nhau** (`bg-medical-50`, `bg-blue-50`, `bg-primary-50`, `bg-yellow-50`) — đây là "each card gets its own color" reflex. DESIGN.md đã cấm: status semantics phải gắn với vai (success/warning/danger/info), không dùng pastel làm decoration. Hiện tại 4 tile này trộn cả 3 vai (medical=success, blue=info, primary=brand, yellow=warning) mà không có nghĩa — tạo visual noise.
- **8 StatCard trong 4-col grid** — đây là "hero-metric template" anti-pattern (per parent SKILL.md: "Big number, small label, supporting stats, gradient accent. SaaS cliché"). 8 metric cùng lúc vi phạm working memory rule (≤4 items). Dược sĩ trong ca chỉ cần 3–4 metric quan trọng; phần còn lại làm loãng.
- **Card "Tổng đơn" trùng "Đơn hàng hôm nay"** — cùng giá trị `stats.todayOrders`. Đây là copy/paste bug, không phải design choice, nhưng tạo ấn tượng dashboard chưa được review.
- **Sidebar uppercase tracking-wider** trên mỗi group label — chỉ một nơi dùng nên *hiện tại* chưa phải anti-pattern, nhưng DESIGN.md cảnh báo "AI-slop grammar khi lặp lại". Pattern này đã xuất hiện 2 nơi (Sidebar + Table header) — đang ở ngưỡng.

**Deterministic scan** (CLI detector có import lỗi — fallback sang grep thủ công):
- `border + shadow` đồng thời (ghost-card anti-pattern): **5 instances** ở `Card.tsx:18`, `Feedback.tsx:66`, `Table.tsx:33, 42, 49`. DESIGN.md cấm: border HOẶC shadow, không cả hai.
- `uppercase tracking-wider` (eyebrow risk): **2 instances** ở `Sidebar.tsx:36` (group label), `Table.tsx:59` (column header).
- Gradient text (`bg-clip-text`): **0** ✓
- Glassmorphism (`backdrop-blur`): **0** ✓
- `prefers-reduced-motion` handling: **0** ✗
- `aria-label` attributes: chỉ 1 instance (Modal close button).
- `aria-live` regions cho dynamic data: **0** ✗
- `font-mono` cho data (SKU/ID/code): **5 instances** ở medicines, customers, users, branches, customer history ✓ (đúng hướng DESIGN.md).
- Border radius trên card: `rounded-lg` (8px) ✓ (trong ngưỡng ≤16px).

**Visual overlays:** Không có browser automation trong harness này, không start dev server được. **Fallback signal:** source-only review.

## Overall Impression

Dashboard truyền tải đúng "chức năng quản trị" nhưng thiếu bản sắc "Pharmacist's Workbench" đã chốt trong PRODUCT.md. Đây là một admin dashboard generic, không phải công cụ dược sĩ. 8 stat cards cạnh tranh chú ý ngang nhau; quick actions pha 4 màu pastel tạo cảm giác "decorative" thay vì "operational"; lỗi fetch hoàn toàn im lặng — dược sĩ không biết phải làm gì khi backend down. Điểm sáng: tiếng Việt chuẩn, dùng `font-mono` cho dữ liệu đúng hướng, semantic color cho status (medical/warning) đã có mầm.

**Cơ hội lớn nhất:** Cắt 8 stat cards xuống còn 3–4 metric *quan trọng với dược sĩ trong ca* (doanh thu hôm nay, tồn kho thấp, đơn hàng chờ, có thể doanh thu so với hôm qua). Phần còn lại chuyển vào `/reports`. Đồng thời biến quick actions thành monoline (border + label) thay vì 4 màu pastel — khớp "flat-by-default" rule.

## What's Working

1. **Tiếng Việt chuẩn + thuật ngữ dược** ("Lô", "SKU", "đơn thuốc", "tồn kho", "hạn") — không phải dịch máy. Dược sĩ sẽ hiểu ngay lần đầu nhìn.
2. **Mono font cho dữ liệu dạng mã** đã xuất hiện ở medicines, customers, users, branches, customer history — đúng với "Sans UI + mono cho dữ liệu" trong DESIGN.md.
3. **Semantic color cho status** (medical-50 cho "đang chạy tốt", yellow-700 cho "cảnh báo tồn kho", medical-700 cho "doanh thu") — có chủ đích, không trang trí. Đây là hạt giống tốt cho Full-palette strategy.
4. **Quick action grid 4-col responsive** (`grid-cols-2 sm:grid-cols-4`) — pattern quen thuộc, scale tốt trên mobile.

## Priority Issues

### [P0] 8 StatCard cùng lúc = hero-metric template + working memory overflow
- **Why it matters:** Vi phạm working memory rule (≤4 items). Dược sĩ trong ca không cần "Tổng chi nhánh" hay "Tổng người dùng" — những metric này dành cho CEO. 8 card ngang hàng tạo visual noise kéo attention khỏi 2 metric thật sự quan trọng với dược sĩ: "Doanh thu hôm nay" và "Cảnh báo tồn kho".
- **Fix:** Giữ tối đa 4 metric theo role. Với dược sĩ: Doanh thu hôm nay · Cảnh báo tồn kho · Đơn hàng chờ thanh toán · Thuốc sắp hết hạn. Các metric khác chuyển sang `/reports` hoặc ẩn sau "Xem thêm".
- **Suggested command:** `$impeccable layout` (sửa cấu trúc dashboard) hoặc `$impeccable polish` (refine nhanh).

### [P0] Lỗi fetch im lặng — `try/catch` chỉ `console.error`
- **Why it matters:** Dược sĩ nhìn dashboard lúc 9h sáng mở ca, backend down, data trống, không có thông báo. Họ nghĩ app hỏng. Không có retry CTA, không có "Hệ thống đang bận, thử lại", không có fallback cached data. P0 vì ảnh hưởng trực tiếp đến việc mở ca.
- **Fix:** Thêm error state với Alert component (đã có sẵn trong `Card.tsx`): "Không tải được dữ liệu dashboard" + nút "Thử lại". Giữ `console.error` cho dev. Thêm aria-live="polite" để screen reader thông báo.
- **Suggested command:** `$impeccable harden` (production-grade error states).

### [P1] 4 quick-action tiles với 4 màu nền pastel khác nhau = visual noise
- **Why it matters:** Tile "Tạo đơn hàng" dùng `bg-medical-50`, "Nhập kho" dùng `bg-blue-50`, "Thêm thuốc" dùng `bg-primary-50`, "Thêm KH" dùng `bg-yellow-50`. Bốn màu cùng lúc cạnh tranh attention; dược sĩ mất 0.5s phân tâm để quyết định cái nào quan trọng. Yellow nền đặc biệt dễ bị đọc thành "cảnh báo" theo status semantic — nhưng đây là action thường.
- **Fix:** Flat-by-default: tất cả tile cùng `bg-white border border-gray-200`. Phân biệt action quan trọng (primary: "Tạo đơn hàng") bằng filled solid background primary + white text; các tile còn lại outline. Đúng "flat-by-default rule" trong DESIGN.md.
- **Suggested command:** `$impeccable layout` hoặc `$impeccable polish`.

### [P1] Ghost-card pattern ở 5 components
- **Why it matters:** `Card.tsx:18`, `Feedback.tsx:66` (StatCard), `Table.tsx:33, 42, 49` đều dùng `rounded-lg shadow border border-gray-200` cùng lúc. DESIGN.md absolute ban: "border HOẶC shadow, không cả hai". 5 instances tạo cảm giác "tất cả card trông giống nhau" — giảm hierarchy.
- **Fix:** Card bình thường = border only, không shadow. StatCard = border only. EmptyState/Loading = border only. Modal = shadow only (đã đúng ở Modal.tsx). Drop `shadow` class khỏi 5 chỗ kia.
- **Suggested command:** `$impeccable audit` (technical review các component), hoặc `$impeccable polish` cho nhanh.

### [P2] StatCard "Tổng đơn" trùng giá trị với "Đơn hàng hôm nay"
- **Why it matters:** Cả hai hiển thị `stats.todayOrders`. Đây là copy/paste bug — bị user nhìn ra ngay và mất trust ("dashboard này cẩu thả").
- **Fix:** Đổi "Tổng đơn" thành "Đơn tháng này" với `stats.monthOrders` (cần thêm field ở backend), hoặc đơn giản xóa "Tổng đơn" nếu không có metric phù hợp.
- **Suggested command:** `$impeccable clarify` (label/copy review).

### [P2] Wave emoji 👋 + first-name greeting là generic AI touch
- **Why it matters:** "Xin chào, Tuấn 👋" là greeting pattern quen thuộc của AI assistant. Dược sĩ đang bận, không cần vỗ vai; họ cần "Tồn kho thấp: 3 lô" hoặc "Có 2 đơn chờ thanh toán" — actionable insight.
- **Fix:** Bỏ emoji. Đổi h1 thành context-aware: "Ca sáng hôm nay — 3 đơn chờ, tồn kho thấp 2 lô". Hoặc giữ "Xin chào, {họ tên}" nhưng bỏ emoji, và chuyển insight lên heading phụ.
- **Suggested command:** `$impeccable clarify` (copy review).

### [P2] Loading = full LoadingSpinner, không skeleton
- **Why it matters:** Khi backend chậm 1–2s, dashboard hiện spinner to ở giữa — cảm giác chờ đợi thay vì progressive reveal. Dược sĩ nhìn thấy "đang tải" nhưng không biết phần nào đã có.
- **Fix:** Skeleton state: hiển thị 4 StatCard skeleton (gray pulse rectangle) + 2 Card skeleton ngay từ đầu, thay thế bằng data thật khi fetch xong. Per product.md register, skeleton cảm giác "nhanh hơn" spinner.
- **Suggested command:** `$impeccable animate` (motion + skeleton patterns).

## Persona Red Flags

### Alex (Power User) — Dược sĩ thành thạo
- **Không có keyboard shortcut** để mở "Tạo đơn hàng" (Cmd+K? Ctrl+N?).
- **Loading toàn page** với 1 spinner — không thể click quick actions trong khi data chưa về.
- **Không có bulk action**: ví dụ "đánh dấu đã đọc" cho low-stock items.
- **Không có "recent orders" jump-back**: xem chi tiết 1 đơn trong Recent Orders, back phải nhớ URL hoặc click lại menu.

### Sam (Accessibility-Dependent User) — Dược sĩ dùng screen reader / low vision
- **No aria-live** cho dynamic data — khi data load xong, screen reader không thông báo.
- **Status chỉ dùng màu** — `text-yellow-700` cho lowStock, `text-medical-700` cho revenue. Low-vision user không phân biệt được.
- **No `prefers-reduced-motion`** — spinner `animate-spin` chạy vô tận, không tôn trọng user setting.
- **Focus ring mặc định Tailwind** (focus:ring-primary-500) — OK nhưng chưa customize, contrast với navy/indigo mới có thể yếu.

### Dược sĩ Tuấn (project-specific) — đang mở ca sáng
- 8 stat cards khiến Tuấn quét mất 3s để tìm "đơn hôm nay" — ca sáng có thể đã có 5–10 khách chờ.
- Quick action "Tạo đơn hàng" đặt ngang hàng với "Thêm KH" — nhưng "Tạo đơn hàng" là action 80% ca, cần visual weight gấp 3 lần các tile kia.
- Greeting "Xin chào, Tuấn 👋" chiếm h1 — Tuấn cần biết "Tồn kho thấp: 2 lô cần nhập" hoặc "Đơn chờ: 3". Greeting dời xuống subtitle.
- Loading chờ → Tuấn mở app, thấy spinner to, nghĩ app hỏng, refresh → lại spinner. Vòng lặp mất 30s — trong khi ca sáng đang kẹt.

## Minor Observations

- **Date locale** "vi-VN" + weekday/day/month/year — đúng chuẩn VN nhưng dài (e.g. "thứ Hai, 16 tháng 6 năm 2026"). Có thể rút gọn thành "Thứ 2, 16/06" cho gọn.
- **Tên card "Đơn hàng gần đây"** hiển thị `subtitle="5 đơn hàng mới nhất đã thanh toán"` — hard-code "5" trong subtitle nhưng code `recentOrders.slice(0, 5)` cũng hard-code 5. Nếu backend trả 0, hiển thị "5 đơn hàng mới nhất" là sai. Nên dynamic: "X đơn hàng mới nhất" hoặc chỉ "Đơn hàng mới nhất".
- **Quick action href `/orders/new`** — đây là internal route Next.js, dùng `<a href>` thay vì `next/link` sẽ full-page reload. Performance + UX hit.
- **Empty state** "Chưa có đơn hàng nào" chỉ là text. Dược sĩ mới mở ca nhìn vào không biết phải làm gì — nên có CTA "Tạo đơn đầu tiên" hoặc illustration guidance.
- **Alert "Tất cả sản phẩm đều đủ hàng ✅"** dùng emoji ✅ — chung tone với 👋. Nên dùng icon Lucide (CheckCircle2) nhất quán với phần còn lại.

## Questions to Consider

- Dược sĩ dùng dashboard *đầu ca* (3s) hay *cuối ca* (10 phút tổng kết)? Quyết định có nên làm dashboard khác nhau theo time-of-day không.
- Nếu giữ 4 stat cards, metric nào *thật sự* quyết định dược sĩ bắt đầu ca? "Doanh thu hôm nay" hay "Tồn kho thấp"?
- Quick action "Tạo đơn hàng" — có nên đưa thành primary CTA fixed ở góc (Cmd+K command palette) thay vì 1 trong 4 tile?
- "Cảnh báo tồn kho" — bao nhiêu lô thì cảnh báo, bao nhiêu lô thì critical? Có cần visual differentiation (yellow = warning, red = critical) thay vì một màu warning duy nhất?

## Snapshot

Wrote `.impeccable/critique/src-features-home-<timestamp>.md`.
First run for this target, no trend yet.
