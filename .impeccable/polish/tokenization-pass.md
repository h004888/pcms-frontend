# Tokenization Pass — Toàn bộ codebase

**Date:** 2026-06-16
**Scope:** 23 files trong `src/`

## Tokens migrated

| Old (Tailwind default) | New (DESIGN.md token) | Files |
|---|---|---|
| `gray-50` → `bg-ink-50` | Surface bg, subtle highlight | 21+ files |
| `gray-100` → `ink-100` | Subtle bg, decorative | 21+ files |
| `gray-200` → `ink-200` | Card/Table border | 21+ files |
| `gray-300` → `ink-300` | Input border | 21+ files |
| `gray-400` → `ink-400` | Icon muted, placeholder | 21+ files |
| `gray-500` → `text-ink-500` | Subtitle, body muted | 21+ files |
| `gray-600` → `text-ink-600` | Table header label | 21+ files |
| `gray-700` → `text-ink-700` | Strong body | 21+ files |
| `gray-900` → `text-ink-900` | Heading, body | 21+ files |
| `medical-50/100/500/600/700/800/900` → `accent-50/100/500/600/700/800/900` | "Đang chạy tốt" / "Success" semantic (was green) | 6+ files |
| `green-100 text-green-800` → `accent-100 text-accent-800` | "PAID", "ACTIVE", "SIGNED" status (was green) | 5 status maps |
| `bg-primary-50` → `bg-ink-50` | Subtle highlight bg | scattered |
| `bg-primary-100` → `bg-ink-100` | Subtle highlight bg | scattered |
| `bg-primary-600` → `bg-ink-900` | Primary button (was blue, now navy) | 3 button instances |
| `text-primary-600` → `text-ink-500` | Decorative icons | 8 icon instances |
| `text-primary-700` → `text-accent-700` | Identifier highlight (SKU, order #) | 5 mono-text instances |
| `hover:text-primary-600` → `hover:text-accent-700` | Link hover | 4 instances |
| `hover:bg-primary-50` → `hover:bg-accent-50` | Subtle hover | 1 instance |
| `focus:ring-primary-` → `focus:ring-accent-` | Focus ring | scattered |
| `focus:border-primary-` → `focus:border-accent-` | Focus border | scattered |

## Files updated (23)

### UI components (3)
- `src/components/Layout/DashboardLayout.tsx` — loading bg + main layout bg
- `src/components/ui/Card.tsx` — Badge `default` variant
- `src/components/ui/Feedback.tsx` — LoadingSpinner + StatCard `primary` color

### Lib (1)
- `src/lib/utils/constants.ts` — ORDER_STATUS_COLORS (PAID → accent), STATUS_COLORS (8 statuses)

### Pages & features (19)
- `src/app/(dashboard)/branches/page.tsx`
- `src/app/(dashboard)/customers/page.tsx`
- `src/app/(dashboard)/medicines/page.tsx`
- `src/app/(dashboard)/users/page.tsx`
- `src/features/branches/components/BranchForm.tsx`
- `src/features/categories/components/CategoriesView.tsx`
- `src/features/customers/components/CustomerForm.tsx`
- `src/features/customers/components/CustomerHistoryView.tsx`
- `src/features/inventory/components/ImportStockForm.tsx`
- `src/features/inventory/components/InventoryList.tsx`
- `src/features/medicines/components/MedicineForm.tsx`
- `src/features/notifications/components/NotificationsView.tsx`
- `src/features/orders/components/NewOrderForm.tsx`
- `src/features/orders/components/OrderDetailView.tsx`
- `src/features/orders/components/OrdersList.tsx`
- `src/features/orders/components/PaymentPage.tsx`
- `src/features/prescriptions/components/PrescriptionsView.tsx`
- `src/features/reports/components/ReportsView.tsx`
- `src/features/search/components/SearchView.tsx`
- `src/features/suppliers/components/SuppliersView.tsx`
- `src/features/users/components/UserForm.tsx`

## Ghost-card sweep

Before: 7 instances (Card, StatCard, Table×3, ListPage, Header menu)
After polish: 0 (except 1 legitimate dropdown in NewOrderForm:173)
After tokenization: still 0

## Verification

- `npx tsc --noEmit` — exit 0
- `npx next lint` — no new warnings (2 pre-existing)
- `grep "gray-\|primary-\|medical-\|green-"` — 0 instances in `src/`
- `grep "shadow.*border\|border.*shadow"` — 1 instance (legitimate dropdown)

## Trade-offs

1. **`primary-` and `medical-` tokens giữ trong `tailwind.config.ts`** — không xóa. Một số file có thể vẫn reference. Future migration: xóa tokens cũ sau khi verify không còn usage.

2. **Semantic colors (yellow/red/blue/purple) giữ nguyên** — yellow=warning, red=danger, blue=info, purple=refunded. Theo Full-palette strategy, chỉ 4 vai màu: Primary (ink), Accent (teal), Status (semantic yellow/red/blue), Neutral (ink ramp). Semantic colors là status role, không phải brand color.

3. **`bg-accent-50 border border-accent-200` thay `bg-accent-50 border-medical-200`** trong PaymentPage — fix nốt medical-200 mà sed bỏ sót.

## Visual change toàn app

| Element | Trước | Sau |
|---|---|---|
| Body text | `text-gray-900` (#111827) | `text-ink-900` (#0f1d3d) — slightly bluer |
| Card/Table border | `border-gray-200` (#e5e7eb) | `border-ink-200` (#c5cce4) — cool tint |
| Input border | `border-gray-300` (#d1d5db) | `border-ink-300` (#9aa3c8) |
| Identifier text (SKU, order #) | `text-primary-700` (blue) | `text-accent-700` (teal) — highlight semantic |
| PAID/ACTIVE/SIGNED status | `bg-green-100 text-green-800` | `bg-accent-100 text-accent-800` (teal) |
| Primary button | `bg-primary-600` (blue) | `bg-ink-900` (navy) |
| Focus ring | `ring-primary-200` (light blue) | `ring-accent-200` (light teal) |
| Page background | `bg-gray-50` | `bg-ink-50` (DashboardLayout loading) hoặc `bg-[--pcms-bg]` (main) |

Net effect: toàn bộ app giờ dùng ink (navy) làm primary brand, accent (teal) cho highlight, ink ramp cho neutrals. Cooler, slightly bluer tone. Bỏ generic Tailwind blue/green. Healthcare brand identity rõ hơn.

## Follow-ups

1. `$impeccable document` scan-mode — cập nhật DESIGN.md với tokens đã resolve
2. `$impeccable audit` re-score — Card, HomeView, ListPage
3. Visual verify: `npm run dev` và check `/login`, `/home`, `/orders`, `/medicines`, `/users`, `/inventory`
4. Sau khi verify OK, có thể xóa `primary` + `medical` tokens khỏi `tailwind.config.ts`
