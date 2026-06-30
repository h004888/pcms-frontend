# Sprint 4 — Cleanup Mock Dead-Code & Types Reorganization

> Sprint cuối. Chỉ dọn dẹp — không thêm feature mới, không đổi logic.

## Mục tiêu Sprint 4

- ✅ Xóa 6 mock files không ai import
- ✅ Trích types từ mock `orders.ts` sang `src/types/order.ts`
- ✅ Build pass, không import nào bị broken
- ✅ MOCK_USAGE_REPORT regenerate — chỉ còn 2-3 mock còn dùng (fallback cho catalog/policies)

## Task duy nhất: T12 — Cleanup

### Phạm vi xóa

| File mock | Lý do xóa | Sau khi Sprint 1-3 xong |
|---|---|---|
| `pcms-frontend/src/data/shop/videos.ts` | Service `videoService`/admin route đã có | Xóa OK |
| `pcms-frontend/src/data/shop/vaccines.ts` | `vaccineService` đã cover | Xóa OK |
| `pcms-frontend/src/data/shop/stores.ts` | `storeService` đã cover | Xóa OK |
| `pcms-frontend/src/data/shop/cancer.ts` | Nội dung tĩnh — chuyển sang `policies.tsx` hoặc inline | Xóa OK |
| `pcms-frontend/src/data/shop/health-quizzes.ts` | `healthToolsService` đã cover | Xóa OK |
| `pcms-frontend/src/data/shop/quiz-questions.ts` | Subset của quizzes — không cần | Xóa OK |
| `pcms-frontend/src/data/shop/articles.ts` | Sau T01 fix đã dùng `/health-articles` thật | Xóa OK |

### Phạm vi GIỮ

| File mock | Lý do giữ |
|---|---|
| `pcms-frontend/src/data/shop/catalog.ts` | `PRODUCTS` mock vẫn dùng cho PDP `/tra-cuu-duoc-chat/[slug]` (liệt kê sản phẩm chứa ingredient). Chỉ `getBestsellers` + `CATEGORIES` được remove sau T05/T06. |
| `pcms-frontend/src/data/shop/orders.ts` | CHỈ GIỮ types, xóa data nếu có. Extract `OrderStatus`, `OrderTimelineEntry` → `src/types/order.ts`. |
| `pcms-frontend/src/data/policies.tsx` | Nội dung tĩnh chính sách (không cần backend). |

### Files thay đổi (cleanup)

| # | File | Hành động |
|---|---|---|
| 1 | `pcms-frontend/src/data/shop/videos.ts` | **Xóa** |
| 2 | `pcms-frontend/src/data/shop/vaccines.ts` | **Xóa** |
| 3 | `pcms-frontend/src/data/shop/stores.ts` | **Xóa** |
| 4 | `pcms-frontend/src/data/shop/cancer.ts` | **Xóa** |
| 5 | `pcms-frontend/src/data/shop/health-quizzes.ts` | **Xóa** |
| 6 | `pcms-frontend/src/data/shop/quiz-questions.ts` | **Xóa** |
| 7 | `pcms-frontend/src/data/shop/articles.ts` | **Xóa** (verify T01 đã xong trước) |
| 8 | `pcms-frontend/src/types/order.ts` | **Tạo mới** chứa types từ `data/shop/orders.ts` |
| 9 | `pcms-frontend/src/data/shop/orders.ts` | Sau khi extract types → **Xóa** |
| 10 | `pcms-frontend/src/components/shop/OrderTimeline.tsx` | Đổi `import ... from '@/data/shop/orders'` → `from '@/types/order'` |
| 11 | `pcms-frontend/src/types/index.ts` | Export thêm `OrderStatus`, `OrderTimelineEntry` |

### Acceptance criteria

- [ ] `grep -r "@/data/shop" pcms-frontend/src/` chỉ còn import từ `catalog.ts` (1-2 chỗ còn dùng fallback) và KHÔNG còn import từ các file đã xóa
- [ ] `grep -r "@/data/shop/orders" pcms-frontend/src/` = 0 (đã chuyển sang `@/types/order`)
- [ ] `npm run build` thành công (TypeScript clean)
- [ ] `npm run lint` clean (nếu có ESLint config)
- [ ] Trang `/don-hang/[id]` vẫn render timeline đúng (visual regression check)
- [ ] Trang `/tra-cuu-duoc-chat/[slug]` vẫn hiển thị "Sản phẩm chứa ingredient" (dùng `data/shop/catalog.ts` mock)

### Pre-check trước khi xóa

```bash
# Trước mỗi file xóa, verify không ai import
grep -rln "@/data/shop/videos" pcms-frontend/src/
grep -rln "@/data/shop/vaccines" pcms-frontend/src/
grep -rln "@/data/shop/stores" pcms-frontend/src/
grep -rln "@/data/shop/cancer" pcms-frontend/src/
grep -rln "@/data/shop/health-quizzes" pcms-frontend/src/
grep -rln "@/data/shop/quiz-questions" pcms-frontend/src/
grep -rln "@/data/shop/articles" pcms-frontend/src/
grep -rln "@/data/shop/orders" pcms-frontend/src/
```

**Expected:** Tất cả trả 0 hoặc chỉ match file chính nó.

Nếu PHÁT HIỆN import ở file khác → dừng xóa, fix import trước.

### Steps thực thi

**Bước 1: Tạo types mới**
```bash
# 1. Đọc nội dung orders.ts để xem types
cat pcms-frontend/src/data/shop/orders.ts

# 2. Tạo file types/order.ts với nội dung types đã tách
```

**Bước 2: Migrate import**
```bash
# 1. Sửa OrderTimeline.tsx:
#    từ: import type { OrderStatus, OrderTimelineEntry } from '@/data/shop/orders';
#    sang: import type { OrderStatus, OrderTimelineEntry } from '@/types/order';
```

**Bước 3: Verify pre-check**
```bash
# Chạy 8 lệnh grep ở trên. Confirm 0 import ngoài file chính.
```

**Bước 4: Xóa**
```bash
cd pcms-frontend/src/data/shop/
rm videos.ts vaccines.ts stores.ts cancer.ts health-quizzes.ts quiz-questions.ts articles.ts orders.ts

# Verify catalog.ts vẫn còn (cho fallback PDP)
ls catalog.ts
```

**Bước 5: Build**
```bash
cd pcms-frontend && npm run build
```

### Rủi ro

| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | Có branch/PR khác đang dùng 1 trong các mock files này (PR song song). | `git log --all --diff-filter=D --summary -- pcms-frontend/src/data/shop/videos.ts 2>/dev/null` kiểm tra. |
| 🟢 Thấp | Mock `catalog.ts` vẫn được dùng cho fallback — verify chỉ có 1-2 import sites. | Acceptable. |

---

## Verification — Sprint 4

### Cú pháp kiểm tra cuối

```bash
# 1. Mock import sites còn lại — chỉ catalog.ts (fallback)
$ grep -rln "@/data/shop" pcms-frontend/src/
src/app/(customer)/tra-cuu-duoc-chat/[slug]/page.tsx      # dùng PRODUCTS
src/components/shop/ShopHomeBestseller.tsx               # fallback
src/components/shop/ShopHomeCategories.tsx              # fallback
src/app/(customer)/reviews/page.tsx                      # (sau T11 đã đổi)

# 2. Types/order được sử dụng
$ grep -rln "@/types/order" pcms-frontend/src/components/shop/OrderTimeline.tsx

# 3. Build OK
$ cd pcms-frontend && npm run build
# Expected: exit 0
```

### MOCK_USAGE_REPORT regenerate

```bash
# Chạy lại script reproduce trong file MOCK_USAGE_REPORT.md
# Expected:
# - Shop Home: dùng API (fallback @/data/shop/catalog — acceptable, dùng try/catch)
# - Disease detail: dùng API (fallback @/data/shop/diseases — có thể xóa cuối cùng nếu > 90% match)
# - Ingredient detail: dùng API
# - Herb detail: dùng API
# - Reviews: dùng API
# - Article: dùng API
```

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: 1 task T12 đầy đủ checklist + verify | ✓ |
| Đúng: chỉ cleanup, không thêm logic | ✓ |
| Không thừa: không xóa mock files đang được dùng làm fallback | ✓ |
| Giả định: `types/index.ts` đã tồn tại (nếu chưa → tạo trước khi sprint) | ✓ |
