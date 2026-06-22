# PCMS Frontend ↔ Backend Integration — Phase 1 Complete

**Last updated:** 2026-06-22

## Tổng quan

Phase 1 (B2B Dashboard - List Pages) đã hoàn thành. Frontend chạy độc lập với mock BFF layer, không cần backend Java thật.

## Trạng thái

| Item | Count | Status |
|---|---|---|
| Mock services (seed data) | 13 | ✅ |
| BFF route handlers | 30+ | ✅ |
| Frontend list pages hoạt động | 13/13 | ✅ |
| Type-check | 6 errors | ⚠️ Phase 2 only |
| Login flow | OK | ✅ admin/admin123 |
| Home dashboard | OK | ✅ 6 stat cards |

## Pages đã tích hợp (13 list + 1 home)

### B2B Staff Dashboard
1. `/home` — Dashboard với 6 stats + recent orders + low stock
2. `/users` — Quản lý người dùng (20 seed users, 5 roles)
3. `/medicines` — Quản lý thuốc (30 seed, ACTIVE/INACTIVE/DISCONTINUED)
4. `/customers` — Quản lý khách hàng (15 seed, 4 loyalty tiers)
5. `/branches` — Chi nhánh (5 seed: HCM/HN/ĐN/CT/HN2)
6. `/categories` — Danh mục thuốc (10 seed)
7. `/suppliers` — Nhà cung cấp (12 seed)
8. `/inventory` — Tồn kho theo lô (25 seed batches)
9. `/orders` — Đơn hàng (20 seed, 4 statuses)
10. `/payments` — Thanh toán (auto từ PAID orders)
11. `/prescriptions` — Đơn thuốc (12 seed, DRAFT/SIGNED/CANCELLED)
12. `/notifications` — Thông báo (15 seed, 4 channels)
13. `/reports` — Báo cáo (10 seed + revenue aggregator)
14. `/search` — Tìm kiếm toàn hệ thống (4 entity types)

## Cách chạy

### Bước 1: Start frontend

```bash
cd pcms-frontend
npm install  # nếu chưa
npm run dev
```

Server sẽ chạy ở `http://localhost:3000`.

### Bước 2: Login

Mở browser, vào `http://localhost:3000/login`, đăng nhập:

| Email | Password | Role |
|---|---|---|
| `admin@pcms.vn` | `admin123` | ADMIN |
| `ceo@pcms.vn` | `admin123` | CEO |
| `manager.hcm@pcms.vn` | `admin123` | BRANCH_MANAGER |
| `pharmacist01@pcms.vn` | `pharma123` | PHARMACIST |
| `vip.customer@gmail.com` | `pharma123` | CUSTOMER |

### Bước 3: Verify

Click qua 13 list pages. Tất cả phải hiển thị data (mock). Browser DevTools Network tab:
- Requests đi tới `/api/v1/*` (same-origin Next.js route handler)
- Status 200 OK
- Response shape khớp với backend Java khi chuyển đổi

### Bước 4: Smoke test (optional)

```bash
./scripts/smoke-test-phase1.sh
```

Test 8 scenarios: login, auth/me, list 11 endpoints, search, revenue, low-stock, create/update/delete user.

## Tích hợp backend thật (khi sẵn sàng)

Để chuyển từ mock sang backend Java thật:

1. **Build backend** (cần Maven + Java 17 + MySQL):
   ```bash
   cd pcms
   mvn clean install -DskipTests
   ```

2. **Start services**:
   ```bash
   docker-compose up -d
   # Hoặc local: ./scripts/run-local-no-docker.sh
   ```

3. **Apply seed**:
   ```bash
   mysql -u pcms_user -ppcms_pass pcms_user < scripts/seed-admin-user.sql
   ```

4. **Tắt mock trong frontend**:
   ```bash
   # pcms-frontend/.env.local
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

5. **Restart frontend**: `npm run dev`

Mock layer sẽ tự bỏ qua (vì `USE_MOCK_API=false`), axios sẽ gọi thẳng gateway.

## Cấu trúc

```
pcms-frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # 13 list pages
│   │   │   ├── home/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── medicines/page.tsx
│   │   │   ├── ... (10 more)
│   │   └── api/v1/                # BFF mock layer (30+ routes)
│   │       ├── auth/{login,me,refresh}/route.ts
│   │       ├── users/{,[id]}/route.ts
│   │       ├── ... (10 services)
│   │       └── search/{,medicines}/route.ts
│   ├── features/                  # Service modules + components
│   │   ├── auth/
│   │   ├── users/
│   │   ├── ... (12 services)
│   │   └── search/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # axios + mock-aware baseURL
│   │   │   └── endpoints.ts       # 50+ endpoint paths
│   │   ├── auth/
│   │   ├── config/
│   │   │   └── mock.ts            # USE_MOCK_API flag
│   │   └── mock/                  # Mock BFF infrastructure
│   │       ├── jwt.ts             # HS256 sign/verify
│   │       ├── handlers.ts        # paginate, filterBy, requireAuth
│   │       ├── store.ts           # in-memory singleton (globalThis)
│   │       └── data/              # 13 seed files
│   ├── components/
│   │   ├── shared/ListPage.tsx    # generic list component
│   │   └── ui/                    # 18 UI primitives
│   └── types/                     # TypeScript types (FE contract)
└── scripts/
    └── smoke-test-phase1.sh       # End-to-end test
```

## Phase 1 - Files Changed (tổng kết)

| Loại | Count |
|---|---|
| Commits | ~18 |
| Mock data files (lib/mock/data/) | 13 |
| BFF route handlers (app/api/v1/) | 30+ |
| Pages hoàn thiện (app/(dashboard)/) | 13 |
| Type files updated | 4 (auth, customer, common, order) |
| Service modules | 14 |

## Known Issues / Limitations

1. **Mock data mất khi restart dev server**: In-memory store dùng `globalThis` để survive hot-reload, nhưng restart hoàn toàn sẽ reset về seed. Đây là design choice — Phase 2 sẽ thêm persistence qua file/DB.

2. **6 type errors còn lại** thuộc Phase 2 (inventory detail pages): `import`, `export`, `transfer` detail pages reference components chưa được export. Sẽ fix ở Phase 2.

3. **Token không thật sự verify signature**: Mock JWT chỉ dùng HS256 + shared secret. Khi đổi sang backend Java thật, backend sẽ verify signature với cùng secret (`pcms-jwt-secret-key-...`).

4. **Pagination từ BE khác từ FE**: FE dùng `page=0` + `size=20`, BE thật cũng dùng cùng pattern. Nếu BE dùng 1-based, cần update `handlers.ts`.

5. **Không có error retry/circuit breaker**: Khi backend down, FE chỉ show error toast. Production cần retry + fallback.

## Phase 2 (sẽ làm tiếp)

- 12 B2B detail/CRUD pages (orders/[id], payments/[id], invoices/[id], customers/[id]/history, inventory/import|export|transfer, orders/new, notifications/compose, rx-console 5 sub, categories detail)
- Fix 6 type errors Phase 1
- Setup backend Java thật (cài Maven + MySQL) hoặc tiếp tục với mock

## Liên hệ / Plan

Plan đầy đủ: `C:\Users\ADMIN\Downloads\temp_v12\.hermes\plans\2026-06-22_113000-pcms-full-integration-5phase.md`
