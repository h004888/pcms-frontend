# Visual Verification Report — PCMS Frontend

**Date:** 2026-06-16
**Tool:** chrome_devtools MCP
**Dev server:** `npm run dev` trên `http://127.0.0.1:3000`
**Backend:** KHÔNG chạy (localhost:8080 down) — chỉ check layout/visual, không check data

---

## Trang đã verify thành công

### ✅ 1. /login (brand-led split layout)

**Screenshot:** `.impeccable/screenshots/login-desktop.jpeg`

| Element | Status |
|---|---|
| Brand panel trái (ink-900) | ✓ Render đúng |
| 1px teal accent stripe top | ✓ Có |
| PCMS wordmark (mono, accent-400) | ✓ Đúng |
| v1.0.0 · 2026 (mono) | ✓ Đúng |
| H1 "Bàn điều khiển của dược sĩ." (trắng + teal) | ✓ Đúng, word break tự nhiên |
| Subtitle tiếng Việt | ✓ Line-height 1.5+ tốt |
| 3 value props (Bán thuốc / Tồn kho / Báo cáo) | ✓ Icon teal, title trắng, body ink-300 |
| Form panel phải (white) | ✓ Render đúng |
| Inputs (ink-300 border) | ✓ Đúng |
| Password toggle (eye icon) | ✓ Có, aria-label đúng |
| "Ghi nhớ" checkbox + "Quên mật khẩu?" link | ✓ Đúng |
| "Đăng nhập" button (primary ink-900) | ✓ Render đúng |
| `<details>` Tài khoản demo | ✓ Collapsed, expand đúng, mono credentials |
| Footer copyright (mono) | ✓ Đúng |

**Verdict:** Login page render hoàn hảo. Brand-led split layout đạt mục tiêu.

### ✅ 2. /home (Pharmacist's Workbench) — SAU KHI FIX TAILWIND CONFIG

**Screenshot:** `.impeccable/screenshots/home-fixed.jpeg`

| Element | Status |
|---|---|
| Sidebar (ink-700 logo, grouped nav, active=teal) | ✓ Đúng |
| Header (user avatar teal, name, role) | ✓ Đúng, aria-label user |
| Eyebrow "CA CHIỀU · THỨ BA, 16 THÁNG 6" (teal, mono) | ✓ Đúng, time-of-day |
| H1 "Admin, sẵn sàng cho ca làm việc." (no emoji) | ✓ Đúng |
| Role subtitle "Quản trị viên" | ✓ Đúng |
| **4 stat cards trong 1 hàng** (4-column grid) | ✓ **Sau fix Tailwind config** |
| Stat 1: Doanh thu hôm nay (teal icon) | ✓ |
| Stat 2: Tồn kho thấp (yellow icon, count) | ✓ |
| Stat 3: Đơn chờ thanh toán (ink-500 icon) | ✓ |
| Stat 4: Lô sắp hết hạn (red icon) | ✓ |
| Card "Đơn hàng gần đây" + empty state CTA | ✓ Icon + text + "Tạo đơn đầu tiên" link |
| Card "Cảnh báo tồn kho" + positive state | ✓ Teal pill icon + "Tất cả đều đủ hàng" |
| Quick actions: 1 primary navy + 3 outline | ✓ Flat-by-default đúng |
| No ghost-cards (border only) | ✓ |
| No gradient, no emoji decoration lặp lại | ✓ |

**Verdict:** Home page render hoàn hảo sau khi fix Tailwind config.

---

## 🐛 Bug phát hiện & fix trong session này

### P0: Tailwind content paths thiếu `src/features/**` và `src/lib/**`

**File:** `tailwind.config.ts`

**Triệu chứng:** Tất cả class utility trong `src/features/**` (HomeView, OrdersList, Medicines, etc.) KHÔNG được Tailwind scan → CSS không generate → layout broken.

**Bằng chứng:**
- Trước fix: `gridTemplateColumns: "716.667px"` (1 cột) tại viewport 1036px (> lg 1024px)
- `curl /_next/static/css/app/layout.css | grep grid-cols-4` → 0 matches
- Class `lg:grid-cols-4` có trong DOM nhưng computed style 1 cột

**Fix:**
```ts
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  '+ ./src/features/**/*.{js,ts,jsx,tsx,mdx}',
  '+ ./src/lib/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**Sau fix:** `gridTemplateColumns: "171px 171px 171px 171px"` (4 cột) ✓

**Impact:** Ảnh hưởng TẤT CẢ feature pages: HomeView, OrdersList, Medicines, Users, Customers, Branches, Inventory, Categories, Suppliers, Prescriptions, Notifications, Reports, Search. Tất cả responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `grid-cols-2 sm:grid-cols-4`, etc.) đều broken trước fix.

**Tại sao trước đây không phát hiện:** TypeScript compile sạch, lint sạch. Chỉ phát hiện khi visual verify bằng browser thật.

---

## Trang KHÔNG verify được (auth + backend cần thiết)

### 3-14: /orders, /medicines, /users, /customers, /branches, /inventory, /categories, /suppliers, /prescriptions, /notifications, /reports, /search

**Vấn đề:**
- Backend `localhost:8080` không chạy → API call fail
- Auth context hydration timing: `isAuthenticated` = false trong initial render → DashboardLayout redirect `/login` → `/login` check auth = true (từ localStorage) → redirect `/home`
- Tôi inject fake auth vào localStorage nhưng timing issue vẫn xảy ra

**Server log xác nhận:** `GET /orders 200 in 53ms` — server serve đúng, browser bị redirect về /home

**Đây là pre-existing bug** không liên quan đến polish/craft của tôi. Nó tồn tại trước cả khi tôi bắt đầu init.

**Visual layout inference:** Vì token migration chỉ đổi class name (gray→ink, primary→ink-900, etc.) không đổi structure, các trang này sẽ render đúng layout với màu mới. Sidebar/Header/Card/Table/Button/Input đều dùng tokens mới — đã verify qua /home.

**Cách verify thật sự:** Cần backend chạy hoặc fix auth hydration timing (DashboardLayout nên check `state.hydrated` trước khi redirect).

---

## Tổng kết visual verification

| Trang | Render | Layout | Tokens | Ghost-card | A11y | Notes |
|---|---|---|---|---|---|---|
| /login | ✅ | ✅ | ✅ | ✅ | ✅ | Brand-led split đẹp |
| /home | ✅ | ✅ (sau fix) | ✅ | ✅ | ✅ | Grid 4 cột đúng |
| /orders | ❌ redirect /home | — | — | — | — | Backend down + auth timing |
| /medicines | ❌ redirect /home | — | — | — | — | Same |
| /users | ❌ redirect /home | — | — | — | — | Same |
| /customers | ❌ redirect /home | — | — | — | — | Same |
| /branches | ❌ redirect /home | — | — | — | — | Same |
| /inventory | ❌ redirect /home | — | — | — | — | Same |
| /categories | ❌ redirect /home | — | — | — | — | Same |
| /suppliers | ❌ redirect /home | — | — | — | — | Same |
| /prescriptions | ❌ redirect /home | — | — | — | — | Same |
| /notifications | ❌ redirect /home | — | — | — | — | Same |
| /reports | ❌ redirect /home | — | — | — | — | Same |
| /search | ❌ redirect /home | — | — | — | — | Same |

**2/15 trang verify thành công. 13/15 trang bị block bởi backend + auth timing (không phải do polish).**

---

## Bug pre-existing phát hiện (không fix trong session)

### Auth hydration timing
- `AuthContext` initial state: `isAuthenticated: false`
- `useEffect` hydrate từ localStorage sau render
- `DashboardLayout` useEffect: nếu !isAuthenticated → redirect /login
- `/login` useEffect: nếu isAuthenticated → redirect /home
- → Loop: /orders → DashboardLayout (false) → /login → (true từ localStorage) → /home

**Impact:** Mọi page trong `(dashboard)` route group bị redirect về /home khi reload, bất kể auth state. Phải navigate từ /home (đã hydrate) sang page khác mới hoạt động.

**Fix đề xuất:**
```tsx
// AuthContext: thêm hydration state
const [hydrated, setHydrated] = useState(false);
useEffect(() => {
  // hydrate
  setHydrated(true);
}, []);

// DashboardLayout: chờ hydrate
if (!hydrated) return <LoadingSpinner />;
if (!state.isAuthenticated) router.push('/login');
```

---

## Screenshots

| File | Nội dung |
|---|---|
| `.impeccable/screenshots/login-desktop.jpeg` | /login trên desktop — brand panel + form panel |
| `.impeccable/screenshots/home-fixed.jpeg` | /home sau khi fix Tailwind config — 4-col grid, quick actions dominant navy |

---

## Actions taken trong session

1. ✅ Dev server started, navigate tới /login
2. ✅ Autofill demo credentials, attempt login → "Network Error" (expected, backend down)
3. ✅ Inject fake auth vào localStorage, bypass /login
4. ✅ Navigate /home → render OK nhưng grid 1 cột (bug!)
5. ✅ Diagnose: `tailwind.config.ts` thiếu `src/features/**` và `src/lib/**` trong content paths
6. ✅ Fix config, restart dev server
7. ✅ Re-verify /home → 4 cột ✓
8. ❌ Try navigate /orders → redirect về /home (auth timing bug, pre-existing)

---

## Recommended next steps

### P0 (block visual verification toàn app)
1. **Fix auth hydration timing** trong `src/lib/auth/auth-context.tsx` + `src/components/Layout/DashboardLayout.tsx` — thêm `hydrated` state
2. **Hoặc start backend** `localhost:8080` — login thật, xem data thật

### P1
3. Sau khi fix, chạy lại visual verification cho 13 trang còn lại
4. Check responsive: resize browser xuống mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
5. Check dark mode nếu user muốn thêm

### P2
6. Lighthouse audit (performance, a11y, SEO, best practices)
7. Keyboard navigation test (Tab qua tất cả interactive elements)
8. Screen reader test (NVDA/VoiceOver)
9. Reduced-motion test (OS setting → ON → verify animations giảm)
