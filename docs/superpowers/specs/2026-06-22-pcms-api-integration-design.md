# PCMS API Integration — Design Spec

| Field | Value |
|---|---|
| **Status** | Approved (pending user review of written spec) |
| **Date** | 2026-06-22 |
| **Author** | Claude (brainstorming) |
| **Scope** | 19 use cases / 246 endpoints / ~55 pages / 1 Next.js app |
| **Backend** | `pcms/` Spring Boot 4.0.7 + Spring Cloud 2025.1.2 (JDK 21, MySQL 8.0) |
| **Frontend** | `pcms-frontend/` Next.js 14.2.15 App Router + TypeScript 5.5 + Tailwind |

---

## 1. Context

`pcms` backend đã hoàn thiện 246+ API endpoints cho 19 use case (UC01→UC19), expose qua Spring Cloud Gateway tại `http://localhost:8080/api/v1/*`. Frontend `pcms-frontend` đã có skeleton (axios client, AuthContext, type definitions, route groups, 50+ page files) nhưng:

- `src/services/` **chưa tồn tại** — chỉ có axios wrapper mỏng ở `src/lib/api/`.
- Không có data-fetching layer (TanStack Query / SWR / custom hooks) — pages chưa gắn data thật.
- Auth dùng localStorage (rủi ro XSS), chưa có refresh-token flow tự động.
- Type definitions thủ công (`src/types/*.ts`) có nguy cơ drift so với backend Java records.
- 14 `features/*` folder còn là stub rỗng — UI chưa gắn API.

Spec này định nghĩa kiến trúc + workflow + bản đồ API↔page + phasing để đưa frontend từ "UI mockup" lên "gọi được backend thật end-to-end".

## 2. Goals

1. **Một service function = một use case nghiệp vụ**, không phải một endpoint thô.
2. **Một feature hook = điểm duy nhất** pages gọi tới — không gọi axios trực tiếp từ component.
3. **Auth an toàn** bằng httpOnly cookie + Route Handler proxy; refresh tự động.
4. **Types tự sinh** từ OpenAPI, không sửa tay trong `src/types/api-generated/`.
5. **Validation zod dùng chung** cho form, request payload, và response parsing.
6. **Có thể tắt backend vẫn dev được UI** (mock MSW) cho phần không critical.
7. **Mỗi phase ra 1 bản demo được**, không cần đợi 14 tuần.

## 3. Non-goals

- Không refactor backend (trừ việc thêm `springdoc-openapi-starter-webmvc-ui` nếu thiếu).
- Không tích hợp payment gateway thật (Stripe/MoMo/VNPay) — chỉ wrapper mock.
- Không làm i18n (chỉ tiếng Việt).
- Không viết E2E cho cả 19 use case (chỉ 1 smoke per phase).
- Không tích hợp Sentry/PostHog/DataDog (để phase sau).
- Không thiết kế design system mới — theo `DESIGN.md`/`PRODUCT.md` hiện có.

## 4. Architectural pillars (đã chốt qua brainstorming)

| Trụ cột | Quyết định | Lý do |
|---|---|---|
| Scope | 19 UC trong 1 spec, chia 5 phases | User chọn; chấp nhận spec dài để có blueprint duy nhất |
| Data fetching | **TanStack Query** + axios | Cache, retry, refetch, optimistic, devtools, hydration SSR |
| Types | **OpenAPI codegen** (`openapi-typescript`) | Loại bỏ drift; backend là source of truth |
| Auth | **httpOnly cookie** + **Next.js Route Handler proxy** | An toàn nhất; ẩn token khỏi JS; refresh tự động |
| Forms | **react-hook-form + zod shared schemas** | Đã có trong deps; schema dùng 3 nơi (form, request, response) |
| Phases | **Theo vai trò người dùng** | Mỗi phase có demo được; tránh P1 chỉ có auth |

## 5. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Next.js 14)                     │
│                                                              │
│  Pages (App Router) ─► Feature Hooks ─► Service Functions    │
│         │                     │                  │           │
│         │                     ▼                  ▼           │
│         │            TanStack Query       axios instance     │
│         │            (cache, retry,        (client.ts)       │
│         │             dedupe, etc)              │            │
│         │                                       │            │
│         ▼                                       ▼            │
│  Next.js Route Handler   ◄── fetch w/ httpOnly cookie        │
│  (/api/proxy/[...path])        (auth, csrf, logging)        │
└────────────────────┬────────────────────────────────────────┘
                     │  Cookie forwarded (httpOnly)
                     ▼
        ┌────────────────────────────────────┐
        │   API Gateway  localhost:8080       │
        │   /api/v1/*  (Spring Cloud Gateway)│
        └─────────┬──────────────────────────┘
                  │  Service discovery (Eureka)
                  ▼
   19 microservices: user, customer, branch, catalog, inventory,
   order, payment, prescription, notification, report, supplier,
   category, customer-portal, pharmacist-workbench, health-tools,
   ecom-ops, ai-engine (Python FastAPI), mobile-bff
```

**Nguyên tắc:**

1. **FE không gọi trực tiếp gateway** — tất cả đi qua `/api/proxy/[...path]`. Cookie httpOnly không đọc được từ client JS; proxy attach được + logging/audit tập trung.
2. **Service function = pure async function**, không React, không hook. Test với vitest + axios mock.
3. **Feature hook = wrapper TanStack Query** duy nhất mà pages gọi. Cho phép SSR prefetch, mutation invalidation, mock dễ.
4. **OpenAPI là source of truth.** Manual types chỉ cho FE-specific DTO (form state, derived).

## 6. Directory structure

```
pcms-frontend/src/
├── app/
│   ├── (auth)/                             # login, register, profile, addresses, etc.
│   ├── (customer)/                         # customer portal
│   ├── (dashboard)/                        # admin/pharmacist
│   ├── (shop)/                             # storefront
│   └── api/
│       └── proxy/[...path]/route.ts        # proxy duy nhất → gateway
│
├── lib/
│   ├── api/
│   │   ├── client.ts                       # base axios (server-only instance)
│   │   ├── endpoints.ts                    # path constants per service
│   │   ├── errors.ts                       # ApiError + normalizeError()
│   │   └── index.ts
│   ├── auth/
│   │   ├── auth.ts                         # login/logout/refresh (gọi proxy)
│   │   ├── auth-context.tsx                # context provider
│   │   ├── use-current-user.ts             # TanStack Query hook
│   │   └── index.ts
│   ├── query/
│   │   ├── provider.tsx                    # QueryClientProvider + defaults
│   │   ├── query-keys.ts                   # central key registry
│   │   └── index.ts
│   ├── config/
│   │   ├── env.ts                          # Zod-validated env
│   │   ├── menu.ts
│   │   └── index.ts
│   ├── shop/                               # cart-context, format (giữ nguyên)
│   └── utils/                              # constants, format, validation
│
├── services/                               # ★ MỚI — pure async functions
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── branch.service.ts
│   ├── catalog.service.ts
│   ├── inventory.service.ts
│   ├── order.service.ts
│   ├── payment.service.ts
│   ├── prescription.service.ts
│   ├── notification.service.ts
│   ├── report.service.ts
│   ├── supplier.service.ts
│   ├── category.service.ts
│   ├── customer.service.ts
│   ├── ai.service.ts
│   ├── health-tools.service.ts
│   └── ecom-ops.service.ts                 # + cart, voucher, workbench merged vào các service liên quan
│
├── features/                               # React hooks wrap services
│   ├── auth/                               # useLogin, useLogout, useCurrentUser
│   ├── medicines/                          # useMedicines, useMedicineDetail
│   ├── orders/                             # useOrders, useCreateOrder, useOrderDetail
│   ├── inventory/                          # useInventory, useLowStock, useImport
│   ├── prescriptions/                      # usePrescriptions, useCreateRx
│   ├── customers/                          # useCustomers, useCustomerDetail
│   ├── branches/                           # useBranches
│   ├── reports/                            # useSalesReport, useInventoryReport
│   ├── notifications/                      # useNotifications
│   ├── search/                             # useSemanticSearch
│   ├── users/                              # useUsers, useCreateUser
│   ├── suppliers/                          # useSuppliers
│   ├── home/                               # useHomeData
│   └── categories/                         # useCategories
│
├── hooks/                                  # cross-cutting hooks
│   ├── use-debounce.ts
│   ├── use-pagination.ts
│   ├── use-media-query.ts
│   └── use-pwa-install.ts
│
├── components/                             # giữ nguyên (UI, Layout, shared, shop)
│
├── types/
│   ├── api-generated/                      # ★ MỚI — OpenAPI output (auto)
│   │   ├── schema.d.ts
│   │   └── index.ts
│   ├── auth.ts                             # FE-specific DTO
│   ├── common.ts                           # PageResponse<T>, ApiError, User
│   ├── branch.ts
│   ├── customer.ts
│   ├── inventory.ts
│   ├── medicine.ts
│   ├── notification.ts
│   ├── order.ts
│   ├── prescription.ts
│   ├── supplier.ts
│   ├── user.ts
│   └── shop/catalog.ts
│
└── schemas/                                # ★ MỚI — shared zod schemas
    ├── auth.schema.ts                      # loginSchema, registerSchema, refreshSchema
    ├── user.schema.ts
    ├── order.schema.ts
    ├── prescription.schema.ts
    ├── medicine.schema.ts
    └── index.ts
```

## 7. Data flow

### 7.1 Read flow (GET)

```
Server Component (page.tsx)
  └─ await queryClient.prefetchQuery({ queryKey: qk.medicines.list(filters),
                                       queryFn: () => catalogService.list(filters) })
  └─ <HydrationBoundary state={dehydrate(queryClient)}>
       └─ Client Component
            └─ const { data } = useMedicines(filters)
                 └─ medicinesService.list(filters)
                      └─ apiClient.get('/api/proxy/medicines?...')
                           └─ Route Handler proxy
                                └─ fetch(`${GATEWAY_URL}/api/v1/medicines?...`, {
                                     headers: { Cookie: req.headers.get('cookie') ?? '' }
                                   })
                                └─ return Response w/ Set-Cookie forwarded
```

- Trang phức tạp (`/thuoc`, `/dashboard`) → SSR prefetch + HydrationBoundary.
- Trang đơn giản (`/login`, `/cart`) → Client fetch only.
- Detail page (`/thuoc/[slug]`, `/don-hang/[id]`) → SSR prefetch với URL params.

### 7.2 Write flow (POST/PUT/PATCH/DELETE)

```
User submit form
  └─ react-hook-form.handleSubmit(data)
       └─ schema.parse(data)                    // FE-side validation
            └─ useCreateOrder().mutate(data)
                 └─ ordersService.create(data)
                      └─ apiClient.post('/api/proxy/orders', data)
                           └─ Route Handler → gateway → order-service
                           
  mutation hooks:
    onSuccess:
      queryClient.invalidateQueries({ queryKey: qk.orders.all })
      queryClient.invalidateQueries({ queryKey: qk.cart.all })
      queryClient.invalidateQueries({ queryKey: qk.auth.me() })
      toast.success('Tạo đơn hàng thành công')
    onError:
      toast.error(normalizeError(e).message)
```

### 7.3 Auth flow

```
Login page
  └─ useLogin().mutate({ email, password })
       └─ authService.login(credentials)
            └─ POST /api/proxy/auth/login (no cookie)
                 └─ Route Handler forwards
                      └─ Backend returns 200 + Set-Cookie:
                           pcms_access_token   (httpOnly, Secure, SameSite=Lax, 15min)
                           pcms_refresh_token  (httpOnly, Secure, SameSite=Lax, 7d)
                      └─ Route Handler returns { user } only (strip Set-Cookie từ body)
       └─ queryClient.setQueryData(qk.auth.me(), response.user)
       └─ AuthContext.state.user = response.user
       └─ router.push('/dashboard')
```

### 7.4 Refresh flow (server-side)

```
Any request → 401 from gateway
  └─ Route Handler axios/fetch interceptor:
       POST /api/proxy/auth/refresh (cookie auto-attached)
         ├─ 200: backend rotate Set-Cookie → retry original request 1× → return
         └─ 401: clear cookies + return 401 to client → AuthContext logout → redirect /login
```

Lưu ý: refresh xảy ra ở **server-side trong Route Handler**, không phải client-side. Client không bao giờ thấy token.

### 7.5 Query keys registry

```ts
// src/lib/query/query-keys.ts
export const qk = {
  auth:        { me: () => ['auth', 'me'] as const },
  medicines:   {
    all: ['medicines'] as const,
    list: (f: MedicineFilters) => ['medicines', 'list', f] as const,
    detail: (id: string) => ['medicines', 'detail', id] as const,
    search: (q: string) => ['medicines', 'search', q] as const,
  },
  orders:      { all: ['orders'] as const, list: ..., detail: ... },
  // ... 16 nhóm còn lại
} as const;
```

Mọi invalidation đi qua `qk.*`. Không hardcode keys.

### 7.6 TanStack Query defaults

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
```

Per-hook override: `staleTime` cho `useNotifications` (15s, refetch on focus), `useInventory.lowStock` (60s, polling 30s).

## 8. Error handling & observability

### 8.1 Error normalization

```ts
// src/lib/api/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
    public traceId?: string,
  ) { super(message); this.name = 'ApiError'; }
}

export function normalizeError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  if (axios.isAxiosError(e)) {
    const data = e.response?.data;
    return new ApiError(
      e.response?.status ?? 0,
      data?.code ?? 'UNKNOWN',
      data?.message ?? e.message,
      data?.errors,
      data?.traceId,
    );
  }
  return new ApiError(0, 'UNKNOWN', 'Đã xảy ra lỗi không xác định');
}
```

### 8.2 UI feedback (3 lớp)

| Lớp | Tool | Khi nào |
|---|---|---|
| Inline form error | zod + react-hook-form `formState.errors` | Field validation, server-side field errors từ `details` |
| Toast | `react-hot-toast` | Mutation success/failure, action confirm |
| Full-page error boundary | `app/error.tsx` + `app/(group)/error.tsx` | Render lỗi, 5xx không recover |

Modal chỉ dùng cho **action nguy hiểm** (xoá đơn, huỷ đơn đang giao) — không dùng cho error.

### 8.3 Route Handler logging

```ts
// src/app/api/proxy/[...path]/route.ts
export async function POST(req: Request, ctx: { params: { path: string[] } }) {
  const start = Date.now();
  const traceId = crypto.randomUUID();
  const path = '/' + ctx.params.path.join('/');
  
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_GATEWAY_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') ?? 'application/json',
        'Cookie': req.headers.get('cookie') ?? '',
        'X-Trace-Id': traceId,
      },
      body: req.body,
    });
    
    log.info({ traceId, path, status: res.status, durationMs: Date.now() - start });
    
    const setCookie = res.headers.get('set-cookie');
    return new Response(res.body, {
      status: res.status,
      headers: setCookie ? { 'Set-Cookie': setCookie } : {},
    });
  } catch (e) {
    log.error({ traceId, path, err: e, durationMs: Date.now() - start });
    return Response.json({ code: 'PROXY_ERROR', message: 'Gateway unreachable' }, { status: 502 });
  }
}

// Tương tự cho GET, PUT, PATCH, DELETE
```

JSON log có `traceId` để debug end-to-end với backend log.

### 8.4 Error UX rule

| Status | Code (gợi ý) | UX |
|---|---|---|
| 400 | VALIDATION_* | Inline error từ `details` |
| 401 | AUTH_* | Toast "Phiên hết hạn" + redirect `/login` |
| 403 | FORBIDDEN_* | Toast "Bạn không có quyền" + redirect `/403` |
| 404 | *_NOT_FOUND | Inline + nút "Quay lại" |
| 409 | CONFLICT_* | Inline ở field cụ thể |
| 422 | BUSINESS_* | Toast "Không thể thực hiện: {message}" |
| 429 | RATE_LIMIT | Toast "Quá nhiều yêu cầu, thử lại sau Xs" |
| 5xx | *_ERROR, PROXY_ERROR | Full-page error + nút "Thử lại" |
| Network | NETWORK_ERROR | Toast "Mất kết nối, kiểm tra mạng" |

### 8.5 PWA / offline (best-effort)

`next-pwa` đã có. Service Worker cache:
- App shell → `cacheFirst`
- Ảnh sản phẩm → `staleWhileRevalidate`
- API response → **không cache mặc định**, chỉ explicit qua `persistQueryClient` (IndexedDB) cho 3 view: thuốc yêu thích, đơn hàng gần nhất, giỏ hàng.

## 9. API ↔ Page ↔ Use case mapping

| UC | Backend service | FE service file | Feature hooks | Pages chính | #endpoint |
|---|---|---|---|---|---|
| UC01 | user-service | `auth.service` | `features/auth` | `/login`, `/register`, `/forgot-password` | 6 |
| UC02 | user-service | `user.service` | `features/users` | `/dashboard/users`, `/dashboard/profile` | 15 |
| UC03 | branch-service | `branch.service` | `features/branches` | `/dashboard/branches`, `/he-thong-cua-hang/*` | 10 |
| UC04 | catalog-service | `catalog.service` | `features/medicines` | `/thuoc`, `/thuoc/[slug]`, `/tra-cuu-thuoc` | 18 |
| UC05 | category-service | `category.service` | `features/categories` | `/danh-muc`, navigation | 8 |
| UC06 | inventory-service | `inventory.service` | `features/inventory` | `/dashboard/inventory`, `/dashboard/low-stock` | 14 |
| UC07 | supplier-service | `supplier.service` | `features/suppliers` | `/dashboard/suppliers` | 10 |
| UC08 | order-service | `order.service` | `features/orders` | `/don-hang`, `/don-hang/[id]`, `/checkout` | 22 |
| UC09 | prescription-service | `prescription.service` | `features/prescriptions` | `/dashboard/prescriptions`, `/toa-thuoc`, `/ai/rx-ocr` | 13 |
| UC10 | payment-service | `payment.service` | `features/payments` (sub of orders) | `/checkout/payment`, `/wallet` | 9 |
| UC11 | customer-portal-service | `customer.service` | `features/customers` | `/profile`, `/addresses`, `/family`, `/favorites` | 23 |
| UC12 | customer-portal-service | `cart.service` (merged into order) | `features/cart` | `/cart`, `/checkout` | 12 |
| UC13 | customer-portal-service | `voucher.service` (merged into order) | `features/vouchers` | `/checkout`, `/dashboard/vouchers` | 8 |
| UC14 | notification-service | `notification.service` | `features/notifications` | `/notifications`, top-bar bell | 11 |
| UC15 | report-service | `report.service` | `features/reports` | `/dashboard/reports/*` | 9 |
| UC16 | ai-engine-service (Python) | `ai.service` | `features/ai` | `/ai/chat`, `/ai/drug-check`, `/ai/semantic-search`, `/ai/rx-ocr` | 18 |
| UC17 | pharmacist-workbench-service | `workbench.service` (merged into prescription) | `features/workbench` | `/dashboard/workbench` | 15 |
| UC18 | health-tools-service | `health-tools.service` | `features/health-tools` | `/health-tools/*`, `/tiem-chung` | 13 |
| UC19 | ecom-ops-service | `ecom-ops.service` | `features/ecom-ops` | `/flash-sale`, `/installment`, `/chuyen-trang-ung-thu` | 12 |

**Tổng: 246 endpoints × 16 service files × 14 feature folders × ~55 pages**

### 9.1 Endpoint chi tiết cho 4 UC mẫu (template cho các UC khác)

**UC01 — Auth** (`services/auth.service.ts`)
```
POST   /auth/login              → login(creds): { user }
POST   /auth/register           → register(form): { user }
POST   /auth/refresh            → (interceptor only, no FE call)
POST   /auth/logout             → logout(): void
POST   /auth/forgot             → requestPasswordReset(email): void
POST   /auth/reset              → resetPassword(token, newPwd): void
```
Hooks: `useLogin`, `useRegister`, `useLogout`, `usePasswordReset`. Pages: `/login`, `/register`, `/forgot-password`. Schema: `loginSchema`, `registerSchema`.

**UC04 — Catalog** (`services/catalog.service.ts`)
```
GET    /medicines?query=&category=&page=    → list(filters): PageResponse<Medicine>
GET    /medicines/:slug                     → detail(slug): MedicineDetail
GET    /medicines/search?q=                 → search(q): Medicine[]
GET    /medicines/featured                  → featured(): Medicine[]
GET    /medicines/best-sellers              → bestSellers(): Medicine[]
GET    /medicines/:slug/related             → related(slug): Medicine[]
GET    /medicines/:slug/reviews             → reviews(slug): Review[]
POST   /medicines/reviews                   → createReview(medicineId, dto): Review
POST   /medicines                           → create(dto): Medicine       (admin)
PUT    /medicines/:id                       → update(id, dto): Medicine   (admin)
DELETE /medicines/:id                       → remove(id): void             (admin)
... (8 nữa: byCategory, byBrand, lowStock, expiring, etc.)
```
Hooks: `useMedicines(filters)` (infinite), `useMedicineDetail(slug)`, `useSearchMedicines(q)`, `useFeaturedMedicines()`. Pages: `/thuoc`, `/thuoc/[slug]`. SSR prefetch + client infinite scroll.

**UC08 — Order** (`services/order.service.ts`)
```
GET    /orders?status=&dateFrom=&dateTo=    → list(filters): PageResponse<Order>
GET    /orders/:id                          → detail(id): OrderDetail
POST   /orders                              → create(cart, paymentMethod): Order
PATCH  /orders/:id/status                   → updateStatus(id, status): Order
POST   /orders/:id/cancel                   → cancel(id, reason): Order
POST   /orders/:id/refund                   → requestRefund(id, reason): Refund
GET    /orders/:id/timeline                 → timeline(id): TimelineEvent[]
GET    /orders/stats                        → stats(filters): OrderStats
... (14 nữa)
```
Hooks: `useOrders(filters)`, `useOrderDetail(id)`, `useCreateOrder()` (invalidates cart, orders, auth.me, notifications), `useCancelOrder()`, `useOrderStats(filters)`. Pages: `/don-hang`, `/don-hang/[id]`, `/checkout`.

**UC16 — AI** (`services/ai.service.ts`) — pattern đặc biệt cho SSE
```
POST /ai/chat                  → chat(message, history): AsyncIterable<ChatChunk>   (streaming SSE)
POST /ai/drug-check            → drugCheck(medicines): DrugInteraction[]
POST /ai/rx-ocr                → ocrPrescription(image): PrescriptionDraft            (multipart)
POST /ai/semantic-search       → semanticSearch(query): SearchResult[]
... (14 nữa)
```
Hooks: `useChatSession()` (custom, không qua TanStack Query vì SSE streaming), `useDrugCheck()`, `useOcrPrescription()` (upload progress). Pages: `/ai/chat`, `/ai/drug-check`, `/ai/rx-ocr`, `/ai/semantic-search`.

## 10. Implementation phases (5 phases, theo vai trò)

### Phase 1 — Foundation + Auth (~2 tuần)

**Deliverable:** Login → dashboard rỗng + dropdown user. Refresh token tự động.

Tasks:
1. Thêm `springdoc-openapi-starter-webmvc-ui` cho 19 services (backend), verify `/v3/api-docs` (mỗi service + gateway aggregate).
2. Setup OpenAPI codegen script (`scripts/gen-api-types.sh`) + npm command.
3. Implement Route Handler proxy `src/app/api/proxy/[...path]/route.ts` (GET/POST/PUT/PATCH/DELETE + logging + refresh interceptor).
4. Implement `src/lib/api/client.ts` (axios instance), `errors.ts` (ApiError + normalizeError), `endpoints.ts`.
5. Implement `src/lib/query/provider.tsx` (QueryClient defaults), `query-keys.ts`.
6. Implement `src/lib/config/env.ts` (Zod validation).
7. Modify backend để set cookie mode làm default (qua `application.yml`): `pcms_access_token` (httpOnly, Secure, SameSite=Lax, 15min) + `pcms_refresh_token` (httpOnly, Secure, SameSite=Lax, 7d).
8. Modify CORS config: `allowCredentials=true`, `allowedOrigins=[http://localhost:3000]`.
9. Refactor `src/lib/auth/auth.ts` (login/logout/refresh qua proxy, response không chứa token).
10. Refactor `src/lib/auth/auth-context.tsx` (state.user only, no token; hydrate từ `useCurrentUser`).
11. Implement `features/auth/use-current-user.ts` (`useQuery({ queryKey: qk.auth.me(), queryFn: customerService.me })`).
12. Implement `features/auth/use-login.ts`, `use-logout.ts`, `use-register.ts`.
13. Implement `services/auth.service.ts`, `services/user.service.ts`, `services/branch.service.ts`.
14. Wire `/login`, `/register`, `/forgot-password` pages (form + zod schema + hooks).
15. Smoke E2E: login → dashboard.

### Phase 2 — Customer portal (~3-4 tuần)

**Deliverable:** Khách vào xem thuốc, thêm giỏ, checkout, xem đơn, nhận notification.

Tasks:
1. Implement service files: `catalog`, `category`, `customer`, `order`, `payment`, `notification`.
2. Implement hooks (15 mới): `useMedicines`, `useMedicineDetail`, `useSearchMedicines`, `useCategories`, `useMe`, `useUpdateMe`, `useAddresses`, `useCart`, `useAddToCart`, `useCheckout`, `useOrders`, `useOrderDetail`, `useCancelOrder`, `useNotifications`, `useVouchers`.
3. Implement pages (đã có UI mockup, cần gắn data):
   - `(customer)/thuoc/page.tsx`, `(customer)/thuoc/[slug]/page.tsx`
   - `(customer)/danh-muc/page.tsx`
   - `(customer)/cart/page.tsx`, `(customer)/checkout/page.tsx`
   - `(customer)/don-hang/page.tsx`, `(customer)/don-hang/[id]/page.tsx`
   - `(auth)/profile/page.tsx`, `(auth)/addresses/page.tsx`, `(auth)/wallet/page.tsx`, `(auth)/notifications/page.tsx`, `(auth)/favorites/page.tsx`
   - `(auth)/family/page.tsx`, `(auth)/prescriptions/page.tsx`, `(auth)/points/page.tsx`
4. SSR prefetch cho `/thuoc`, `/thuoc/[slug]`, `/don-hang/[id]`, `/dashboard`.
5. Implement shared schemas (zod): `order`, `address`, `medicine`, `customer`.
6. Implement TanStack Query SSR helper `lib/query/prefetch.ts`.
7. Smoke E2E: browse → add cart → checkout → xem đơn.

### Phase 3 — Pharmacist workbench (~2-3 tuần)

**Deliverable:** Dược sĩ vào ca, kiểm tra tồn kho, cảnh báo hết hạn, kê đơn.

Tasks:
1. Service files: `inventory`, `prescription`, `workbench`.
2. Hooks: `useInventory`, `useLowStock`, `useImport`, `useExpiring`, `usePrescriptions`, `useCreateRx`, `useWorkbenchQueue`, `useDispense`.
3. Pages `(dashboard)/inventory/*`, `(dashboard)/prescriptions/*`, `(dashboard)/workbench/page.tsx`, `(dashboard)/low-stock/page.tsx`.
4. Implement polling cho low-stock (30s interval).
5. Implement Rx upload + OCR UI.
6. Smoke E2E: import hàng → check low-stock alert → tạo đơn thuốc kê đơn.

### Phase 4 — Admin/Manager (~2 tuần)

**Deliverable:** Admin quản lý nhân viên/nhà cung cấp, xem báo cáo doanh thu.

Tasks:
1. Service files: `user`, `supplier`, `report`.
2. Hooks (7 mới): `useUsers`, `useCreateUser`, `useUpdateUser`, `useSuppliers`, `useSalesReport`, `useInventoryReport`, `useExportCsv`.
3. Pages: `(dashboard)/users/page.tsx`, `(dashboard)/suppliers/page.tsx`, `(dashboard)/reports/sales/page.tsx`, `(dashboard)/reports/inventory/page.tsx`.
4. CSV export qua streaming response.
5. Role-based UI guard (`<RoleGate role="ADMIN">`).
6. Smoke E2E: tạo user mới → phân quyền → xem báo cáo.

### Phase 5 — Specialized features (~2 tuần)

**Deliverable:** AI chat, tra cứu dược liệu, flash sale, trả góp, tiêm chủng.

Tasks:
1. Service files: `ai`, `health-tools`, `ecom-ops`.
2. Hooks (9 mới): `useChatSession` (custom SSE handler, không qua TanStack Query), `useDrugCheck`, `useOcrPrescription`, `useSemanticSearch`, `useFlashSales`, `useInstallmentPlans`, `useVaccines`, `useBMI`, `useBMR`.
3. Pages: `(customer)/ai/chat/page.tsx`, `(customer)/ai/drug-check/page.tsx`, `(customer)/ai/rx-ocr/page.tsx`, `(customer)/ai/semantic-search/page.tsx`, `(customer)/flash-sale/page.tsx`, `(customer)/installment/page.tsx`, `(customer)/tiem-chung/page.tsx`, `(customer)/health-tools/*`.
4. SSE streaming implementation qua Web API `ReadableStream` trong Route Handler.
5. Implement `lib/api/sse-client.ts` cho FE.
6. Smoke E2E: chat AI → đặt flash sale → xem lịch tiêm chủng.

**Tổng effort: 11–14 tuần** (1 dev fulltime).

## 11. Testing strategy

| Tầng | Tool | Scope | Coverage target |
|---|---|---|---|
| Unit | Vitest | `services/*.service.ts`, `schemas/*.schema.ts`, `lib/api/errors.ts` | ≥ 80% `lib/` + `services/` + `schemas/` |
| Hook | Vitest + RTL + MSW | `features/*/use-*.ts` với `<TestQueryProvider>` | mỗi hook 2–4 case (success, error, loading) |
| Component | Vitest + RTL | form components, key widgets | key components per feature |
| E2E | Playwright + docker-compose backend | 1 smoke flow per phase | 5 E2E total |

## 12. Validation gates (mỗi PR)

| Gate | Tool | Threshold |
|---|---|---|
| Type check | `tsc --noEmit` | 0 errors |
| Lint | `eslint --max-warnings 0` | 0 errors, 0 warnings |
| Unit + hook test | `vitest run --coverage` | ≥ 80% cho `lib/`, `services/`, `schemas/` |
| Build | `next build` | success |
| E2E smoke (phase tương ứng) | `playwright test` | 1 happy path pass |
| Generated types up-to-date | `scripts/gen-api-types.sh` + `git diff --exit-code src/types/api-generated/` | no diff |

## 13. OpenAPI codegen workflow

```bash
# scripts/gen-api-types.sh
#!/usr/bin/env bash
set -euo pipefail

GATEWAY_URL="${GATEWAY_URL:-http://localhost:8080}"
curl -sf "${GATEWAY_URL}/v3/api-docs" -o /tmp/openapi.json

npx openapi-typescript /tmp/openapi.json \
  --output src/types/api-generated/schema.d.ts

npx prettier --write src/types/api-generated/schema.d.ts

echo "✅ Generated $(wc -l < src/types/api-generated/schema.d.ts) lines of types"
```

- Chạy tay: `npm run gen:api` (khi backend thay đổi).
- CI: nếu file generated thay đổi nhưng không có commit kèm theo → fail.
- Dùng `openapi-typescript` (chỉ types) — KHÔNG dùng `orval` (đã chốt axios + TanStack Query).

## 14. Environment & config

```ts
// src/lib/config/env.ts
import { z } from 'zod';

export const env = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),         // base cho relative URL trên client (vd "/api/proxy")
  NEXT_PUBLIC_APP_URL: z.string().url(),         // cho OG, canonical
  NEXT_PUBLIC_GATEWAY_URL: z.string().url(),     // cho Route Handler proxy (server-only thực sự)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(), // reserve, chưa dùng
}).parse(process.env);
```

`NEXT_PUBLIC_GATEWAY_URL` chỉ đọc được trong server context (Route Handler, server actions). Client chỉ dùng relative `/api/proxy/...`.

## 15. Rollout plan

| Bước | Hành động | Verify |
|---|---|---|
| 1 | Merge Phase 1 vào `main`, deploy dev | Login E2E pass, refresh token OK |
| 2 | Dev team switch `.env.local` sang cookie mode | Mọi dev login/refresh OK |
| 3 | Backend config cookie mode làm default (application.yml) | Backend test pass |
| 4 | Phase 2 merge, deploy, demo nội bộ | Khách mua thuốc end-to-end |
| 5 | Phase 3 → 5 tương tự | Mỗi phase có demo gate trước khi merge |

## 16. Risks & mitigations

| # | Rủi ro | Mitigation |
|---|---|---|
| 1 | Backend OpenAPI chưa expose `/v3/api-docs` đầy đủ | Phase 1 task: thêm `springdoc-openapi-starter-webmvc-ui` cho 19 services, verify endpoint |
| 2 | `SameSite=Lax` chặn cross-origin dev (FE :3000, gateway :8080) | Backend CORS: `allowCredentials=true`, `allowedOrigins=["http://localhost:3000"]` |
| 3 | TanStack Query SSR + Next.js 14 App Router có nhiều gotcha | Phase 1: viết 1 example hoàn chỉnh (server prefetch + client hydration) cho team copy |
| 4 | Type drift giữa backend Java records ↔ TS | Codegen là nguồn duy nhất; manual types chỉ cho FE-specific |
| 5 | SSE streaming qua Next.js Route Handler | Dùng `ReadableStream` của Web API; tắt buffering; test với ai-engine thật |
| 6 | PWA cache stale data | Default không cache API; explicit opt-in qua `persistQueryClient` cho 3 view |
| 7 | Spec quá dài (246 endpoints) → dev bị overwhelm | Phases chia theo role; mỗi phase độc lập demo được |
| 8 | Backend chưa chạy được (Maven không có sẵn) | Setup môi trường dev trước Phase 1; docker-compose thay thế nếu cần |

## 17. Out of scope

- Payment gateway thật (Stripe/MoMo/VNPay) — wrapper mock
- i18n (chỉ tiếng Việt)
- E2E cho cả 19 use case (chỉ 1 smoke per phase)
- Refactor backend (trừ thêm `springdoc` + cookie config)
- Sentry/PostHog/DataDog (để phase sau)
- Design system mới (theo DESIGN.md/PRODUCT.md hiện có)
- Mobile app (mobile-bff đã có nhưng không thuộc phạm vi FE web này)
- Real-time WebSocket (chỉ SSE cho AI chat; notification dùng polling 30s)

## 18. References

- Backend SRS: `pcms/SRS_PhamacyChainManagementSystem_v1.0.0.md`
- Backend SDD: `pcms/SDD_PhamacyChainManagementSystem_v1.0.0.md`
- Backend Postman: `pcms/postman/PCMS.postman_collection.json`
- Backend plan: `pcms/docs/PLAN_API_COMPLETION.md`
- Backend progress: `pcms/progress.md`
- Backend context: `pcms/context.md`
- Backend CODE_RULES: `pcms/CODE_RULES.md`
- Frontend AGENTS: `pcms-frontend/AGENTS.md`
- Frontend DESIGN: `pcms-frontend/DESIGN.md`
- Frontend PRODUCT: `pcms-frontend/PRODUCT.md`
- Frontend env: `pcms-frontend/.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`)