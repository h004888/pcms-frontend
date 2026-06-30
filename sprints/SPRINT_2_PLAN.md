# Sprint 2 — Ingredient + Herb Services (FE)

> Sprint ngắn: 2 task giống nhau — tạo service cho ingredient và herb lookup, thay mock trong 2 trang chi tiết.

## Mục tiêu Sprint 2

- ✅ Tạo `ingredientService` cho `/tra-cuu-duoc-chat/[slug]` (thay mock `INGREDIENTS`)
- ✅ Tạo `herbService` cho `/tra-cuu-duoc-lieu/[slug]` (thay mock `HERBS`)
- ✅ Dùng cùng pattern cho cả 2

## Tasks

| # | Task | Loại | Effort |
|:--:|---|---|:-:|
| T08 | Tạo `ingredientService` + đổi `/tra-cuu-duoc-chat/[slug]` | FE | S (20 ph) |
| T09 | Tạo `herbService` + đổi `/tra-cuu-duoc-lieu/[slug]` | FE | S (20 ph) |

**Tổng:** ~1 ngày dev (2 task giống pattern, làm nhanh).

---

## Pattern chung

Cả 2 task làm theo cùng 1 pattern:

```
1. Tạo service file mới trong src/features/<name>/services/
2. Implement hàm lookup(slug) gọi endpoint backend thật
3. Trong page.tsx: bỏ mock import → dùng service async
4. generateStaticParams: optional, có thể dùng fetch list từ service
5. generateMetadata: dùng service
6. Add endpoint constant trong lib/api/endpoints.ts
```

---

## T08 — Ingredient service

### Mục tiêu
Thay mock `INGREDIENTS` trong `/tra-cuu-duoc-chat/[slug]` bằng service gọi backend.

### Files thay đổi (4 file)

| # | File | Hành động |
|---|---|---|
| 1 | `pcms-frontend/src/features/ingredients/services/ingredientService.ts` | Tạo mới file service |
| 2 | `pcms-frontend/src/lib/api/endpoints.ts` | Thêm constants (đã có `SHOP_LOOKUP_INGREDIENT`, bổ sung `INGREDIENT_DETAIL` nếu cần) |
| 3 | `pcms-frontend/src/features/ingredients/index.ts` | Export barrel |
| 4 | `pcms-frontend/src/app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx` | Refactor sang dùng service |

### Acceptance criteria
- [ ] `ingredientService.lookup(slug)` gọi `GET /shop/lookup/ingredient?q=<slug>` hoặc detail endpoint
- [ ] Trang render data từ DB (hoặc 404 nếu không tìm)
- [ ] Mock `data/shop/ingredients.ts` KHÔNG xóa ngay (T12 sẽ cleanup ở Sprint 4)

### Code snippet

**ingredientService.ts:**
```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface Ingredient {
  id: string;
  slug: string;
  name: string;
  description?: string;
  benefits?: string[];
  sideEffects?: string[];
}

export async function searchIngredients(q: string, page = 0, size = 20) {
  const res = await apiClient.get<{ data: Ingredient[] }>(
    `${API_ENDPOINTS.SHOP_LOOKUP_INGREDIENT}?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
  );
  return res.data;
}

export async function getIngredientBySlug(slug: string): Promise<Ingredient> {
  // Backend chỉ có search-by-q, không có detail-by-slug trực tiếp.
  // Workaround: search theo slug = chính nó, lấy phần tử đầu.
  const { data } = await searchIngredients(slug, 0, 1);
  if (!data?.length) throw new Error('NOT_FOUND');
  return data[0];
}
```

**page.tsx (refactor một phần):**
```typescript
// Bỏ: import { getIngredientBySlug, INGREDIENTS } from '@/data/shop/ingredients';
// Bỏ: import { PRODUCTS } from '@/data/shop/catalog';

import { getIngredientBySlug } from '@/features/ingredients';

export async function generateMetadata({ params }) {
  try {
    const ing = await getIngredientBySlug(params.slug);
    return { title: `${ing.name} — Tra cứu dược chất`, description: ing.description };
  } catch {
    return { title: 'Không tìm thấy' };
  }
}

export default async function TraCuuDuocChatPage({ params }) {
  let ingredient;
  try {
    ingredient = await getIngredientBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1>{ingredient.name}</h1>
      {/* render UI phần còn lại — lấy data từ ingredient */}
    </div>
  );
}
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | Backend chỉ có search theo `q`, không có endpoint `GET /diseases/{slug}` tương ứng. Workaround: search slug chính nó. Nếu backend không seed ingredient data → trang 404 hết. | Backend cần seed 5-10 ingredient records từ SKU của medicines hiện có. |
| 🟢 Thấp | `PRODUCTS` mock ở trang đang dùng cho hiển thị "Sản phẩm chứa {ingredient}". Khi đổi sang service có thể mất list này. | Giữ fallback PRODUCTS mock cho phần liên kết. Hoặc thêm endpoint `/medicines?ingredientId=` sau. |

---

## T09 — Herb service

### Mục tiêu
Thay mock `HERBS` trong `/tra-cuu-duoc-lieu/[slug]` bằng service.

### Files thay đổi (4 file)

| # | File | Hành động |
|---|---|---|
| 1 | `pcms-frontend/src/features/herbs/services/herbService.ts` | Tạo mới file service |
| 2 | `pcms-frontend/src/lib/api/endpoints.ts` | Đã có `SHOP_LOOKUP_HERB` (không cần thêm nếu dùng chung) |
| 3 | `pcms-frontend/src/features/herbs/index.ts` | Export barrel |
| 4 | `pcms-frontend/src/app/(customer)/tra-cuu-duoc-lieu/[slug]/page.tsx` | Refactor dùng service |

### Acceptance criteria
- [ ] `herbService.lookup(slug)` gọi `/shop/lookup/herb?q=<slug>`
- [ ] Trang render từ API
- [ ] Sử dụng cùng pattern T08 — copy & adapt

### Code snippet

**herbService.ts:** (Tương tự T08)
```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface Herb {
  id: string;
  slug: string;
  name: string;
  description?: string;
  traditionalUses?: string[];
}

export async function searchHerbs(q: string, page = 0, size = 20) {
  const res = await apiClient.get<{ data: Herb[] }>(
    `${API_ENDPOINTS.SHOP_LOOKUP_HERB}?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
  );
  return res.data;
}

export async function getHerbBySlug(slug: string): Promise<Herb> {
  const { data } = await searchHerbs(slug, 0, 1);
  if (!data?.length) throw new Error('NOT_FOUND');
  return data[0];
}
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟢 Thấp | Giống T08 nhưng có thể backend chưa seed. Acceptable tạm thời. | Document trong README sau. |

---

## Verification — Sprint 2

### Smoke test

| Trang | Endpoint | Expected |
|---|---|---|
| `/tra-cuu-duoc-chat/<slug>` | `GET /shop/lookup/ingredient?q=<slug>` | 200 hoặc 404 |
| `/tra-cuu-duoc-lieu/<slug>` | `GET /shop/lookup/herb?q=<slug>` | 200 hoặc 404 |

### Build check
```bash
cd pcms-frontend && npm run build
```
**Expected:** Không TypeScript error.

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: 2 task T08/T09 đầy đủ acceptance + code snippet | ✓ |
| Đúng: pattern thống nhất giữa 2 task, không tự diễn giải thêm | ✓ |
| Không thừa: không thay đổi backend, không cleanup mock (Sprint 4 mới xóa) | ✓ |
| Giả định: fallback để PRODUCTS mock cho phần "Sản phẩm chứa" — sẽ hỏi nếu conflict | ✓ |
