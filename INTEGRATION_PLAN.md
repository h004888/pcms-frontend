# PCMS API Integration Plan — Hoàn thiện tích hợp còn thiếu

> Generated: 2026-06-30
> Scope: 12 task (cả FE + BE) — implement theo thứ tự ưu tiên.
> Mục tiêu: biến tất cả UI screens từ mock-data sang live API, fix path mismatch, thêm endpoint còn thiếu.

## 0. Bối cảnh & đầu vào

Báo cáo tham chiếu:
- `API_INTEGRATION_REPORT.md` — 8 endpoint mismatch path
- `MOCK_USAGE_REPORT.md` — 6 màn hình đang render mock thay vì API + 6 mock dead-code

**Trạng thái hiện tại:**
- 88.7% frontend endpoints khớp backend
- 6 màn hình B2C cốt lõi (Shop Home, Bệnh thường gặp, Tra cứu dược chất/dược liệu, Reviews, Bài viết) đang render mock hoặc gọi sai path

## 1. Tổng quan 12 task

| # | Task | Loại | Sprint | Effort | Phụ thuộc |
|--:|---|---|:-:|---|:-:|
| T01 | Fix `ARTICLES` path `/articles` → `/health-articles` | FE bugfix | Sprint 0 | XS (5 ph) | — |
| T02 | Fix `POINTS_REDEEM` path → `/wallet/redeem` | FE bugfix | Sprint 0 | XS (5 ph) | — |
| T03 | Fix `PROFILE` path → `/customers/me` | FE refactor | Sprint 0 | S (20 ph) | — |
| T04 | Fix `USER_RESET_PASSWORD` → `/auth/reset-password` | FE refactor | Sprint 0 | S (15 ph) | — |
| T05 | `ShopHomeBestseller` dùng `shopService.getHomePage()` thay mock | FE integration | Sprint 1 | M (30 ph) | T01–T04 |
| T06 | `ShopHomeCategories` dùng `categoryService.list()` thay mock | FE integration | Sprint 1 | M (30 ph) | T05 |
| T07 | `benh-thuong-gap/[slug]` — backend thêm `GET /diseases/{slug}` + FE đổi sang service | FE + BE | Sprint 1 | M (60 ph) | — |
| T08 | `tra-cuu-duoc-chat/[slug]` — tạo `ingredientService` + đổi mock | FE | Sprint 2 | S (20 ph) | T06 |
| T09 | `tra-cuu-duoc-lieu/[slug]` — tạo `herbService` + đổi mock | FE | Sprint 2 | S (20 ph) | T08 |
| T10 | `/rx/cross-sell` + `/rx/drug-check` — backend bổ sung stub hoặc xóa khỏi FE | FE + BE | Sprint 3 | M (45 ph) | — |
| T11 | `/reviews` — backend thêm `GET /reviews/me` + FE đổi mock | FE + BE | Sprint 3 | M (60 ph) | — |
| T12 | Dọn 6 mock dead-code + types chuyển sang `@/types/order.ts` | Cleanup | Sprint 4 | S (30 ph) | T08, T09 |

**Effort scale:** XS < 10ph · S 10–30ph · M 30–60ph · L > 60ph

## 2. Dependency graph

```
Sprint 0: T01 ─ T02 ─ T03 ─ T04      (độc lập, parallel OK)
Sprint 1: T05 ── T06 ── T07          (FE/BE song song)
Sprint 2: T08 ── T09                 (dùng pattern thống nhất từ T06)
Sprint 3: T10 ── T11                 (FE/BE)
Sprint 4: T12                        (cleanup cuối)
```

---

## Chi tiết từng task

### T01 — Fix `ARTICLES` path mismatch (Sprint 0, XS, FE only)

**Mục tiêu:** Trang `/bai-viet/[slug]` (article detail) và `/bai-viet` (article list) đang gọi `/articles` nhưng backend dùng `/health-articles`.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/lib/api/endpoints.ts:37-38` | Đổi `ARTICLES = '/articles'` → `ARTICLES = '/health-articles'`; đổi `ARTICLE_DETAIL = (slug) => /articles/${slug}` → `/health-articles/${slug}` |

**Acceptance criteria:**
- [ ] `fetchArticles()` gọi `/health-articles?cat=...` trả 200 (khi backend đang chạy)
- [ ] `fetchArticleBySlug(slug)` gọi `/health-articles/${slug}` trả 200
- [ ] Không còn warning 404 trong console khi trang render

**Rủi ro:** Không (chỉ đổi string constant).

---

### T02 — Fix `POINTS_REDEEM` path mismatch (Sprint 0, XS, FE only)

**Mục tiêu:** Redeem points page gọi `/points/redeem` nhưng backend dùng `/wallet/redeem`.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/lib/api/endpoints.ts:18` | Đổi `POINTS_REDEEM: '/points/redeem'` → `POINTS_REDEEM: '/wallet/redeem'` |

**Acceptance criteria:**
- [ ] Trang redeem gọi `POST /wallet/redeem` thành công
- [ ] Server trả về `RedeemResponse` (point mới + reward)

**Rủi ro:** Không.

---

### T03 — Fix `PROFILE` path mismatch (Sprint 0, S, FE only)

**Mục tiêu:** Trang `/profile` đang gọi `/profile` không có thật. Backend dùng `/customers/me`.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/lib/api/endpoints.ts:30-31` | `PROFILE: '/profile'` → `ME: '/customers/me'` (đổi tên constant luôn cho rõ) |
| `pcms-frontend/src/features/profile/services/profileService.ts:8-15` | Refactor `fetchProfile()` dùng `API_ENDPOINTS.ME`; `updateProfile()` → `PUT /customers/me` |
| `pcms-frontend/src/features/profile/index.ts` | Re-export |
| `pcms-frontend/src/app/(auth)/profile/page.tsx` | Nếu đang dùng `fetchProfile`, cập nhật import/usage |

**Acceptance criteria:**
- [ ] Trang `/profile` load profile thật từ DB (khi login customer B2C)
- [ ] Update form PUT `/customers/me` thành công
- [ ] `PROFILE_AVATAR` (P2) có thể để nguyên hoặc xóa nếu không cần

**Rủi ro:**
- `PROFILE_AVATAR` chưa có backend (xem T10 pattern).
- Type `Profile` ở `features/profile/types.ts` có thể phải đổi sang `CustomerResponse` để khớp DTO backend.

---

### T04 — Fix `USER_RESET_PASSWORD` mismatch (Sprint 0, S, FE only)

**Mục tiêu:** Admin reset password flow trong dashboard đang gọi nested path nhưng backend dùng `/auth/reset-password`.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/lib/api/endpoints.ts:43` | `USER_RESET_PASSWORD: (id) => '/users/${id}/reset-password'` → đổi sang `'/auth/reset-password'` + truyền userId trong body |

**Acceptance criteria:**
- [ ] Admin click "Reset password" trên `/dashboard/users/[id]` gọi `POST /auth/reset-password` (với X-User-Id header + token) thành công
- [ ] User nhận email token và dùng được

**Rủi ro:** Backend `AuthController.resetPassword` cần check cả path `/auth/reset-password` (đã có). Có thể cần thêm check role admin qua gateway.

---

### T05 — ShopHomeBestseller dùng API (Sprint 1, M, FE only)

**Mục tiêu:** Component `ShopHomeBestseller` đang import mock `getBestsellers` từ `data/shop/catalog.ts`. Đổi sang gọi API thật.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/components/shop/ShopHomeBestseller.tsx` | Chuyển từ Client Component sang Server Component (hoặc thêm `'use client'` + `useEffect`). Gọi `shopService.getHomePage()` rồi lấy `home.bestSellers` |
| `pcms-frontend/src/features/shop/services/shopService.ts` | Thêm hàm `getHomePage()` (nếu chưa có) — trỏ vào `API_ENDPOINTS.SHOP_HOME = '/shop/home'` |

**Acceptance criteria:**
- [ ] Server-side render: trang `/` (home) chứa section "Sản phẩm nổi bật" với data từ `/shop/home` endpoint
- [ ] Loading state hợp lý (skeleton hoặc streaming)
- [ ] Mock catalog `PRODUCTS` vẫn có thể dùng cho các page khác (PDP, list page) — không xóa ngay, dùng fallback khi lỗi

**Rủi ro:**
- Backend `/shop/home` cần trả bestSellers sorted/ranked. Nếu chưa làm, tạo task phụ nội bộ backend (in-scope enhancement, không phải service mới).
- Nếu backend trả 500 → fallback dùng mock `getBestsellers` (acceptable degradation).

---

### T06 — ShopHomeCategories dùng API (Sprint 1, M, FE only)

**Mục tiêu:** `ShopHomeCategories` hiển thị 6 danh mục hard-coded từ `CATEGORIES`. Đổi sang `/categories` API.

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/components/shop/ShopHomeCategories.tsx` | Server Component, gọi `categoryService.list({ page: 0, size: 6 })` rồi render |
| `pcms-frontend/src/features/categories/services/categoryService.ts` | Đảm bảo `list(page, size)` đã có |

**Acceptance criteria:**
- [ ] Section "Danh mục nổi bật" load từ backend
- [ ] Icons + theme mapping: giữ nguyên `THEMES` constant ở FE, chỉ thay data source
- [ ] Cache kết quả 5 phút (Next.js revalidate)

**Rủi ro:** Nếu backend không có slug/child data cho L2, phải giữ mock fallback cho children.

---

### T07 — `/benh-thuong-gap/[slug]` (Sprint 1, M, FE + BE)

**Mục tiêu:** Trang disease detail đang render từ mock `DISEASES`. Đổi sang `/diseases/{slug}`.

**Backend cần thêm (in-scope, đây là 1 endpoint thôi):**

| File | Thay đổi |
|---|---|
| `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/controller/HealthContentController.java` | Thêm `@GetMapping("/diseases/{slug}")` trả `DiseaseInfoResponse` |
| `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/service/HealthContentService.java` | Implement `getDiseaseBySlug(slug)` (query DB theo slug, throw 404 nếu không có) |
| `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/dto/response/DiseaseInfoResponse.java` | Thêm field `slug` (nếu chưa có) + `summary`/`contentHtml` |
| `pcms/postman/PCMS.postman_collection.json` | Thêm 1 endpoint mới |
| `pcms/config-server/src/main/resources/config/customer-portal-service.yml` | (Không cần — chỉ mở rộng controller) |

**Frontend thay đổi:**

| File | Thay đổi |
|---|---|
| `pcms-frontend/src/features/health-tools/services/healthToolsService.ts` (hoặc tạo `diseaseService` mới) | Thêm `getDiseaseBySlug(slug)` → `GET /diseases/{slug}` |
| `pcms-frontend/src/app/(customer)/benh-thuong-gap/[slug]/page.tsx` | Xóa `import DISEASES`, đổi sang service async |
| `pcms-frontend/src/lib/api/endpoints.ts` | Thêm `DISEASE_DETAIL: (slug) => '/diseases/${slug}'` |

**Acceptance criteria:**
- [ ] Backend trả 200 với data, 404 với slug không tồn tại
- [ ] FE `generateMetadata` từ API
- [ ] Postman collection updated
- [ ] Test case: tạo 1 disease seed trong DB, mở `/benh-thuong-gap/<slug>` thấy data

**Rủi ro:**
- Nếu schema DB chưa có bảng `disease_info`, cần seed + migration Flyway trước.

---

### T08 — Tạo `ingredientService` + đổi mock `INGREDIENTS` (Sprint 2, S, FE only)

**Mục tiêu:** Trang `/tra-cuu-duoc-chat/[slug]` đang dùng mock `INGREDIENTS`. Backend có endpoint `/shop/lookup/ingredient?q=` (list, không có detail).

**Files thay đổi:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/features/shop/services/shopService.ts` (hoặc tạo `ingredientService.ts` mới) | Thêm `lookupIngredient(q, page, size)` gọi `/shop/lookup/ingredient?q=` |
| `pcms-frontend/src/lib/api/endpoints.ts` | Đã có `SHOP_LOOKUP_INGREDIENT = '/shop/lookup/ingredient'` |
| `pcms-frontend/src/app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx` | Đổi sang gọi service với `q={slug}` |

**Acceptance criteria:**
- [ ] Trang detail Ingredient hiển thị kết quả từ backend (tìm ingredient có slug = param)
- [ ] Fallback nếu backend rỗng: hiển thị "Không tìm thấy" + 404

**Rủi ro:**
- Backend trả `List<MedicineResponse>` chứ không phải Ingredient entity. Có thể FE phải map best-effort.
- Nếu backend chưa seed dữ liệu Ingredient, có thể trang trống — acceptable cho demo.

---

### T09 — Tạo `herbService` tương tự (Sprint 2, S, FE only)

**Mục tiêu:** Tương tự T08 cho herbs — dùng `/shop/lookup/herb?q=`.

**Files thay đổi:** giống T08, đổi `lookupHerb`.

**Acceptance criteria:**
- [ ] `/tra-cuu-duoc-lieu/[slug]` load từ backend
- [ ] Nếu ingredient lookup T08 đã chạy tốt → T09 làm trong 15 phút

**Rủi ro:** Không.

---

### T10 — `/rx/cross-sell` + `/rx/drug-check` (Sprint 3, M, FE + BE)

**Mục tiêu:** 2 endpoint trong `endpoints.ts` không có backend. Decision: bỏ hay thêm?

**Option A (khuyến nghị):** Backend bổ sung stub — vì `pharmacist-workbench-service` (`rx/consultations/...`) thường cần 2 endpoint này cho AI cross-sell/drug interaction.

**Backend stub cần:**
| File | Endpoint | Method | Response |
|---|---|---|---|
| `pcms/ai-engine-service/app/api/v1/cross_sell.py` | `/api/v1/rx/cross-sell` | POST | `{ "suggestions": [...] }` |
| `pcms/ai-engine-service/app/api/v1/drug_check.py` | `/api/v1/rx/drug-check` | POST | `{ "interactions": [], "safe": true }` |

**Đăng ký route trong `api-gateway` yml:**
```yaml
- id: ai-engine-rx
  uri: lb://ai-engine-service
  predicates:
    - Path=/api/v1/rx/cross-sell,/api/v1/rx/drug-check
  filters:
    - StripPrefix=2
```

**FE:**
| File | Thay đổi |
|---|---|
| `pcms-frontend/src/features/rx-console/services/rxConsoleService.ts` | Implement `crossSell(medicines)` + `drugCheck(medicines)` |

**Acceptance criteria:**
- [ ] Gateway route config mới (added to api-gateway.yml)
- [ ] ai-engine-service Python có 2 file mới (POST endpoints với mock response)
- [ ] FE gọi được từ dashboard RX console

**Rủi ro:**
- ai-engine-service Python (FastAPI) — chưa biết structure. Có thể cần điều chỉnh nhiều hơn dự kiến. Nếu quá phức tạp → chuyển Option B:

**Option B (fallback):** Xóa 2 const trong `endpoints.ts` + xóa import ở component gọi nó (nếu có). 5 phút.

---

### T11 — `/reviews` page (Sprint 3, M, FE + BE)

**Mục tiêu:** Trang reviews đang dùng mock PRODUCTS. Cần endpoint liệt kê review của current user + reviews của 1 sản phẩm.

**Backend mới cần thêm:**

| Endpoint | Method | Service | Mục đích |
|---|---|---|---|
| `/api/v1/reviews/me` | GET | `customer-portal-service` (hoặc service mới `review-service`) | Lấy review do current customer viết |
| `/api/v1/medicines/{id}/reviews` | GET | `customer-portal-service` | Lấy review của 1 sản phẩm |
| `/api/v1/reviews` | POST | `customer-portal-service` | Tạo review mới |

Nếu service mới thì **out-of-scope** với plan này — fallback: thêm vào `customer-portal-service`.

**Files thay đổi:**

| File | Thay đổi |
|---|---|
| `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/controller/ReviewsController.java` (mới) | 3 endpoints trên |
| `pcms/customer-portal-service/...` (service + repo + entity) | Database `review` (id, customerId, medicineId, rating, comment, createdAt) |
| `pcms/postman/PCMS.postman_collection.json` | 3 endpoint mới |
| `pcms-frontend/src/features/reviews/services/reviewService.ts` (mới) | `getMyReviews()`, `getByMedicine(id)`, `create()` |
| `pcms-frontend/src/lib/api/endpoints.ts` | Thêm 3 const |
| `pcms-frontend/src/app/(customer)/reviews/page.tsx` | Đổi sang `reviewService.getMyReviews()` |
| `pcms-frontend/src/app/(customer)/reviews/new/[productSlug]/page.tsx` | Form `reviewService.create()` |

**Acceptance criteria:**
- [ ] Migration Flyway tạo bảng `review`
- [ ] 3 endpoints trả 200 + 401 nếu thiếu X-User-Id
- [ ] FE render danh sách review thật, form POST thành công

**Rủi ro:**
- Tạo 1 entity review mới = cần schema DB. Nếu dự án không dùng Flyway/Liquibase, cần SQL `CREATE TABLE` thủ công trong `scripts/init-databases.sql`.

---

### T12 — Cleanup mock dead-code + types chuyển (Sprint 4, S, FE only)

**Mục tiêu:** Xóa 6 mock không ai import, chuyển types sang shared.

**Files thay đổi:**

| File | Thay đổi |
|---|---|
| `pcms-frontend/src/data/shop/videos.ts` | Xóa (backend `/admin/videos` đã có service) |
| `pcms-frontend/src/data/shop/vaccines.ts` | Xóa (vaccineService.ts đã có) |
| `pcms-frontend/src/data/shop/stores.ts` | Xóa (storeService.ts đã có) |
| `pcms-frontend/src/data/shop/cancer.ts` | Xóa (nội dung tĩnh chuyển sang `src/data/policies.tsx` hoặc giữ nguyên trong page) |
| `pcms-frontend/src/data/shop/health-quizzes.ts` | Xóa (healthToolsService đã có) |
| `pcms-frontend/src/data/shop/quiz-questions.ts` | Xóa (subset của quizzes) |
| `pcms-frontend/src/data/shop/articles.ts` | Xóa SAU khi T01 đã verify live `/health-articles` thành công |
| `pcms-frontend/src/data/shop/orders.ts` | **GIỮ** types `OrderStatus`, `OrderTimelineEntry`. Extract types riêng sang `src/types/order.ts` để dùng nơi khác |
| `pcms-frontend/src/components/shop/OrderTimeline.tsx` | Import `OrderStatus` từ `@/types/order` thay vì `@/data/shop/orders` |

**Acceptance criteria:**
- [ ] `npm run build` xanh (không còn import từ file đã xóa)
- [ ] Search `grep -r "@/data/shop" src/` còn lại 2-3 import hợp lệ (chỉ `catalog.ts` + `orders.ts` types + `policies.tsx`)
- [ ] `OrderTimeline` vẫn render đúng

**Rủi ro:**
- Nếu có PR khác đang import `data/shop/videos.ts` etc. → conflict. Check git blame trước khi xóa.

---

## 3. Acceptance cho toàn plan

Sau khi tất cả 12 task xong:

1. **API_INTEGRATION_REPORT regenerate:** chạy lại script reproduce — `Mismatch: 0` (tất cả 8 path trong §3 đã fix).
2. **MOCK_USAGE_REPORT regenerate:** chỉ còn `<data/shop/catalog.ts>` được dùng cho fallback PDP/PLP, không còn mock cho Home/Diseases/Ingredients/Herbs/Reviews.
3. **Build OK:** `npm run build` xanh.
4. **Postman E2E pass:**
   ```bash
   cd pcms/postman
   newman run PCMS.postman_collection.json -e PCMS.postman_environment.json
   ```
   Tất cả 12 endpoint mới (T07/T10/T11) trả 200.
5. **Smoke test screenshots:** 6 trang (Home / Disease detail / Ingredient detail / Herb detail / Reviews / Bài viết) hiển thị data từ DB thật.

## 4. Rủi ro tổng thể & giảm thiểu

| Rủi ro | Xác suất | Tác động | Giảm thiểu |
|---|---|---|---|
| Backend thiếu schema DB cho review/disease | Trung bình | T11/T07 chậm | Chạy SQL seed sẵn trong scripts/ |
| AI-engine-service Python cấu trúc khác | Cao | T10 chậm | Có Option B (xóa const) làm fallback |
| Mock backend trả 500 → FE render trắng | Trung bình | UX | Thêm try/catch fallback tạm thời sang mock cho từng service mới |
| Order khác đang dùng mock files | Thấp | Conflict | Grep trước khi xóa ở T12 |

## 5. Lịch thực thi (timeline estimate)

| Sprint | Days | Task đó |
|:-:|:-:|---|
| Sprint 0 | 1 | T01, T02, T03, T04 (song song) |
| Sprint 1 | 2 | T05, T06 (FE), T07 (FE + BE song song) |
| Sprint 2 | 1 | T08, T09 (pattern giống nhau) |
| Sprint 3 | 2 | T10, T11 (cần BE phối hợp) |
| Sprint 4 | 0.5 | T12 cleanup |
| **Tổng** | **6.5 ngày** | 12 task |

Nếu có 1 dev fulltime: **1 tuần**. Nếu cần review + QA: +2-3 ngày.

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: 12 task từ §3, §4 của API/MOCK report — đầy đủ | ✓ |
| Đúng: mỗi task có file list cụ thể, acceptance rõ | ✓ |
| Không thừa: KHÔNG code, KHÔNG sửa | ✓ (plan only) |
| Giả định: T10/T11 dùng Option A (thêm BE nhỏ) — nếu bạn muốn skip thì dùng Option B xóa const FE | ✓ |
| Phụ thuộc: dependency graph rõ, sprint order OK | ✓ |
