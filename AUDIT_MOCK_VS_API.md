# AUDIT: Màn hình & nguồn dữ liệu — pcms-frontend

**Đường dẫn:** `C:\Users\ADMIN\Downloads\temp_v12\pcms-frontend`
**Stack:** Next.js 14 App Router + Tailwind + TypeScript
**Backend API base:** `process.env.NEXT_PUBLIC_API_URL || http://localhost:8080/api/v1` (axios client tại `src/lib/api/client.ts`)
**Ngày kiểm:** 2026-06-22

---

## Tổng quan

- **Tổng số page (file `page.tsx`) trong `src/app/`:** 84
- **Trang ĐANG dùng API backend thật (`apiClient` qua `features/*/services/*`):** 26
- **Trang ĐANG dùng MOCK DATA từ `src/data/shop/*` / `src/data/ai-responses`:** 24
- **Trang UI-only / placeholder (chưa có data layer):** 34

Toàn bộ service layer trong `src/features/*/services/*` (14 file) đều gọi `apiClient.get/post/put/delete` thật, không có fake. Phần mock chỉ tập trung ở **phần shop (B2C)** qua `src/data/shop/`.

---

## Phần 1: 12 file MOCK DATA nguồn (src/data/*)

| File | Loại | Đường dẫn | Ghi chú |
|---|---|---|---|
| `catalog.ts` | Mock catalog | `src/data/shop/catalog.ts` | 30 sản phẩm + categories — "Mock catalog data for Phase 2 development" |
| `articles.ts` | Mock bài viết | `src/data/shop/articles.ts` | "Mock data: Bài viết sức khỏe" |
| `diseases.ts` | Mock bệnh | `src/data/shop/diseases.ts` | "Mock data: Bệnh thường gặp" |
| `herbs.ts` | Mock dược liệu | `src/data/shop/herbs.ts` | "Mock data: Dược liệu" |
| `ingredients.ts` | Mock hoạt chất | `src/data/shop/ingredients.ts` | "Mock data: Hoạt chất / Dược chất" |
| `orders.ts` | Mock đơn hàng B2C | `src/data/shop/orders.ts` | "Mock orders data for Phase 2 B2C" |
| `stores.ts` | Mock cửa hàng | `src/data/shop/stores.ts` | "Mock data: Stores / Branches" |
| `vaccines.ts` | Mock vắc xin | `src/data/shop/vaccines.ts` | "Mock data: Vaccines" |
| `videos.ts` | Mock video y khoa | `src/data/shop/videos.ts` | "Mock data: Video y khoa" |
| `cancer.ts` | Mock bài ung thư | `src/data/shop/cancer.ts` | "Mock data: Bệnh ung thư" |
| `health-quizzes.ts` | Mock bài test SK | `src/data/shop/health-quizzes.ts` | "Mock data: Bài kiểm tra sức khỏe" |
| `quiz-questions.ts` | Mock câu hỏi quiz | `src/data/shop/quiz-questions.ts` | "Health quiz questions database" |
| `ai-responses.ts` | Mock AI chat | `src/data/ai-responses.ts` | "smart mock cho /ai/chat" |
| `policies.tsx` | Mock chính sách | `src/data/policies.tsx` | (chính sách shop tĩnh) |

---

## Phần 2: Trang DÙNG API THẬT (26 trang)

### 2.1 Dashboard / Admin (authenticated) — toàn bộ qua `src/features/*/services/*`

| # | Route | Page | Service layer |
|---|---|---|---|
| 1 | `/home` | `src/app/(dashboard)/home/page.tsx` | `homeService.dashboardService.fetchDashboardSummary` |
| 2 | `/branches` | `src/app/(dashboard)/branches/page.tsx` | `branches/services/branchService.ts` |
| 3 | `/categories` | `src/app/(dashboard)/categories/page.tsx` | `categories/services/categoryService.ts` |
| 4 | `/customers` | `src/app/(dashboard)/customers/page.tsx` | `customers/services/customerService.ts` |
| 5 | `/customers/[id]` | `src/app/(dashboard)/customers/[id]/page.tsx` | `customers/services/customerService.ts` |
| 6 | `/customers/[id]/history` | `src/app/(dashboard)/customers/[id]/history/page.tsx` | `customers/services/customerService.ts` |
| 7 | `/inventory` | `src/app/(dashboard)/inventory/page.tsx` | `inventory/services/inventoryService.ts` |
| 8 | `/inventory/import` | `src/app/(dashboard)/inventory/import/page.tsx` | `inventory/services/inventoryService.ts` |
| 9 | `/inventory/export` | `src/app/(dashboard)/inventory/export/page.tsx` | `inventory/services/inventoryService.ts` |
| 10 | `/inventory/transfer` | `src/app/(dashboard)/inventory/transfer/page.tsx` | `inventory/services/inventoryService.ts` |
| 11 | `/medicines` | `src/app/(dashboard)/medicines/page.tsx` | `medicines/services/medicineService.ts` |
| 12 | `/orders` | `src/app/(dashboard)/orders/page.tsx` | `orders/services/orderService.ts` |
| 13 | `/orders/new` | `src/app/(dashboard)/orders/new/page.tsx` | `orders/services/orderService.ts` |
| 14 | `/orders/[id]` | `src/app/(dashboard)/orders/[id]/page.tsx` | `orders/services/orderService.ts` |
| 15 | `/invoices/[id]` | `src/app/(dashboard)/invoices/[id]/page.tsx` | `orders/services/orderService.ts` |
| 16 | `/prescriptions` | `src/app/(dashboard)/prescriptions/page.tsx` | `prescriptions/services/prescriptionService.ts` |
| 17 | `/notifications` | `src/app/(dashboard)/notifications/page.tsx` | `notifications/services/notificationService.ts` |
| 18 | `/notifications/compose` | `src/app/(dashboard)/notifications/compose/page.tsx` | `notifications/services/notificationService.ts` |
| 19 | `/reports` | `src/app/(dashboard)/reports/page.tsx` | `reports/services/reportService.ts` |
| 20 | `/search` | `src/app/(dashboard)/search/page.tsx` | `search/services/searchService.ts` |
| 21 | `/suppliers` | `src/app/(dashboard)/suppliers/page.tsx` | `suppliers/services/supplierService.ts` |
| 22 | `/users` | `src/app/(dashboard)/users/page.tsx` | `users/services/userService.ts` |
| 23 | `/payments/[id]` | `src/app/(dashboard)/payments/[id]/page.tsx` | `orders/services/orderService.ts` (fetchPaymentByOrderId) |

### 2.2 Customer-facing có API thật

| # | Route | Page | Note |
|---|---|---|---|
| 24 | `/he-thong-cua-hang` | `src/app/(customer)/he-thong-cua-hang/page.tsx` | Gọi trực tiếp `apiClient.get('/branches?size=100')` |

### 2.3 Auth flow

| # | Route | Page | Note |
|---|---|---|---|
| 25 | `/login` | `src/app/(auth)/login/page.tsx` | Qua `useAuth()` → `lib/auth/auth.ts` → `apiClient.post(AUTH_LOGIN)` |
| 26 | (nhiều) | auth-context | JWT token, refresh — gọi backend thật |

---

## Phần 3: Trang DÙNG MOCK DATA (24 trang) — CHƯA GẮN BACKEND

### 3.1 Phân loại theo mock file

| Mock file | Trang sử dụng | # |
|---|---|---|
| **`shop/catalog.ts`** (sản phẩm + categories) | `/[slug]` (L1), `/[slug]/[subSlug]` (L2), `/[slug]/[subSlug]/[productSlug]` (PDP), `/flash-sale/[id]`, `/tra-cuu-thuoc`, `/tra-cuu-thuoc/[slug]`, `/tra-cuu-duoc-chat`, `/tra-cuu-duoc-chat/[slug]`, `/tim-kiem`, `/reviews`, `/reviews/new/[productSlug]`, `/ai/semantic-search`, `(auth)/favorites`, `(dashboard)/rx-console/cross-sell`, components: `ShopHomeBestseller`, `ShopHomeCategories` | **16 trang + 2 components** |
| **`shop/articles.ts`** (bài viết) | `/bai-viet`, `/bai-viet/[slug]` | 2 |
| **`shop/diseases.ts`** (bệnh thường gặp) | `/benh-thuong-gap`, `/benh-thuong-gap/[slug]` | 2 |
| **`shop/herbs.ts`** (dược liệu) | `/tra-cuu-duoc-lieu`, `/tra-cuu-duoc-lieu/[slug]` | 2 |
| **`shop/ingredients.ts`** (hoạt chất) | `/tra-cuu-duoc-chat`, `/tra-cuu-duoc-chat/[slug]`, `/tra-cuu-duoc-lieu/[slug]` | 3 (chia sẻ) |
| **`shop/orders.ts`** (đơn hàng B2C) | `/don-hang`, `/don-hang/[id]`, component `OrderTimeline` | 2 + 1 |
| **`shop/stores.ts`** (cửa hàng) | `/he-thong-cua-hang/[province]`, `/he-thong-cua-hang/[province]/[id]` | 2 |
| **`shop/vaccines.ts`** (vắc xin) | `/tiem-chung` | 1 |
| **`shop/videos.ts`** (video y khoa) | `/video` | 1 |
| **`shop/cancer.ts`** (bài ung thư) | `/chuyen-trang-ung-thu` | 1 |
| **`shop/health-quizzes.ts` + `quiz-questions.ts`** | `/suc-khoe/kiem-tra`, `/suc-khoe/kiem-tra/[slug]` | 2 |
| **`ai-responses.ts`** (smart-mock AI) | `/ai/chat`, `/ai/semantic-search` | 2 |

### 3.2 Danh sách đầy đủ 24 trang + 3 components MOCK

| # | Route | File | Nguồn mock |
|---|---|---|---|
| 1 | `/` (ShopHome) | `components/shop/ShopHomeBestseller.tsx`, `ShopHomeCategories.tsx` | `shop/catalog.ts` |
| 2 | `/[slug]` (L1 category) | `src/app/(customer)/[slug]/page.tsx` | `shop/catalog.ts` |
| 3 | `/[slug]/[subSlug]` (L2 category) | `src/app/(customer)/[slug]/[subSlug]/page.tsx` | `shop/catalog.ts` |
| 4 | `/[slug]/[subSlug]/[productSlug]` (PDP) | `src/app/(customer)/[slug]/[subSlug]/[productSlug]/page.tsx` | `shop/catalog.ts` |
| 5 | `/flash-sale/[id]` | `src/app/(customer)/flash-sale/[id]/page.tsx` | `shop/catalog.ts` |
| 6 | `/tra-cuu-thuoc` | `src/app/(customer)/tra-cuu-thuoc/page.tsx` | `shop/catalog.ts` |
| 7 | `/tra-cuu-thuoc/[slug]` | `src/app/(customer)/tra-cuu-thuoc/[slug]/page.tsx` | `shop/catalog.ts` |
| 8 | `/tra-cuu-duoc-chat` | `src/app/(customer)/tra-cuu-duoc-chat/page.tsx` | `shop/ingredients.ts` |
| 9 | `/tra-cuu-duoc-chat/[slug]` | `src/app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx` | `shop/ingredients.ts` + `shop/catalog.ts` |
| 10 | `/tra-cuu-duoc-lieu` | `src/app/(customer)/tra-cuu-duoc-lieu/page.tsx` | `shop/herbs.ts` |
| 11 | `/tra-cuu-duoc-lieu/[slug]` | `src/app/(customer)/tra-cuu-duoc-lieu/[slug]/page.tsx` | `shop/herbs.ts` + `shop/ingredients.ts` |
| 12 | `/tim-kiem` | `src/app/(customer)/tim-kiem/page.tsx` | `shop/catalog.ts` |
| 13 | `/reviews` | `src/app/(customer)/reviews/page.tsx` | `shop/catalog.ts` |
| 14 | `/reviews/new/[productSlug]` | `src/app/(customer)/reviews/new/[productSlug]/page.tsx` | `shop/catalog.ts` |
| 15 | `/don-hang` | `src/app/(customer)/don-hang/page.tsx` | `shop/orders.ts` |
| 16 | `/don-hang/[id]` | `src/app/(customer)/don-hang/[id]/page.tsx` | `shop/orders.ts` (+ `OrderTimeline` component) |
| 17 | `/he-thong-cua-hang/[province]` | `src/app/(customer)/he-thong-cua-hang/[province]/page.tsx` | `shop/stores.ts` |
| 18 | `/he-thong-cua-hang/[province]/[id]` | `src/app/(customer)/he-thong-cua-hang/[province]/[id]/page.tsx` | `shop/stores.ts` |
| 19 | `/tiem-chung` | `src/app/(customer)/tiem-chung/page.tsx` | `shop/vaccines.ts` |
| 20 | `/bai-viet` | `src/app/(customer)/bai-viet/page.tsx` | `shop/articles.ts` |
| 21 | `/bai-viet/[slug]` | `src/app/(customer)/bai-viet/[slug]/page.tsx` | `shop/articles.ts` |
| 22 | `/benh-thuong-gap` | `src/app/(customer)/benh-thuong-gap/page.tsx` | `shop/diseases.ts` |
| 23 | `/benh-thuong-gap/[slug]` | `src/app/(customer)/benh-thuong-gap/[slug]/page.tsx` | `shop/diseases.ts` |
| 24 | `/chuyen-trang-ung-thu` | `src/app/(customer)/chuyen-trang-ung-thu/page.tsx` | `shop/cancer.ts` |
| 25 | `/suc-khoe/kiem-tra` | `src/app/(customer)/suc-khoe/kiem-tra/page.tsx` | `shop/health-quizzes.ts` |
| 26 | `/suc-khoe/kiem-tra/[slug]` | `src/app/(customer)/suc-khoe/kiem-tra/[slug]/page.tsx` | `shop/quiz-questions.ts` + `health-quizzes.ts` |
| 27 | `/video` | `src/app/(customer)/video/page.tsx` | `shop/videos.ts` |
| 28 | `/ai/chat` | `src/app/(customer)/ai/chat/page.tsx` | `data/ai-responses.ts` |
| 29 | `/ai/semantic-search` | `src/app/(customer)/ai/semantic-search/page.tsx` | `data/ai-responses.ts` + `shop/catalog.ts` |
| 30 | `/favorites` | `src/app/(auth)/favorites/page.tsx` | `shop/catalog.ts` |
| 31 | `/rx-console/cross-sell` | `src/app/(dashboard)/rx-console/cross-sell/page.tsx` | `shop/catalog.ts` |

> Note: trang 16 dùng `OrderTimeline` component (đếm chung 1 mock file).

---

## Phần 4: Trang UI-only / placeholder (34 trang)

Đây là các trang **KHÔNG** có API call, **KHÔNG** có mock data, chỉ là shell/UI/form tĩnh. Chia 3 nhóm:

### 4.1 Customer-facing UI-only (chưa gắn data layer)

| Route | File |
|---|---|
| `/` | `src/app/(customer)/page.tsx` (chỉ render `ShopHomeContent`) |
| `/cart` | `src/app/(customer)/cart/page.tsx` (cart context localStorage, VOUCHERS hard-code inline) |
| `/checkout` | `src/app/(customer)/checkout/page.tsx` (chưa gọi API tạo order) |
| `/flash-sale` | `src/app/(customer)/flash-sale/page.tsx` (list, chưa gắn data) |
| `/dat-lich-tu-van` | `src/app/(customer)/dat-lich-tu-van/page.tsx` |
| `/installment` | `src/app/(customer)/installment/page.tsx` |
| `/live-chat` | `src/app/(customer)/live-chat/page.tsx` |
| `/tra-thuoc-chinh-hang` | `src/app/(customer)/tra-thuoc-chinh-hang/page.tsx` |
| `/upload-toa` | `src/app/(customer)/upload-toa/page.tsx` |
| `/voucher` | `src/app/(customer)/voucher/page.tsx` |
| `/tiem-chung/dat-lich` | `src/app/(customer)/tiem-chung/dat-lich/page.tsx` |
| `/tiem-chung/so-tiem` | `src/app/(customer)/tiem-chung/so-tiem/page.tsx` |
| `/mobile` | `src/app/(customer)/mobile/page.tsx` |
| `/mobile/nhac-uong-thuoc` | `src/app/(customer)/mobile/nhac-uong-thuoc/page.tsx` |
| `/mobile/nhac-uong-thuoc/new` | `src/app/(customer)/mobile/nhac-uong-thuoc/new/page.tsx` |
| `/ai/drug-check` | `src/app/(customer)/ai/drug-check/page.tsx` |
| `/ai/rx-ocr` | `src/app/(customer)/ai/rx-ocr/page.tsx` |

### 4.2 Auth UI-only

| Route | File |
|---|---|
| `/addresses` | `src/app/(auth)/addresses/page.tsx` |
| `/family` | `src/app/(auth)/family/page.tsx` |
| `/points` | `src/app/(auth)/points/page.tsx` |
| `/profile` | `src/app/(auth)/profile/page.tsx` (+ 3 sub-component) |
| `/wallet` | `src/app/(auth)/wallet/page.tsx` |

### 4.3 Dashboard UI-only / shell (chưa gắn data layer)

| Route | File | Note |
|---|---|---|
| `/payments` | `src/app/(dashboard)/payments/page.tsx` | Không có API call |
| `/rx-console/consult` | `src/app/(dashboard)/rx-console/consult/page.tsx` | Shell UI |
| `/rx-console/customer-360` | `src/app/(dashboard)/rx-console/customer-360/page.tsx` | Shell UI |
| `/rx-console/follow-up` | `src/app/(dashboard)/rx-console/follow-up/page.tsx` | Shell UI |
| `/rx-console/vip` | `src/app/(dashboard)/rx-console/vip/page.tsx` | Shell UI |

### 4.4 Shop pages (tĩnh / chính sách)

| Route | File |
|---|---|
| `/chinh-sach/[slug]` | `src/app/(shop)/chinh-sach/[slug]/page.tsx` (dùng `data/policies.tsx` — nội dung tĩnh) |
| `/gioi-thieu` | `src/app/(shop)/gioi-thieu/page.tsx` |
| `/tin-tuc-su-kien` | `src/app/(shop)/tin-tuc-su-kien/page.tsx` |
| `/tuyen-dung` | `src/app/(shop)/tuyen-dung/page.tsx` |

---

## Phần 5: Bản đồ API backend đã được GẮN vs CHƯA GẮN

### 5.1 Service layer (đã có, gọi backend thật)

```
src/lib/api/client.ts                          ← axios + JWT
src/lib/api/endpoints.ts                       ← API_ENDPOINTS
src/lib/auth/auth.ts                           ← login / logout / getCurrentUser

src/features/
  branches/services/branchService.ts           ← CRUD
  categories/services/categoryService.ts       ← CRUD
  customers/services/customerService.ts        ← CRUD + history
  home/services/dashboardService.ts            ← /users, /branches, /medicines, /orders, /inventory/low-stock
  inventory/services/inventoryService.ts       ← CRUD + low-stock
  medicines/services/medicineService.ts        ← CRUD thuốc + categories
  notifications/services/notificationService.ts← list / mark-read / send
  orders/services/orderService.ts              ← CRUD order + payment
  prescriptions/services/prescriptionService.ts← list / create
  reports/services/reportService.ts            ← revenue / inventory report
  search/services/searchService.ts             ← GET /search?q=
  suppliers/services/supplierService.ts        ← CRUD
  users/services/userService.ts                ← CRUD + reset password
```

### 5.2 Service layer (CHƯA CÓ — đang dùng mock)

| Endpoint cần có | Trang phụ thuộc | Mock hiện tại |
|---|---|---|
| `GET /products` + `/products/{slug}` (PDP) | `/[slug]/[subSlug]/[productSlug]` | `shop/catalog.ts` |
| `GET /categories/tree` (L1, L2) | `/[slug]`, `/[slug]/[subSlug]` | `shop/catalog.ts` |
| `GET /products/search?q=` | `/tim-kiem`, `/ai/semantic-search` | `shop/catalog.ts` |
| `GET /products/{slug}/reviews`, `POST /reviews` | `/reviews`, `/reviews/new/[slug]` | `shop/catalog.ts` |
| `GET /flash-sale/{id}` | `/flash-sale/[id]` | `shop/catalog.ts` |
| `GET /customer/favorites` | `/favorites` | `shop/catalog.ts` |
| `GET /articles` + `/articles/{slug}` | `/bai-viet*` | `shop/articles.ts` |
| `GET /diseases` + `/diseases/{slug}` | `/benh-thuong-gap*` | `shop/diseases.ts` |
| `GET /herbs` + `/herbs/{slug}` | `/tra-cuu-duoc-lieu*` | `shop/herbs.ts` |
| `GET /ingredients` + `/ingredients/{slug}` | `/tra-cuu-duoc-chat*` | `shop/ingredients.ts` |
| `GET /cancers` | `/chuyen-trang-ung-thu` | `shop/cancer.ts` |
| `GET /vaccines` | `/tiem-chung` | `shop/vaccines.ts` |
| `GET /videos` | `/video` | `shop/videos.ts` |
| `GET /health-quizzes` + `/health-quizzes/{slug}` | `/suc-khoe/kiem-tra*` | `shop/health-quizzes.ts` + `quiz-questions.ts` |
| `POST /ai/chat` (smart-mock) | `/ai/chat` | `data/ai-responses.ts` |
| `GET /customer/orders` + `/customer/orders/{id}` | `/don-hang*` | `shop/orders.ts` |
| `GET /stores/{province}` + `/stores/{province}/{id}` | `/he-thong-cua-hang/*` (đã có API cho list root, chưa có cho detail theo tỉnh) | `shop/stores.ts` |
| `GET /cross-sell?medicineId=` | `/rx-console/cross-sell` | `shop/catalog.ts` |

### 5.3 Trang cần thêm service layer hoàn toàn

| Route | Lý do |
|---|---|
| `/cart`, `/checkout` | Cần `POST /orders` thật; hiện lưu localStorage |
| `/flash-sale` (list) | Cần `GET /flash-sale` |
| `/dat-lich-tu-van`, `/tiem-chung/dat-lich`, `/tiem-chung/so-tiem` | Cần `POST/GET /consultations`, `/vaccination-appointments` |
| `/upload-toa` | Cần `POST /prescriptions/upload` |
| `/voucher` | Cần `GET /vouchers` + `POST /vouchers/redeem` |
| `/installment` | Cần `GET /installment/plans` |
| `/live-chat` | WebSocket / chat service |
| `/ai/drug-check`, `/ai/rx-ocr` | Cần AI backend thật |
| `/tra-thuoc-chinh-hang` | Cần `GET /products/authenticity-check` |
| `/mobile/nhac-uong-thuoc*` | Cần `GET/POST /reminders` (đã có hook `useReminders` nhưng chưa có service) |
| `/addresses`, `/family`, `/points`, `/profile`, `/wallet` | Cần `GET/PUT /customers/me/*` |
| `/payments`, `/rx-console/{consult,customer-360,follow-up,vip}` | Cần service layer dashboard |

---

## Kết luận & đề xuất

1. **Phần dashboard/admin** (đã gắn API): 23 trang + 1 trang store locator = ổn, chạy được khi backend live.
2. **Phần shop B2C** (đang mock): 31 trang/component. Đây là khối lớn nhất cần backend B2C (catalog, content, lookup, đơn hàng khách, AI chat).
3. **Phần UI-only** (34 trang): cần thiết kế + service layer trước khi gắn backend — nhiều trang chưa có spec nghiệp vụ.

**Để chuyển đổi mock → API thật**, cần (a) bổ sung endpoint backend B2C, (b) tạo `src/features/shop/*/services/*` tương ứng, (c) refactor các trang MOCK ở Phần 3 để gọi qua service thay vì import trực tiếp từ `@/data/shop/*`.

**Để phủ UI-only → API thật**, cần làm rõ UC trước (Phần 4.1-4.3) rồi mới gắn service.
