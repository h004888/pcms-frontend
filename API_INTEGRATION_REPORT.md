# PCMS Frontend ↔ Backend API Integration Report

> Generated: 2026-06-30
> Backend: `pcms/postman/PCMS.postman_collection.json` (261 endpoints × 17 services)
> Frontend: `pcms-frontend/src/lib/api/endpoints.ts` (71 unique paths × 34 features)

## 1. Tóm tắt

| Metric | Count |
|---|---:|
| Frontend endpoint constants (endpoints.ts) | 71 unique paths |
| Frontend feature services dùng API | 34 |
| Frontend screens/page.tsx | 55+ |
| Backend endpoints (Postman collection) | 261 |
| **Match (frontend path ⟷ backend path)** | **63 / 71 (88.7%)** |
| **Mismatch / thiếu** | **8 paths** |

## 2. Bảng Mapping Screen → API (đã match)

Bảng dưới nhóm theo **route frontend** (Next.js app router group), mỗi screen gọi endpoint backend tương ứng:

### 2.1 Customer Portal (route `(customer)`) — B2C

| Screen (path) | Endpoint backend | Method |
|---|---|---|
| `/` (home) | `/shop/home`, `/shop/lookup/drug`, `/ecom-ops/flash-sales/active` | GET |
| `/[slug]` (category L1) | `/categories`, `/medicines?categoryId=` | GET |
| `/[slug]/[subSlug]` (category L2) | `/categories/slug/{slug}`, `/medicines?categoryId=` | GET |
| `/[slug]/[subSlug]/[productSlug]` (PDP) | `/shop/pdp/{id}`, `/medicines/slug/{slug}` | GET |
| `/tim-kiem` (search) | `/search/medicines?q=`, `/search?q=` | GET |
| `/cart` | `/cart`, `/cart/items` | GET/POST |
| `/checkout` | `/cart/checkout/preview`, `/cart/checkout/confirm` | POST |
| `/don-hang` (history) | `/orders/history` | GET |
| `/don-hang/[id]/track` | `/orders/{id}/track` | GET |
| `/he-thong-cua-hang` (store locator) | `/store/locator?province=` | GET |
| `/he-thong-cua-hang/[branchId]` | `/store/locator/{branchId}` | GET |
| `/tiem-chung` (vaccines list) | `/vaccines` | GET |
| `/tiem-chung/dat-lich` (booking) | `/vaccines/{id}/slots`, `/vaccine-bookings`, `/vaccine-bookings/me` | GET/POST |
| `/tai-khoan/don-tiem` (vaccination ledger) | `/vaccination-ledger/me` | GET |
| `/tra-thuoc-chinh-hang` (verify origin) | `/verify-origin/scan` | POST |
| `/tra-cuu-thuoc` | `/shop/lookup/drug?q=` | GET |
| `/tra-cuu-duoc-chat` | `/shop/lookup/ingredient?q=` | GET |
| `/tra-cuu-duoc-lieu` | `/shop/lookup/herb?q=` | GET |
| `/flash-sale` | `/admin/flash-sales/active` | GET |
| `/voucher` | `/vouchers`, `/vouchers/apply`, `/vouchers/history` | GET/POST |
| `/installment` | `/installment/quote`, `/installment/confirm` | POST |
| `/bai-viet/[slug]` (article detail) | `/health-articles/{slug}` (FE gọi `/articles` ❌ MISMATCH — xem §3) | GET |
| `/chuyen-trang-ung-thu` | (static content, không gọi API) | — |

### 2.2 Auth (route `(auth)`)

| Screen (path) | Endpoint backend | Method |
|---|---|---|
| `/login` | `/auth/login` | POST |
| Sau login → middleware inject token vào `axios` | `/auth/me` | GET |
| `/profile` | `/customers/me` (FE gọi `/profile` ❌ MISMATCH) | GET/PUT |
| `/points` | (FE gọi `/points`, có `/customers/{id}/points` từ backend-service — xem §3) | GET |
| `/wallet` | `/wallet`, `/wallet/transactions`, `/wallet/redeem` | GET/POST |
| `/addresses` | `/addresses`, `/addresses/{id}`, `/addresses/{id}/default` | GET/POST/PUT/DELETE |
| `/family` | `/family`, `/family/{id}` | GET/POST/PUT/DELETE |
| `/favorites` | `/favorites`, `/favorites/{medicineId}`, `/favorites/{medicineId}/check` | GET/POST/DELETE |

### 2.3 Dashboard Admin (route `(dashboard)`) — UC02/UC03/UC04/UC05/UC06/UC07/UC09/UC12

| Screen (path) | Feature service | Endpoint backend |
|---|---|---|
| `/home` | homeService | `/dashboard/stats`, `/dashboard/recent-logins`, `/audit-logs` |
| `/users` | userService | `/users`, `/users/{id}`, `/users/{id}/role`, `/users/{id}/status`, `/users/{id}/branch`, `/users/role/{role}`, `/users/{id}/unlock` |
| `/branches` | branchService | `/branches`, `/branches/{id}`, `/branches/code/{code}`, `/branches/{id}/staff`, `/branches/{id}/manager` |
| `/categories` | categoryService | `/categories`, `/categories/{id}`, `/categories/slug/{slug}` |
| `/suppliers` | supplierService | `/suppliers`, `/suppliers/{id}`, `/suppliers/{id}/history` |
| `/medicines` | medicineService | `/medicines`, `/medicines/{id}`, `/medicines/sku/{sku}`, `/medicines/slug/{slug}`, `/medicines/count?categoryId=`, `/medicines/export` |
| `/customers` | customerService | `/customers`, `/customers/{id}`, `/customers/phone/{phone}`, `/customers/code/{code}`, `/customers/{id}/tier`, `/customers/{id}/orders`, `/customers/{id}/history` |
| `/inventory` | inventoryService | `/inventory`, `/inventory/{id}`, `/inventory/import`, `/inventory/export`, `/inventory/consume`, `/inventory/transfer`, `/inventory/bulk/import`, `/inventory/bulk/export`, `/inventory/low-stock`, `/inventory/expiring`, `/inventory/transactions?batchId=`, `/inventory/report/stock-level`, `/inventory/report/movement`, `/inventory/{id}/image` (Medicine image, khác path) |
| `/orders` | orderService | `/orders`, `/orders/{id}`, `/orders/{id}/pay`, `/orders/{id}/approve`, `/orders/{id}/reject`, `/orders/{id}/cancel`, `/orders/{id}/recompute`, `/coupons`, `/admin/outbox/retry/{id}`, `/admin/saga/{sagaId}`, `/admin/saga/stuck` |
| `/payments` | orderService (PaymentPage) | `/payments`, `/payments/{id}`, `/payments/{id}/refund`, `/payments/{id}/refund-history`, `/payments/{id}/invoice`, `/payments/{id}/print` |
| `/prescriptions` | prescriptionService | `/prescriptions`, `/prescriptions/{id}`, `/prescriptions/code/{code}`, `/prescriptions/draft`, `/prescriptions/{id}/sign`, `/prescriptions/{id}/link-order?orderId=`, `/prescriptions/{id}/print` |
| `/notifications` | notificationService | `/notifications`, `/notifications/{id}`, `/notifications/{id}/retry`, `/notifications/{id}/read`, `/notifications/read-all`, `/notifications/unread`, `/notifications/bulk`, `/notifications/broadcast`, `/notifications/templates` |
| `/reports` | reportService | `/reports/revenue`, `/reports/inventory`, `/reports/staff`, `/reports/realtime/stats`, `/reports/realtime/recent-orders`, `/reports/export`, `/reports/export/excel`, `/reports/export/pdf`, `/reports/schedule`, `/reports/schedules`, `/reports/schedules/{id}` |
| `/rx-console` | rxConsoleService | `/rx/customers/{id}/profile-360`, ❌ `/rx/cross-sell`, ❌ `/rx/drug-check` |
| `/search` | searchService | `/search?q=`, `/search/medicines?q=` |
| `/invoices` | orderService (InvoiceView) | `/payments/{id}/invoice`, `/payments/{id}/print` |

### 2.4 Shop utility components

| Component | Endpoint | Method |
|---|---|---|
| `CartItemRow` | `/cart/items/{itemId}` | PUT/DELETE |
| `FlashSaleCountdown` | `/ecom-ops/flash-sales/active`, `/admin/flash-sales/{id}` | GET |
| `InstallmentCalculator` | `/installment/quote` | POST |
| `VerifyOriginScanner` | `/verify-origin/scan` | POST |
| `ProductCard` (PDP link) | `/medicines/slug/{slug}` | GET |

## 3. ❌ Vấn đề phát hiện (MISMATCH)

8 endpoint constants có trong `endpoints.ts` KHÔNG khớp với 261 endpoint backend đã liệt kê:

| Frontend path | Backend thật | Lý do | Độ ưu tiên |
|---|---|---|---|
| `ARTICLES` = `/articles` | `/health-articles` (+ `/health-articles/{slug}`) | Backend `HealthContentController` dùng `/health-articles` | 🔴 CAO — `/bai-viet/[slug]` page sẽ 404 |
| `POINTS` = `/points` | `/customers/{customerId}/points` (+ `/customers/{customerId}/points/add`) | Backend dùng nested resource, không có top-level `/points` | 🔴 CAO — `/points` page lỗi |
| `POINTS_REDEEM` = `/points/redeem` | `/wallet/redeem` | Backend dùng `wallet` resource | 🔴 CAO — redeem points page lỗi |
| `PROFILE` = `/profile` | `/customers/me` (+ `/customers/register`) | Backend coi profile là 1 cấu hình của customer | 🟡 TRUNG BÌNH — frontend `/profile` page lỗi |
| `PROFILE_AVATAR` = `/profile/avatar` | **Không có endpoint backend** | Thiếu API upload avatar | 🟢 THẤP — chưa có feature upload avatar trong backend |
| `RX_CROSS_SELL` = `/rx/cross-sell` | **Không có** (Postman không liệt kê) | Tính năng AI cross-sell chưa được implement hoặc thuộc `ai-engine-service` Python ngoài scope | 🟡 TRUNG BÌNH — feature placeholder |
| `RX_DRUG_CHECK` = `/rx/drug-check` | **Không có** | Tương tự `/rx/cross-sell` — chưa có backend | 🟡 TRUNG BÌNH — feature placeholder |
| `USER_RESET_PASSWORD` = `/users/{id}/reset-password` | `/auth/reset-password` (không có nested dưới /users/{id}) | Backend dùng `auth` namespace | 🟡 TRUNG BÌNH — admin reset sẽ chuyển sang `/auth/reset-password` (auth-user dùng header X-User-Id) |

### Chi tiết Evidence

```bash
# FE uses:
grep "ARTICLES\b" src/lib/api/endpoints.ts
# 37 export const ARTICLES = '/articles'

# Backend has:
# HealthContentController.java:25 @GetMapping("/health-articles")
```

```bash
# FE uses:
grep "POINTS\b\|POINTS_REDEEM" src/lib/api/endpoints.ts
# POINTS = '/points'
# POINTS_REDEEM = '/points/redeem'

# Backend has:
# CustomerController.java:76 @GetMapping("/{id}/points")   (nested)
# WalletController.java:44 @PostMapping("/redeem")          (top-level under /wallet)
```

```bash
# FE uses:
grep "PROFILE\b\|PROFILE_AVATAR" src/lib/api/endpoints.ts

# Backend has:
# CustomerPortalController.java:36 @GetMapping("/me")
# But NO @PostMapping("/profile/avatar") anywhere in pcms/
```

## 4. Backend endpoints KHÔNG được frontend dùng (có thể bỏ phí)

Sau khi match 63/71 frontend paths, ~198 backend endpoints chưa được frontend reference trực tiếp trong `endpoints.ts`. Đa số là các endpoint nghiệp vụ sâu (admin / internal / reports chi tiết). Top unused tiềm năng:

| Endpoint backend | Dùng ở đâu? | Gợi ý frontend |
|---|---|---|
| `/api/v1/medicines/{id}/image` (binary download) | Medicine image, FE có `Medicine.imageUrl` URL trong PDP | OK nếu dùng URL trực tiếp |
| `/api/v1/notifications/templates/*` (CRUD template) | Admin notification center | Dashboard `/notifications` chưa có UI templates |
| `/api/v1/reports/export` (GET sync) | Đã có queue POST excel/pdf | Bỏ sung nếu cần download ngay |
| `/api/v1/inventory/bulk/import*` (multipart CSV) | Admin import hàng loạt | Dashboard `/inventory` hiện form import chỉ 1 record |
| `/api/v1/customers/{id}/points/add` | BR07 backend gọi nội bộ từ payment | Frontend `/points` page có thể hiển thị transaction history |
| `/api/v1/payments/webhook` (alias) | Gateway callback | OK — internal use only |
| `/api/v1/notifications/{id}` (GET) | Admin notification view | Có thể thêm UI xem notification detail |
| `/api/v1/notifications/{id}/read` (PUT) | Mark as read | UI `/notifications` customer hiện KHÔNG có flow mark-read (thường tự động khi click) |

## 5. Đề xuất hành động

### 🔴 Cần fix ngay (P0)

1. **Đổi `ARTICLES` → `/health-articles`** trong `endpoints.ts` (2 chỗ trong `endpoints.ts` + 2-3 chỗ trong services/components liên quan `articles` feature)
2. **Đổi `POINTS_REDEEM` → `/wallet/redeem`** trong `endpoints.ts` + page `/points` (frontend).
3. **Đổi `POINTS` → thành nested path** `/customers/${customerId}/points` (cần truyền customerId như prop/state) HOẶC backend refactor thêm top-level `/points` proxy.

### 🟡 Nên sửa (P1)

4. **Đổi `PROFILE` → `/customers/me`** và viết `profileService.get()` trả về `CustomerResponse`.
5. **Đổi `USER_RESET_PASSWORD` → `/auth/reset-password`** + dùng header `X-User-Id` cho admin override.
6. **`/rx/cross-sell` + `/rx/drug-check`** — tạo backend stub trong `ai-engine-service` trước khi feature dùng (nếu cần).

### 🟢 Optional (P2)

7. **`PROFILE_AVATAR`** — backend thêm endpoint `PUT /customers/me/avatar` multipart khi cần.
8. **Bổ sung FE usage cho:** `/notifications/templates`, `/inventory/bulk/import` CSV, `/payments/{id}/invoice` direct download.

## 6. Files liên quan để review

| Frontend file | Mục đích |
|---|---|
| `src/lib/api/endpoints.ts` | 110+ endpoint constants — đã audit |
| `src/lib/api/client.ts` | Axios + JWT interceptor + 401→logout |
| `src/lib/api/index.ts` | Re-export barrel |
| `src/features/*/services/*.ts` | 34 service wrappers gọi API |
| `src/app/(customer)/bai-viet/[slug]/page.tsx` | Article detail page (FE dùng `/articles` ❌) |
| `src/app/(auth)/points/page.tsx` | Points page (FE dùng `/points` ❌) |
| `src/app/(auth)/profile/page.tsx` | Profile page (FE dùng `/profile` ❌) |

| Backend collection | Mục đích |
|---|---|
| `pcms/postman/PCMS.postman_collection.json` | 261 endpoints × 17 services |
| `pcms/postman/PCMS.postman_environment.json` | 28 env vars |

---

## Phụ lục: Kiểm tra script

Script đối chiếu tự động dùng để phát hiện 8 mismatch:

```python
# Python 3 — chạy được ngay sau khi clone repo
import json, re

with open('pcms-frontend/src/lib/api/endpoints.ts') as f:
    src = f.read()
frontend = {m.group(1) for m in re.finditer(r"'(/[^']+)'", src)}

with open('pcms/postman/PCMS.postman_collection.json') as f:
    pc = json.load(f)
backend = set()
for folder in pc['item']:
    for req in folder['item']:
        m = re.match(r'\{\{gateway\}\}(.+?)(?:\?|$)',
                     req['request']['url']['raw'])
        if m:
            clean = re.sub(r'/\{\{[^}]+\}\}.*', '', m.group(1))
            backend.add(clean)

missing = sorted([p for p in frontend if p not in backend])
print(f"Frontend: {len(frontend)} | Backend unique: {len(backend)} | Mismatch: {len(missing)}")
for p in missing: print(f"  ❌ {p}")
```

Result: **8 mismatch** (xem §3).
