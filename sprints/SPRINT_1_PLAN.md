# Sprint 1 — Shop Home + Disease Detail (FE + BE)

> Sprint này: 3 task liên quan đến trang chủ B2C Shop và trang disease detail.
> Bao gồm: Server Component migration (chuyển sang SSR Next.js), 1 endpoint backend mới.

## Mục tiêu Sprint 1

- ✅ Shop Home B2C load dữ liệu thật từ backend (không còn mock `getBestsellers` + `CATEGORIES`)
- ✅ Disease detail page (`/benh-thuong-gap/[slug]`) backend có endpoint mới + FE đổi sang service
- ✅ Cache hợp lý với Next.js revalidate

## Tasks

| # | Task | Loại | Effort |
|:--:|---|---|:-:|
| T05 | `ShopHomeBestseller` dùng `shopService.getHomePage()` | FE Server Component migration | M (30 ph) |
| T06 | `ShopHomeCategories` dùng `categoryService.list()` | FE Server Component migration | M (30 ph) |
| T07 | `/benh-thuong-gap/[slug]` — backend mới + FE service | FE + BE | M (60 ph) |

**Tổng:** ~2 ngày dev.

---

## T05 — ShopHomeBestseller: mock → API

### Mục tiêu
Thay thế `getBestsellers(n)` mock bằng `shopService.getHomePage()` (data từ `/shop/home`).

### Files thay đổi (2-3 file)

| # | File | Hành động |
|---|---|---|
| 1 | `pcms-frontend/src/components/shop/ShopHomeBestseller.tsx` | Convert từ Client sang Server Component. Loại bỏ `useState/useEffect` nếu có. Import `shopService` từ `@/features/shop`. |
| 2 | `pcms-frontend/src/features/shop/services/shopService.ts` | Đảm bảo có `getHomePage()` (trỏ vào `API_ENDPOINTS.SHOP_HOME = '/shop/home'`) |
| 3 | `pcms-frontend/src/app/(customer)/page.tsx` | Import `ShopHomeBestseller` (server) và render |

### Acceptance criteria
- [ ] Component là **Server Component** (không có `'use client'`)
- [ ] `await shopService.getHomePage()` trả về object chứa `bestSellers` array
- [ ] Render đúng 5 bestsellers từ DB
- [ ] Build OK + trang `/` (home) load dưới 2s với cache

### Code snippet

`ShopHomeBestseller.tsx` (sau khi refactor):
```typescript
// Server Component — Next.js App Router
import { shopService } from '@/features/shop';
import { ProductCard } from '@/components/shop/ProductCard';

export async function ShopHomeBestseller() {
  const home = await shopService.getHomePage().catch(() => null);
  const bestsellers = home?.bestSellers ?? [];

  if (bestsellers.length === 0) return null;

  // ... render UI giống cũ, lấy data từ bestsellers
}
```

`shopService.ts` (extension):
```typescript
export async function getHomePage() {
  const res = await apiClient.get<HomePageResponse>('/shop/home');
  return res.data;
}

interface HomePageResponse {
  bestSellers: ProductSummary[];
  heroBanners: any[];
  categories: CategorySummary[];
  // theo HomePageResponse DTO
}
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | Backend `/shop/home` hiện đang trả về data tĩnh (giả lập seed). Cần verify trước khi chuyển FE. | Test API trực tiếp với Postman. |
| 🟢 Thấp | `try-catch` fallback: nếu API lỗi → dùng mock cũ (giữ import `getBestsellers` làm fallback tạm). | Có sẵn trong code snippet trên. |

---

## T06 — ShopHomeCategories: mock → API

### Mục tiêu
Thay thế `CATEGORIES` hard-coded mock bằng `categoryService.list()` từ `/categories`.

### Files thay đổi (2 file)

| # | File | Hành động |
|---|---|---|
| 1 | `pcms-frontend/src/components/shop/ShopHomeCategories.tsx` | Server Component, gọi `categoryService.list({page:0, size:6})`, lấy 6 danh mục đầu. Giữ nguyên logic render (icon + theme + children). |
| 2 | `pcms-frontend/src/features/categories/services/categoryService.ts` | Đảm bảo `list()` đã có — xác nhận chưa cần đổi. |

### Acceptance criteria
- [ ] Server Component render từ API
- [ ] Cache `revalidate: 300` (5 phút) — không gọi API mỗi request
- [ ] Icons mapping giữ nguyên (`THEMES` constants ở FE, đổi data source)
- [ ] Nếu API trả category không có icon → fallback `Icons.Pill` như code cũ

### Code snippet

```typescript
// ShopHomeCategories.tsx
import { categoryService } from '@/features/categories';
import { CATEGORIES as FALLBACK } from '@/data/shop/catalog';  // giữ tạm làm fallback

export const revalidate = 300;  // 5 phút cache

export async function ShopHomeCategories() {
  let cats: Category[] = FALLBACK;
  try {
    const res = await categoryService.list({ page: 0, size: 6 });
    if (res.data?.length) cats = res.data;
  } catch {
    // fallback về mock
  }

  return (
    <section>
      {cats.map((cat) => {
        const Icon = getIcon(cat.icon);
        // ... render phần còn lại giống cũ
      })}
    </section>
  );
}
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟢 Thấp | Icon field trong backend `CategoryResponse` có thể không có `icon` (lucide-name) hoặc `theme`. | Map data: nếu thiếu icon/theme → FE default; nếu không đủ 6 danh mục → fallback mock. |

---

## T07 — Disease detail page (FE + BE)

### Mục tiêu
Trang `/benh-thuong-gap/[slug]` đang dùng mock `DISEASES`. Đổi sang service có backend.

### Backend — thêm 1 endpoint

**File 1:** `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/controller/HealthContentController.java`

Thêm method mới:
```java
@GetMapping("/diseases/{slug}")
public ResponseEntity<DiseaseInfoResponse> getDiseaseBySlug(@PathVariable String slug) {
    return ResponseEntity.ok(healthContentService.getDiseaseBySlug(slug));
}
```

Lưu ý: file hiện đã có `@GetMapping("/diseases")` (list), thêm route mới ngay dưới.

**File 2:** `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/service/HealthContentService.java`

Thêm method mới:
```java
public DiseaseInfoResponse getDiseaseBySlug(String slug) {
    return diseaseRepository.findBySlug(slug)
        .map(mapper::toDto)
        .orElseThrow(() -> new ResourceNotFoundException("Disease", slug));
}
```

**File 3:** `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/repository/DiseaseRepository.java` (nếu chưa có)

```java
Optional<DiseaseInfo> findBySlug(String slug);
```

**File 4:** Schema — nếu bảng `disease_info` chưa có trong DB

- Tạo migration Flyway `V*.sql` trong `customer-portal-service/src/main/resources/db/migration/`:
```sql
CREATE TABLE disease_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    content_html TEXT,
    audience VARCHAR(50),
    season VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO disease_info (slug, name, summary, audience, season) VALUES
  ('cum-mua', 'Cảm mùa', 'Triệu chứng cảm cúm thường gặp...', 'ADULT', 'WINTER'),
  ('dau-da-day', 'Đau dạ dày', 'Các nguyên nhân và cách xử trí...', 'ADULT', 'ALL'),
  ('viem-xoang', 'Viêm xoang', 'Phân biệt viêm xoang cấp và mạn...', 'ALL', 'SPRING');
```

- Nếu không có Flyway → thêm SQL file này vào `pcms/scripts/init-databases.sql`.

**File 5:** `pcms/postman/PCMS.postman_collection.json`

Thêm 1 endpoint mới vào folder `13 - customer-portal-service`:
```
"Diseases - Get by slug", GET, /diseases/{slug}
```
(đặt slug sample = `cum-mua`)

### Frontend — đổi sang service

**File 1:** `pcms-frontend/src/lib/api/endpoints.ts`

```typescript
DISEASE_DETAIL: (slug: string) => `/diseases/${slug}`,
```

**File 2:** `pcms-frontend/src/features/health-tools/services/healthToolsService.ts` hoặc tạo `diseaseService.ts` mới

```typescript
export async function getDiseaseBySlug(slug: string): Promise<DiseaseInfoResponse> {
  const res = await apiClient.get<DiseaseInfoResponse>(API_ENDPOINTS.DISEASE_DETAIL(slug));
  return res.data;
}
```

**File 3:** `pcms-frontend/src/app/(customer)/benh-thuong-gap/[slug]/page.tsx`

Thay thế:
- Bỏ `import { DISEASES } from '@/data/shop/diseases'`
- `generateStaticParams` → fetch list từ service thật (hoặc giữ build-time empty)
- Default page → `await getDiseaseBySlug(slug)`, throw `notFound()` nếu lỗi
- Dùng `DiseaseInfoResponse` shape thật

### Acceptance criteria

**Backend:**
- [ ] `GET /api/v1/diseases/cum-mua` trả 200 với JSON đúng
- [ ] `GET /api/v1/diseases/not-exist` trả 404
- [ ] DB schema migration tạo bảng + insert 3 sample rows

**Frontend:**
- [ ] Trang `/benh-thuong-gap/cum-mua` load thành công
- [ ] Trang `/benh-thuong-gap/xyz-404` hiển thị `notFound()` 404
- [ ] `generateMetadata` dùng data API
- [ ] Build OK

**Postman:**
- [ ] 1 endpoint mới trong collection
- [ ] Sample test: POST + happy path + 404

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | DB chưa có `disease_info` → migration cần thêm. | Viết SQL + chạy script `init-databases.sql`. |
| 🟢 Thấp | Frontend `generateStaticParams` cần data tại build time. Nếu không fetch → dùng sample slugs hard-coded. | Acceptable: dynamic page không cần static. |
| 🟢 Thấp | DiseaseRepository.findBySlug chưa tồn tại. | Verify sẵn file repository hiện tại. |

---

## Verification — Sprint 1

### Smoke test E2E

| Trang | Đường dẫn | API call | Expected |
|---|---|---|---|
| Shop Home | `/` | `GET /shop/home` | 200 + bestSellers |
| Category L1 | `/thuoc` | `GET /categories` | 200 |
| Disease detail | `/benh-thuong-gap/cum-mua` | `GET /diseases/cum-mua` | 200 |
| Disease 404 | `/benh-thuong-gap/asd-asd` | `GET /diseases/asd-asd` | 404 |

### Postman collection update

```bash
# Sau khi T07 xong, chạy:
newman run pcms/postman/PCMS.postman_collection.json \
  -e pcms/postman/PCMS.postman_environment.json \
  --folder "13 - customer-portal-service" \
  --reporters cli
```

**Expected:** 1 test mới (Diseases - Get by slug) pass.

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: 3 task T05-T07 | ✓ |
| Đúng: T05-T06 server component, T07 BE + FE | ✓ |
| Không thừa: chỉ tích hợp 6 màn hình còn mock, không thêm feature | ✓ |
| Giả định: backend `/shop/home` + `/categories` đã có data (cần verify) | ✓ |
