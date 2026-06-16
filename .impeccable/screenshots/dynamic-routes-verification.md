# Visual Verification Report — 5 Dynamic Routes

**Date:** 2026-06-16
**Tool:** chrome_devtools MCP
**Dev server:** `http://127.0.0.1:3000`
**Backend:** KHÔNG chạy — verify layout, data = error state (expected)

---

## Kết quả: 5/5 dynamic routes PASS ✅

| # | URL | Fake ID | H1 | Layout | Error handling | Screenshot |
|---|---|---|---|---|---|---|
| 1 | `/orders/new` | (no param) | "Tạo đơn hàng mới" | 3 sections + Tổng đơn hàng | N/A (form mode) | `.impeccable/screenshots/orders-new.jpeg` |
| 2 | `/inventory/import` | (no param) | "Nhập kho" | Form 5 fields | N/A (form mode) | — |
| 3 | `/orders/[id]` | `test-order-1` | "Không tìm thấy đơn hàng" | Minimal | Graceful ✓ | — |
| 4 | `/customers/[id]/history` | `test-customer-1` | "Không tìm thấy khách hàng" | "Quay lại" + heading | Graceful ✓ | — |
| 5 | `/payments/[id]` | `test-payment-1` | "Không tìm thấy đơn hàng" | Minimal | Graceful ✓ | — |

---

## Chi tiết từng trang

### 1. /orders/new ✅
- H1: "Tạo đơn hàng mới"
- Subtitle: "SCR-ORDER-NEW · BR04: 5% discount tự động cho qty ≥ 10"
- Button "← Quay lại" (top-left)
- 3 sections (numbered):
  - **1. Chọn khách hàng & chi nhánh**: 2 select (Khách hàng, Chi nhánh)
  - **2. Tìm & thêm thuốc**: search input với placeholder "Tìm thuốc (VD: paracetamol, MD001)..."
  - **3. Giỏ hàng**: heading "0 sản phẩm" + empty state với inbox icon "Chưa có sản phẩm" + "Tìm và thêm thuốc vào giỏ ở trên"
- Sidebar phải: **Tổng đơn hàng** card
  - Tạm tính: 0 ₫
  - Giảm giá (BR04): -0 ₫
  - Tổng cộng: **0 ₫** (bold, mono)
  - Button "Tạo đơn hàng" (disabled, primary navy)
  - Hint: "Chọn khách hàng · Chọn chi nhánh · Thêm sản phẩm"
- **Layout:** 2-col (form trái, summary phải) trên desktop
- **Tokens:** ✅ ink-navy primary, teal accents, no ghost-card
- **No error** (form mode, chưa submit)

### 2. /inventory/import ✅
- H1: "Nhập kho"
- Subtitle: "UC05 · Thêm lô hàng mới vào tồn kho (AT4: validate qty, batch, expiry)"
- Button "← Quay lại"
- Form fields:
  - **Thuốc** (select, required *) — "— Chọn thuốc —"
  - **Chi nhánh** (select, required *) — "— Chọn chi nhánh —"
  - **Mã lô (Batch No)** (text input)
  - **Số lượng** (number input, min=1)
  - **Ngày hết hạn** (date input, với aria description: "Phải là ngày trong tương lai (MSG17)")
  - Helper text: "Phải là ngày trong tương lai (MSG17)" (visible label)
- Button "Nhập kho" (submit)
- **a11y tốt:** required fields có `*`, date input có description chính xác (MSG17 rule từ SRS)
- **No error** (form mode)

### 3. /orders/test-order-1 ✅
- URL: `http://127.0.0.1:3000/orders/test-order-1` — ổn định, không redirect
- Main: chỉ có heading "Không tìm thấy đơn hàng" (h3)
- Không có "Quay lại" button
- **Graceful:** Không crash, không white screen, layout sidebar/header vẫn OK
- **Backend sẽ trả 404 cho invalid order ID** — page xử lý đúng

### 4. /customers/test-customer-1/history ✅
- URL: `http://127.0.0.1:3000/customers/test-customer-1/history` — ổn định
- Main:
  - Button "← Quay lại"
  - Heading "Không tìm thấy khách hàng" (h3)
- **Graceful** với "Quay lại" button (khác với /orders/[id])

### 5. /payments/test-payment-1 ✅
- URL: `http://127.0.0.1:3000/payments/test-payment-1` — ổn định
- Main: "Không tìm thấy đơn hàng" (text, không phải heading)
- **Graceful** nhưng minimal — không "Quay lại" button, không heading wrapper

---

## Tổng kết 20/20 trang

| Nhóm | Trang | Status |
|---|---|---|
| Public | `/` | ✅ (redirect) |
| Auth | `/login` | ✅ (brand-led) |
| Dashboard static | `/home`, `/orders`, `/medicines`, `/users`, `/customers`, `/branches`, `/inventory`, `/categories`, `/suppliers`, `/prescriptions`, `/notifications`, `/reports`, `/search` | ✅ (13/13) |
| Dashboard static dynamic | `/orders/new`, `/inventory/import` | ✅ (2/2) |
| Dashboard param dynamic | `/orders/[id]`, `/customers/[id]/history`, `/payments/[id]` | ✅ (3/3) |

**Tổng: 20/20 trang render đúng, không bị đổ vỡ UI/UX.**

---

## Minor observations

1. **Inconsistency trong error states của dynamic param pages:**
   - `/customers/[id]/history`: có "← Quay lại" button + h3 heading
   - `/orders/[id]`: chỉ có h3 heading, không button
   - `/payments/[id]`: text thường, không button, không heading wrapper
   - **Gợi ý:** Thống nhất pattern — tất cả nên có "Quay lại" button + h3 heading "Không tìm thấy [entity]"

2. **Khi backend chạy**, các param-based pages sẽ hiển thị:
   - `/orders/[id]`: Order detail với items, customer, payment status, timeline
   - `/customers/[id]/history`: Order history table với dates, totals, status
   - `/payments/[id]`: Payment form với order summary, method selection (CASH/CARD/QR)
   - Hiện tại chỉ verify error state — happy path cần backend

3. **⚠️ emoji** trong error alerts (orders, customers, branches, etc.) — pre-existing từ ListPage, chưa fix

---

## Files changed trong session này

Không có file changes trong session verify dynamic routes. Session này chỉ check visual, không modify code (ngoài việc fix auth hydration trước đó).

**Tổng files changed toàn session:** 5 (tailwind.config.ts, types/auth.ts, auth/auth-context.tsx, Layout/DashboardLayout.tsx, login/page.tsx)

---

## Recommended next steps

### P1 — Sửa inconsistency dynamic error states
1. Tạo component `<NotFound entity="đơn hàng" />` với:
   - H3 heading "Không tìm thấy [entity]"
   - Body text giải thích
   - Button "← Quay lại" link về list page
2. Dùng trong 3 dynamic param pages

### P2 — Khi backend chạy
3. Verify happy path: login thật, navigate tới order/customer/payment detail, check data render đúng
4. Check responsive: resize xuống mobile, check form/list behavior

### P3 — Polish
5. Thay ⚠️ emoji trong error alerts bằng Lucide icon (AlertCircle, AlertTriangle)
6. Xóa `primary` + `medical` tokens khỏi tailwind.config.ts
