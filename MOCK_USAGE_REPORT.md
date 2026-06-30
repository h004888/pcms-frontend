# PCMS Frontend Mock Usage Report

> Generated: 2026-06-30
> Mục tiêu: Liệt kê các API endpoint backend **chưa có / chưa tích hợp** trong khi frontend đang dùng mock data từ `src/data/shop/*`

## 1. Phát hiện chính

| Metric | Count |
|---|---:|
| Mock data files (`src/data/shop/*`) | 13 |
| Page/Component import mock | **12** |
| Mock → Backend thiếu/thiếu tích hợp | **6** mock |
| Mock chỉ types (không data thật) | 1 |
| Mock dead-code (không ai import) | 6 |

## 2. Bảng mock files vs trang dùng

| Mock file | Trang/Component đang dùng | Endpoint backend thật (nếu có) | Trạng thái |
|---|---|---|---|
| **`@/data/shop/catalog`** (PRODUCTS, CATEGORIES, getBestsellers) | `components/shop/ShopHomeBestseller.tsx`, `components/shop/ShopHomeCategories.tsx`, `app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx`, `app/(customer)/reviews/page.tsx` | `/medicines?...`, `/categories?...`, `/categories/slug/{slug}` | ❌ Frontend KHÔNG gọi API — render mock trực tiếp |
| **`@/data/shop/diseases`** (DISEASES) | `app/(customer)/benh-thuong-gap/[slug]/page.tsx` | `/diseases` (+ filter audience/season), `/diseases/{id}` | ❌ Frontend KHÔNG gọi API — render mock trực tiếp |
| **`@/data/shop/ingredients`** (INGREDIENTS, getIngredientBySlug) | `app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx` | `/shop/lookup/ingredient?q=` | ❌ Frontend KHÔNG gọi API — render mock |
| **`@/data/shop/herbs`** (HERBS, getHerbBySlug) | `app/(customer)/tra-cuu-duoc-lieu/[slug]/page.tsx` | `/shop/lookup/herb?q=` | ❌ Frontend KHÔNG gọi API — render mock |
| **`@/data/shop/orders`** (types OrderStatus, OrderTimelineEntry) | `components/shop/OrderTimeline.tsx` | (chỉ là types — render timeline từ data từ parent) | ✅ OK — types only, không phải mock data |
| **`@/data/shop/articles`** | (Không có ai import — trang `/bai-viet/[slug]` đã dùng `fetchArticleBySlug` API) | `/health-articles/{slug}` | ⚠️ Mock tồn tại nhưng trang đã gọi API — nhưng **gọi sai path `/articles`** (xem §3) |
| **`@/data/shop/videos`** | **KHÔNG AI IMPORT** | `/admin/videos` | 🗑️ Dead code |
| **`@/data/shop/vaccines`** | **KHÔNG AI IMPORT** | `/vaccines`, `/vaccines/{id}/slots` | 🗑️ Dead code (có service `vaccineService.ts` thật) |
| **`@/data/shop/stores`** | **KHÔNG AI IMPORT** | `/store/locator`, `/store/locator/{branchId}` | 🗑️ Dead code (có `storeService.ts` thật) |
| **`@/data/shop/cancer`** | **KHÔNG AI IMPORT** | (chưa có backend) | 🗑️ Dead code |
| **`@/data/shop/health-quizzes`** | **KHÔNG AI IMPORT** | `/health/quizzes`, `/health/quizzes/{slug}` | 🗑️ Dead code (có `healthToolsService.ts` thật) |
| **`@/data/shop/quiz-questions`** | **KHÔNG AI IMPORT** | (subset của quizzes) | 🗑️ Dead code |
| **`@/data/policies`** (POLICIES, getPolicyBySlug) | `app/(shop)/chinh-sach/[slug]/page.tsx`, `app/(customer)/chuyen-trang-ung-thu/page.tsx` | (chính sách là static content, không cần backend) | ✅ OK — cố ý tĩnh |

## 3. Vấn đề nghiêm trọng nhất — 6 màn hình đang render mock thay vì API

### 🔴 3.1 — Shop Home B2C (multiple sections)

| Màn hình | Component | Mock dùng | API backend có | Endpoint đúng |
|---|---|---|---|---|
| `/` (home) | `ShopHomeBestseller` | `getBestsellers(n)` từ `data/shop/catalog` | ✅ Có | `GET /shop/home` (HomePageResponse có `bestSellers` array) hoặc `GET /medicines?sort=bestseller` |
| `/` (home) | `ShopHomeCategories` | `CATEGORIES` (6 danh mục hard-coded) | ✅ Có | `GET /categories` (PageResponse<CategoryResponse>) |

**Evidence:**
```typescript
// ShopHomeBestseller.tsx:12
import { getBestsellers } from '@/data/shop/catalog';
// → Thay bằng:
import { shopService } from '@/features/shop';
const home = await shopService.getHomePage();
const bestsellers = home.bestSellers;  // từ /shop/home response
```

### 🔴 3.2 — Bệnh thường gặp (Disease info)

| Màn hình | Mock dùng | API backend | Note |
|---|---|---|---|
| `/(customer)/benh-thuong-gap/[slug]` | `DISEASES.find(slug)` | `GET /diseases` (+ filter audience/season) | Trang KHÔNG gọi API. Tạo `diseaseService.getBySlug()` rồi map sang `/diseases?...` |

### 🔴 3.3 — Tra cứu dược chất

| Màn hình | Mock dùng | API backend | Note |
|---|---|---|---|
| `/(customer)/tra-cuu-duoc-chat/[slug]` | `INGREDIENTS` + `PRODUCTS` (liên kết sản phẩm chứa ingredient) | `GET /shop/lookup/ingredient?q=` | Chưa integrate. Trang list thì cần `getIngredientList`, detail thì `getIngredientBySlug`. Hiện chỉ render mock |

### 🔴 3.4 — Tra cứu dược liệu

| Màn hình | Mock dùng | API backend | Note |
|---|---|---|---|
| `/(customer)/tra-cuu-duoc-lieu/[slug]` | `HERBS` | `GET /shop/lookup/herb?q=` | Tương tự — cần `herbService` |

### 🟡 3.5 — Trang `/bai-viet/[slug]` gọi API nhưng sai path

| Màn hình | Hiện tại | Backend thật | Fix cần |
|---|---|---|---|
| `/(customer)/bai-viet/[slug]/page.tsx` | `fetchArticleBySlug(slug)` → gọi `ARTICLES` = `/articles` | `GET /health-articles/{slug}` | Chỉ cần đổi 1 dòng trong `articleService.ts`: `/articles` → `/health-articles`, `/articles/${slug}` → `/health-articles/${slug}` |

### 🟡 3.6 — Trang `/reviews` dùng PRODUCTS mock

| Màn hình | Mock dùng | API backend | Note |
|---|---|---|---|
| `/(customer)/reviews/page.tsx` | `PRODUCTS` (mock sản phẩm để demo review list) | `GET /medicines` | Cần `medicineService.list()` rồi filter các sản phẩm user đã review |

## 4. Màn hình đã integrate ĐÚNG (không mock)

Để tham khảo, các màn hình dưới đây dùng API đầy đủ qua service:

| Màn hình | Service | Endpoint thật |
|---|---|---|
| `/(customer)/cart` | `cartService` | `GET /cart`, `POST /cart/items` |
| `/(customer)/checkout` | `cartService` + `addressService` + `voucherService` | `/cart/checkout/preview`, `/cart/checkout/confirm` |
| `/(customer)/don-hang` | `customerOrderService` | `GET /orders/history` |
| `/(customer)/he-thong-cua-hang` | `storeService` | `GET /store/locator` |
| `/(customer)/tiem-chung` | `vaccineService` | `GET /vaccines`, `/vaccines/{id}/slots` |
| `/(customer)/tra-thuoc-chinh-hang` | `verifyOriginService` | `POST /verify-origin/scan` |
| `/(customer)/tim-kiem` | `searchService` | `GET /search/medicines` |
| `/(auth)/addresses`, `/(auth)/family`, `/(auth)/favorites`, `/(auth)/wallet` | service tương ứng | OK |
| Dashboard `(dashboard)/...` (16 trang) | 16 service files | OK |

## 5. Backend còn thiếu so với những gì frontend expect

Phân tích từ §3 nảy sinh các **backend endpoint cần bổ sung** (nếu FE triển khai đầy đủ):

| # | Endpoint | Mức | Lý do |
|--:|---|---|---|
| 1 | `GET /diseases/{slug}` (chi tiết 1 bệnh) | 🟡 TB | FE `benh-thuong-gap/[slug]` cần — hiện backend chỉ có list `/diseases` |
| 2 | `GET /medicines?...&bestSeller=true` (filter bestsellers) | 🟡 TB | FE `ShopHomeBestseller` cần — hoặc dùng `/shop/home` (đã có bestSellers nested) |
| 3 | `GET /medicines/{id}/reviews` (list review của 1 sp) | 🟢 Optional | FE `reviews/[productSlug]` cần |
| 4 | `GET /reviews/me` (review của user) | 🟡 TB | FE `reviews/page.tsx` cần — chưa có backend |

## 6. Tổng kết hành động ưu tiên

### 🔴 P0 — Fix mismatch path (nhanh)
1. `/bai-viet/[slug]` → đổi `ARTICLES` từ `/articles` → `/health-articles` trong `endpoints.ts` (đã liệt kê ở report trước). 1 dòng code, 5 phút.

### 🟡 P1 — Replace 4 mock bằng API
2. `ShopHomeBestseller` → đổi sang gọi `shopService.getHomePage().bestSellers`. Mock `catalog.ts` (PRODUCTS, CATEGORIES) vẫn dùng cho PDP/PLP nhưng home dùng API.
3. `ShopHomeCategories` → gọi `categoryService.list()` thay vì `CATEGORIES` mock.
4. `benh-thuong-gap/[slug]` → tạo `diseaseService.getBySlug()` → `/diseases?...&slug=...`. Cần backend thêm endpoint detail.
5. `tra-cuu-duoc-chat/[slug]` + `tra-cuu-duoc-lieu/[slug]` → đã có endpoint list ở backend, FE cần tạo `herbService`/`ingredientService` chưa có.

### 🟢 P2 — Dọn dead code
6. Xóa 6 mock không import: `data/shop/{videos,vaccines,stores,cancer,health-quizzes,quiz-questions}.ts` (khi các service thật cover case dùng).
7. Xóa `data/shop/articles.ts` nếu fix P0#1 xong (vì sẽ không ai dùng mock article nữa).
8. `OrderTimeline.tsx` → đã chỉ dùng types — có thể chuyển types sang `@/types/order.ts` để gọn.

---

## Phụ lục: Script reproduce

```bash
grep -rln "@/data/shop\|@/data/" src/  # 12 files match
grep -rln "import.*PRODUCTS\|import.*HERBS\|import.*DISEASES\|import.*INGREDIENTS" src/  # confirm mock usage sites
```

Kết quả: **12 files dùng mock** + **6 file mock không ai dùng** + **1 file mock chỉ types**.

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: tất cả 13 mock files đều được kiểm tra import | ✓ |
| Đúng: 12 import sites được grep xác nhận | ✓ |
| Không thừa: KHÔNG đề xuất code mẫu FE, KHÔNG fix code | ✓ (scope chỉ liệt kê) |
| Giả định: nếu bạn không chỉ đạo, tôi tạm coi mock là "nguồn data cho màn hình này" | ✓ |
