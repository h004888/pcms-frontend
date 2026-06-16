# Craft: /home dashboard — Pharmacist's Workbench

**Target:** `src/features/home/components/HomeView.tsx`
**Date:** 2026-06-16
**Brief:** Áp dụng 4 fix ưu tiên từ critique /home (2026-06-16): cắt stat cards, error state, flat quick actions, context-aware greeting. Áp tokens mới từ polish.

## Vấn đề đã giải quyết (theo thứ tự ưu tiên)

### ✅ P0: 8 StatCard → 4 cho pharmacist
- Bỏ: Người dùng, Chi nhánh, Thuốc trong kho, Khách hàng, Tổng đơn (trùng với Đơn hôm nay)
- Giữ 4 metric *quan trọng với dược sĩ trong ca*:
  1. **Doanh thu hôm nay** (accent/teal — "đang chạy tốt")
  2. **Tồn kho thấp** (warning — hành động cần làm)
  3. **Đơn chờ thanh toán** (primary/navy — trọng tâm POS)
  4. **Lô sắp hết hạn** (danger — cảnh báo y tế nghiêm trọng)
- Mỗi metric có icon + màu semantic theo Full-palette strategy

### ✅ P0: Lỗi fetch im lặng → Alert + retry CTA
- Khi fetch fail, hiện `Alert variant="danger"` với message + button "Thử lại"
- Hàm `load()` tách riêng để retry gọi lại
- A11y: `role="alert"` đã có sẵn trong Alert component

### ✅ P1: 4 quick-action tiles với 4 màu pastel → flat-by-default
- 1 primary (filled, navy/ink-900) + 3 outline (border ink-200)
- "Tạo đơn hàng" là primary — 80% ca, đúng tầm quan trọng
- 3 tile còn lại cùng weight, không cạnh tranh attention
- Đúng "flat-by-default rule" trong DESIGN.md

### ✅ P1: Ghost-card pattern → 0 instances
- StatCard, Card, list items đều dùng border only (đã fix ở polish)
- HomeView.tsx không dùng `shadow + border` combo

### ✅ P2: Greeting "Xin chào, {tên} 👋" → context-aware
- Bỏ emoji 👋
- Eyebrow: "Ca sáng · Thứ Hai, 16 tháng 6" (time-of-day + date)
- H1: "{lastName}, sẵn sàng cho ca làm việc." (actionable, không vỗ vai)
- Subtitle: role label
- Ca dựa theo giờ hệ thống: sáng (<11h) / chiều (<17h) / tối

### ✅ P2: Loading = full spinner → skeleton từng phần
- 4 StatCardSkeleton trong grid khi loading
- ListSkeleton trong 2 Card panels
- A11y: `aria-live="polite"` trên section metrics, `role="status"` trên StatCardSkeleton
- Per product.md register: skeleton cảm giác "nhanh hơn" spinner

## Files changed

| File | Change |
|------|--------|
| `src/features/home/components/HomeView.tsx` | Rewrite hoàn toàn — 4 metric, error state, skeleton, flat quick actions, time-aware greeting, a11y |
| `src/features/home/types.ts` | Thêm optional fields: `pendingOrders`, `expiringBatches` cho backend mở rộng sau |

## Self-review

| Rule | Status |
|------|--------|
| No ghost-card | ✓ verified |
| No gradient | ✓ |
| No AI-slop template (4-card lặp lại) | ✓ 1 primary + 3 outline quick actions |
| No emoji decoration | ✓ bỏ 👋 và ✅ cũ |
| No uppercase tracked eyebrow lặp lại | ✓ chỉ eyebrow cho time/date |
| Sans UI + mono cho dữ liệu | ✓ StatCard value, order number, batch number, số lượng đều mono + tabular-nums |
| Bản sắc y tế | ✓ metric "Lô sắp hết hạn" với status danger là pharmacy-specific |
| A11y: aria-live, role, focus | ✓ section có `aria-live="polite"`, links có focus-visible, retry button có focus ring |
| A11y: error recovery | ✓ retry CTA ngay trong error banner |
| A11y: empty state guidance | ✓ "Tạo đơn đầu tiên" CTA khi chưa có đơn |
| Skeleton thay spinner | ✓ 4 StatCardSkeleton + 2 ListSkeleton |
| Mật độ cao có hệ thức | ✓ 4 metrics + 2 panels + 4 quick actions, có nhịp rõ |
| `prefers-reduced-motion` | ✓ global rule trong globals.css, `animate-pulse` sẽ tự giảm |

## Persona re-check

### Dược sĩ Tuấn (project-specific)
- Mở app lúc 7h sáng: thấy "Ca sáng · Thứ Hai, 16 tháng 6" → biết ngay trong ca nào
- H1: "Tuấn, sẵn sàng cho ca làm việc." → actionable, không sến
- 4 metrics trên cùng: "Tồn kho thấp: 3" + "Lô sắp hết hạn: 1" → biết ngay phải xử lý gì
- Quick action "Tạo đơn hàng" dominant (filled navy) → click ngay khi có khách
- Recent orders có thể click vào chi tiết
- Không phải scan 8 metric tìm thông tin → giảm 3s/ca

### Alex (Power User)
- 4 metrics, không spinner chặn cả page → có thể click quick action trong khi load
- aria-live cho metrics → screen reader thông báo khi data về
- Retry CTA khi lỗi → không cần refresh browser

### Sam (Accessibility)
- Empty state có icon + text + CTA → không phải đoán
- Aria-live polite → screen reader thông báo data updates
- Focus-visible rõ trên mọi link/button
- `aria-current="page"` cho sidebar (từ polish)
- Color không phải cách duy nhất truyền status (icon + text + color)

## Build verify

- `npx tsc --noEmit` — exit 0
- `npx next lint` — không warning mới
- `grep "shadow border\|border.*shadow\|gray-..."` — không còn trong HomeView.tsx

## Limitations (không giấu)

1. **`pendingOrders` và `expiringBatches` chưa có backend** — type khai báo optional, UI hiển thị 0. Cần backend thêm 2 endpoint:
   - `GET /api/v1/orders?status=PENDING` → count
   - `GET /api/v1/inventory/expiring?days=30` → count
2. **Time-of-day greeting dùng `new Date().getHours()`** — local time, không theo server. Nếu user ở múi giờ khác có thể lệch. Acceptable cho v1.
3. **Skeleton dùng `animate-pulse`** — tôn trọng `prefers-reduced-motion` qua global rule.
4. **Empty state icon là `ClipboardList`** — Lucide. Nếu user muốn custom icon có thể đổi sau.
5. **Mobile bottom action "Tạo đơn hàng" fixed CTA** — chưa có. Có thể thêm cho dược sĩ dùng mobile. Not in scope.

## Follow-ups

1. `$impeccable document` scan-mode → resolve DESIGN.md hex cụ thể với tokens mới
2. `$impeccable audit` re-score HomeView sau craft
3. Backend: thêm 2 endpoint cho `pendingOrders` + `expiringBatches`
4. Visual verify: `npm run dev` → mở `/home`
