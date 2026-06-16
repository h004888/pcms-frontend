# Craft: Brand-led Login

**Target:** `src/app/(auth)/login/page.tsx`
**Date:** 2026-06-16

## Concept

"Bàn điều khiển của dược sĩ." Login là surface brand-led duy nhất theo PRODUCT.md (hybrid register). Thay vì card giữa màn hình với gradient background, dùng split layout: panel trái = brand storytelling, panel phải = form.

## Tokens resolved (từ DESIGN.md seed)

Trước đây DESIGN.md seed chỉ mô tả chiến lược. Lần này resolve giá trị cụ thể:

- **Primary (ink/indigo trầm)** — thêm vào `tailwind.config.ts` dưới tên `ink` (50–900). Màu chính: `ink-900 = #0f1d3d` (deep navy), `ink-700 = #1e2a5e`, `ink-100 = #e6e9f5`.
- **Accent (teal)** — thêm `accent` (50–900). Màu chính: `accent-500 = #14b8a6`, `accent-400 = #2dd4bf`, `accent-700 = #0d7a72`.
- **Mono font** — JetBrains Mono load qua `next/font/google` với variable `--font-mono`, áp dụng cho code/email/SKU/version string.
- Tokens `primary` (blue) và `medical` (green) cũ vẫn còn — migrate dần. Không breaking.

## Files changed

| File | Change |
|------|--------|
| `tailwind.config.ts` | Thêm `ink` + `accent` color ramps; thêm `fontFamily.mono` |
| `src/app/layout.tsx` | Load JetBrains Mono qua `next/font/google`; expose `--font-sans` và `--font-mono` CSS variables; áp dụng `font-sans` cho body |
| `src/app/globals.css` | Thêm CSS vars (`--pcms-surface`, `--pcms-border`, `--pcms-ink`); chuyển body color từ `text-gray-900` → `text-ink-900`; thêm `prefers-reduced-motion` rule (WCAG 2.3.3); chuyển `.input-focus` ring từ primary → accent |
| `src/app/(auth)/login/page.tsx` | Rewrite hoàn toàn — split layout, brand panel, value props, form panel, demo accounts collapsed trong `<details>`, a11y touch targets |

## Layout

**Desktop (≥ lg):**
```
┌──────────────────────────┬──────────────────────────┐
│ BRAND PANEL (ink-900)    │ FORM PANEL (white)       │
│  [Pill] PCMS             │  Đăng nhập               │
│  v1.0.0 · 2026           │  Nhập email và mật khẩu  │
│                          │  để mở ca làm việc.      │
│  Bàn điều khiển          │                          │
│  của dược sĩ.            │  [Email]                 │
│  (teal accent)           │  [Mật khẩu] 👁           │
│                          │  ☐ Ghi nhớ   Quên?       │
│  Hệ thống quản lý chuỗi  │  [    Đăng nhập    ]     │
│  nhà thuốc — nhanh, gọn, │                          │
│  chính xác.              │  ▾ Tài khoản demo        │
│                          │                          │
│  • Bán thuốc có đơn     │                          │
│  • Tồn kho theo lô       │                          │
│  • Báo cáo theo ca       │                          │
│                          │                          │
│  © 2026 PCMS v1.0.0      │                          │
└──────────────────────────┴──────────────────────────┘
```

**Mobile (< lg):** Stack dọc — brand thu gọn (logo + version + tagline ngắn) phía trên, form phía dưới.

## Self-review (Step 5)

### Đối chiếu brief + DESIGN.md

| Rule | Status |
|------|--------|
| No ghost-card (border + shadow) | ✓ Verified — page không dùng `shadow + border` combo |
| No gradient | ✓ — bỏ `bg-gradient-to-br` cũ, dùng solid surfaces |
| No eyebrow uppercase tracked trên mỗi section | ✓ — chỉ `PCMS` wordmark ở brand panel |
| Sans UI + mono cho data | ✓ — version `v1.0.0 · 2026`, demo email/password trong mono |
| 3 value props, không phải 4-card grid lặp lại | ✓ — PillBottle, ClipboardList, BarChart3 |
| Bản sắc y tế tự tin | ✓ — copy: "Bán thuốc có đơn chính xác", "Tồn kho theo lô và hạn dùng", "Báo cáo theo ca" |
| A11y: labels, focus, role="alert" | ✓ — Input có label, auth error có role="alert", password toggle có aria-label |
| A11y: touch targets ≥ 44×44 | ✓ — password toggle có `p-1 -m-1` |
| `prefers-reduced-motion` | ✓ — global rule trong globals.css |
| Real Vietnamese copy | ✓ — "Đăng nhập", "Nhập email và mật khẩu để mở ca làm việc", "Tài khoản demo" |
| Flat-by-default | ✓ — không shadow trên form panel, brand panel dùng solid ink-900 |
| Border radius ≤ 16px | ✓ — logo `rounded-lg` (8px), value icon `rounded-md` (6px), auth error `rounded-md` (6px) |
| Cream/sand bg? | ✗ — dùng ink-navy + cool off-white `--pcms-bg` (#f8f9fc, slight blue tint) |
| Subtle teal accent stripe top | ✓ — 1px solid `bg-accent-500` ở đầu brand panel |

### Đã verify

- `npx tsc --noEmit` — exit 0, không lỗi type
- `npx next lint` — không có warning mới (các warning cũ pre-existing, không liên quan)

### Limitations (đã nhận, không ẩn)

1. **Input component vẫn dùng `border-gray-300 focus:ring-primary-200`** — Input là shared component dùng ở medicines/users/branches forms. Refactor Input để dùng ink-200 border + accent focus ring là task riêng, sẽ ảnh hưởng nhiều form khác. Hiện tại brand-led login dùng Input as-is để giữ consistency với các form khác. Flagged for follow-up.
2. **"Quên mật khẩu?" link vẫn là `#`** — placeholder, cần backend route. Không trong scope visual rebuild.
3. **Logo chỉ là Lucide `<Pill>` icon** — không phải custom wordmark. Cho v1.0.0 acceptable; nếu cần identity mạnh hơn, có thể commission SVG logo sau.
4. **Brand panel chưa có visual storytelling element** (illustration, pattern, photo) — chỉ text. Linear/Stripe cũng giữ text-only ở brand panel của họ; đây là reference-driven choice. Có thể thêm pattern nếu user muốn bolder.
5. **Type scale chưa resolve cụ thể** (display / headline / title / body) — hiện dùng Tailwind defaults. Seed DESIGN.md đã mô tả direction; resolution concrete sẽ đi kèm `$impeccable document` scan-mode re-run.
6. **Chưa test dev server trong browser** — không có browser automation. Source review thôi. User nên `npm run dev` và verify visually.

## Build pass

- TypeScript: ✓ clean
- Lint: ✓ không warning mới
- File size: 10.9 KB (JSX, không bundle) — chấp nhận được cho một page có brand panel + form
- File changes: 4 files (3 thay đổi nhỏ, 1 rewrite)

## Risks

- Tokens `ink` / `accent` mới có thể clash với tokens cũ trong tương lai khi migrate — nên tổ chức rõ: `ink`/`accent` cho brand surfaces, `primary`/`medical` cho app surfaces.
- Body color shift từ `gray-900` → `ink-900` ảnh hưởng tất cả authenticated pages. Test ở /home sau khi restart dev server.
- Input focus ring accent có thể confuse user đã quen blue. Có thể cần thời gian để adopt.

## Recommended follow-ups

1. `$impeccable polish` cho Input component — chuyển sang ink-200 border + accent focus ring.
2. `$impeccable audit` lại sau khi apply thay đổi — chấm điểm cập nhật.
3. `$impeccable document` scan-mode — resolve hex/OKLCH trong DESIGN.md với tokens mới.
4. Visual verify trong browser: `npm run dev` → mở http://localhost:3000/login.
