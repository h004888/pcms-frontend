# Sprint 0 — Path Mismatch Fixes (FE Bugfix)

> Sprint này: sửa **4 endpoint path mismatch** đã phát hiện trong `API_INTEGRATION_REPORT.md` §3.
> Không thêm endpoint mới, không refactor lớn — chỉ đổi string/path + cập nhật 1-2 service file đơn giản.

## Mục tiêu Sprint 0

- ✅ Loại bỏ **404** khi FE gọi các endpoint không tồn tại ở backend
- ✅ 100% frontend URL constants khớp với backend thật
- ✅ Giữ backward-compat: tất cả service khác vẫn hoạt động bình thường

## Tasks

| # | Task | Effort | Path cũ → Path mới |
|:--:|---|:-:|---|
| T01 | Fix `ARTICLES` path | XS (5 ph) | `/articles` → `/health-articles` |
| T02 | Fix `POINTS_REDEEM` path | XS (5 ph) | `/points/redeem` → `/wallet/redeem` |
| T03 | Fix `PROFILE` path (refactor service) | S (20 ph) | `/profile` → `/customers/me` |
| T04 | Fix `USER_RESET_PASSWORD` | S (15 ph) | `/users/{id}/reset-password` → `/auth/reset-password` |

**Tổng:** ~45 phút dev.

---

## T01 — Fix `ARTICLES` path

### Mục tiêu
Trang `/bai-viet/[slug]` và `/bai-viet` đang gọi `/articles` nhưng backend có `/health-articles`.

### Files thay đổi (1 file)

| # | File | Dòng | Trước | Sau |
|---|---|---|---|---|
| 1 | `pcms-frontend/src/lib/api/endpoints.ts` | 37 | `ARTICLES: '/articles'` | `ARTICLES: '/health-articles'` |
| 2 | `pcms-frontend/src/lib/api/endpoints.ts` | 38 | `ARTICLE_DETAIL: (slug: string) => \`/articles/${slug}\`` | `ARTICLE_DETAIL: (slug: string) => \`/health-articles/${slug}\`` |

### Acceptance criteria
- [ ] File edit save thành công (không có TypeScript error)
- [ ] File `features/articles/services/articleService.ts` KHÔNG cần sửa (chỉ dùng `API_ENDPOINTS.ARTICLES` / `ARTICLE_DETAIL`)
- [ ] Trang `/bai-viet/[slug]` load article từ backend (`GET /health-articles/<slug>` trả 200)
- [ ] Trang `/bai-viet` (list) load từ backend (`GET /health-articles?cat=` trả 200)

### Test thủ công
```bash
# 1. Start backend (config-server, discovery, api-gateway, customer-portal)
# 2. Start frontend
cd pcms-frontend && npm run dev

# 3. Browse to http://localhost:3000/bai-viet
# 4. Network tab → /api/v1/health-articles trả 200 (không phải /articles)
# 5. Click article → /bai-viet/<slug> → /api/v1/health-articles/<slug> trả 200
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟢 Thấp | Response shape có thể khác — articleService.ts đang kỳ vọng `body.articles ?? body.data`. Backend `/health-articles` trả `PageResponse<HealthArticleResponse>` có `.data[]`. Khả năng vẫn match nhờ fallback `??`. | Test trước khi merge; nếu shape khác, điều chỉnh `articleService.ts` ngay. |

---

## T02 — Fix `POINTS_REDEEM` path

### Mục tiêu
Trang redeem points đang gọi `/points/redeem` nhưng backend có `/wallet/redeem`.

### Files thay đổi (1 file)

| # | File | Dòng | Trước | Sau |
|---|---|---|---|---|
| 1 | `pcms-frontend/src/lib/api/endpoints.ts` | 18 | `POINTS_REDEEM: '/points/redeem'` | `POINTS_REDEEM: '/wallet/redeem'` |

### Acceptance criteria
- [ ] Redeem flow `POST /wallet/redeem` trả 200
- [ ] Response chứa `newBalance` hoặc `RedeemResponse` shape theo `WalletController`

### Test thủ công
```bash
# Bằng Postman/Newman
curl -X POST http://localhost:8080/api/v1/wallet/redeem \
  -H "Content-Type: application/json" \
  -H "X-Customer-Id: <uuid>" \
  -d '{"rewardId":"<reward-uuid>", "pointsToRedeem": 50}'
# Expected: 200 + {newBalance, redeemedItems[]}
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟢 Thấp | Không có — backend `/wallet/redeem` đã được FE dùng ở 1 endpoint khác (`WALLET_REDEEM`). Cùng path, cùng shape. | None |

---

## T03 — Fix `PROFILE` path (refactor profileService)

### Mục tiêu
Profile page đang gọi `/profile` (không tồn tại). Backend dùng `/customers/me`.

### Files thay đổi (2-3 file)

| # | File | Dòng | Thay đổi |
|---|---|---|---|
| 1 | `pcms-frontend/src/lib/api/endpoints.ts` | 30-31 | `PROFILE: '/profile'` → `ME: '/customers/me'` (đổi tên const cho rõ); giữ nguyên `PROFILE_AVATAR` |
| 2 | `pcms-frontend/src/features/profile/services/profileService.ts` | 8-15 | Refactor 2 hàm `fetchProfile` / `updateProfile` dùng `API_ENDPOINTS.ME` thay vì `PROFILE` |
| 3 (tùy) | `pcms-frontend/src/app/(auth)/profile/page.tsx` | nếu import trực tiếp | Đổi `fetchProfile` → `fetchMe` (giữ alias hoặc rename) |

**Lưu ý:** Nếu `Profile` Type trong `features/profile/types.ts` khác `CustomerResponse`, cần align.

### Acceptance criteria
- [ ] `fetchMe()` → `GET /customers/me` trả 200 với `CustomerResponse`
- [ ] `updateMe(data)` → `PUT /customers/me` thành công
- [ ] Page `/profile` render đúng dữ liệu customer (tên, phone, email, points)
- [ ] `PROFILE_AVATAR` vẫn ở nguyên (out-of-scope P2 chờ backend triển khai)

### Code snippet cụ thể (T03)

`endpoints.ts`:
```typescript
// ============= Profile =============
ME: '/customers/me',                            // Đổi từ PROFILE → ME
PROFILE_AVATAR: '/profile/avatar',              // (placeholder, BE chưa có)
```

`profileService.ts`:
```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { CustomerResponse, UpdateCustomerRequest } from '@/types/customer';

export async function fetchMe(): Promise<CustomerResponse> {
  const res = await apiClient.get<CustomerResponse>(API_ENDPOINTS.ME);
  return res.data;
}

export async function updateMe(data: UpdateCustomerRequest): Promise<CustomerResponse> {
  const res = await apiClient.put<CustomerResponse>(API_ENDPOINTS.ME, data);
  return res.data;
}

// uploadAvatar: giữ nguyên để có thể trả 404 — không vội xóa
export async function uploadAvatar(formData: FormData) {
  try {
    return await apiClient.post(API_ENDPOINTS.PROFILE_AVATAR, formData);
  } catch {
    return { data: null, error: 'Backend chưa hỗ trợ upload avatar' };
  }
}
```

### Test thủ công
```bash
# Login customer B2C trước, lấy token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -d '{"username":"customer1","password":"pass"}'

# Sau đó browse đến /profile
# Network: GET /api/v1/customers/me trả 200 (không /profile)
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | TypeScript type mismatch nếu `Profile` ≠ `CustomerResponse`. | Tạo `types.ts` mới cho `CustomerResponse` từ `@/types/customer` (đã có). Xóa type cũ nếu không dùng. |
| 🟢 Thấp | Nhiều file UI import `fetchProfile` / `Profile`. | Tìm grep `Profile` references trong `src/`, rename hết. |

---

## T04 — Fix `USER_RESET_PASSWORD`

### Mục tiêu
Admin dashboard user management đang gọi `/users/{id}/reset-password`. Backend có `/auth/reset-password` (auth-level, không nested).

### Files thay đổi (2 file)

| # | File | Dòng | Trước | Sau |
|---|---|---|---|---|
| 1 | `pcms-frontend/src/lib/api/endpoints.ts` | 43 | `USER_RESET_PASSWORD: (id: string) => \`/users/${id}/reset-password\`` | `USER_RESET_PASSWORD: '/auth/reset-password'` |
| 2 | `pcms-frontend/src/features/users/services/userService.ts` | hàm gọi reset password | Dùng `id` để build path | Truyền `token=...` trong body, dùng X-User-Id header (admin override) |

### Acceptance criteria
- [ ] Admin dashboard `/users/[id]` có nút "Reset password" mở modal
- [ ] Form yêu cầu nhập token mới (admin generate trước qua flow riêng)
- [ ] `POST /auth/reset-password` với `{token, newPassword}` + `X-User-Id: <admin-uuid>` trả 200
- [ ] User không lock account, có thể login bằng password mới

### Code snippet (T04)

`userService.ts`:
```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export async function adminResetPassword(
  newPassword: string,
  token: string,
  adminId: string,
): Promise<{ message: string }> {
  const res = await apiClient.post(API_ENDPOINTS.USER_RESET_PASSWORD, {
    token,
    newPassword,
  }, {
    headers: { 'X-User-Id': adminId },
  });
  return res.data;
}
```

UI modal (nơi gọi):
```typescript
// Admin sẽ:
// 1. Trigger /auth/forgot-password trên behalf user (cần riêng flow)
// 2. User nhận token qua email
// 3. Admin dán token + nhập newPassword → adminResetPassword(...)
```

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🟡 TB | Backend `AuthController.resetPassword` chỉ chấp nhận token do user yêu cầu — admin không generate trực tiếp. Có thể cần thêm endpoint `/admin/users/{id}/reset-password` ở user-service. | Postpone T04 nếu BE chưa support; track làm follow-up trong Sprint 3 hoặc sau. |
| 🟢 Thấp | UI flow phức tạp | Có thể vẫn dùng flow `forgot-password` rồi `reset-password`. |

---

## Verification — chạy sau khi Sprint 0 xong

### Test 1: API_INTEGRATION_REPORT regenerate

```bash
# Trong thư mục repo root
python -c "
import json, re
with open('pcms-frontend/src/lib/api/endpoints.ts') as f: src = f.read()
frontend = {m.group(1) for m in re.finditer(r\"'(/[^']+)'\", src)}
with open('pcms/postman/PCMS.postman_collection.json') as f: pc = json.load(f)
backend = set()
for folder in pc['item']:
    for req in folder['item']:
        m = re.match(r'\{\{gateway\}\}(.+?)(?:\?|$)',
                     req['request']['url']['raw'])
        if m: backend.add(re.sub(r'/\{\{[^}]+\}\}.*', '', m.group(1)))
missing = sorted([p for p in frontend if p not in backend])
print(f'Match: {len(frontend) - len(missing)}/{len(frontend)}')
for p in missing: print(f'  ❌ {p}')
"
```

**Expected:** Trước (88.7%) → Sau (~97-100% match).

### Test 2: Build OK

```bash
cd pcms-frontend
npm run build
npm run typecheck
```

**Expected:** Không có TypeScript error, lint pass.

### Test 3: Manual smoke

| Trang | Đường dẫn | Endpoint gọi | Expected |
|---|---|---|---|
| Article list | `/bai-viet` | `GET /api/v1/health-articles?cat=` | 200 |
| Article detail | `/bai-viet/<slug>` | `GET /api/v1/health-articles/<slug>` | 200 |
| Redeem | (trang redeem) | `POST /api/v1/wallet/redeem` | 200 |
| Profile | `/profile` | `GET /api/v1/customers/me` | 200 |

---

## Self-check

| Tiêu chí | OK? |
|---|---|
| Đủ: T01-T04 4 task, đầy đủ acceptance + test + risk | ✓ |
| Đúng: scope bám sát `INTEGRATION_PLAN.md` | ✓ |
| Không thừa: không thêm task ngoài sprint, không refactor | ✓ |
| Giả định: T03 có thể cần đổi UI import — nêu rõ trong Acceptance | ✓ |
