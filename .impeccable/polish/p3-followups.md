# Polish P3 follow-ups — close out

**Date:** 2026-06-16
**Scope:** 3 small a11y / API improvements

## Changes

### 1. Card `titleAs` prop
- **File:** `src/components/ui/Card.tsx`
- **Before:** Title cứng `<h3>` — có thể tạo heading-level skip khi Card lồng trong page đã có h1 hoặc section đã có h2.
- **After:** Accept `titleAs?: 'h1' | 'h2' | 'h3' | 'h4'`, default 'h3'. Render heading element theo prop.
  - `h1` — Card là container chính của page (hiếm; page thường có h1 riêng)
  - `h2` — Card là section chính (vd: dashboard panels)
  - `h3` (mặc định) — sub-section
  - `h4` — Card lồng trong section đã có h2
- Visual scale: h1 text-2xl tracking-tight, h2 text-xl tracking-tight, h3/h4 text-base (giữ nguyên).

### 2. Header avatar aria-label
- **File:** `src/components/Layout/Header.tsx`
- **Before:** `aria-label="Mở menu tài khoản"` — không cho screen reader biết user là ai. Avatar div hiển thị first letter.
- **After:** `aria-label={`Tài khoản: ${state.user?.fullName || 'Guest'}``. Avatar div có `aria-hidden="true"` (decorative).
- Bonus: focus ring `ring-offset-1` → `ring-offset-2` (mạnh hơn cho WCAG focus visibility).

### 3. Table row keyboard navigation
- **File:** `src/components/ui/Table.tsx`
- **Before:** Click-only trên row. `<tr>` không nhận focus native nên keyboard user không thể Enter vào row.
- **After:** Khi `onRowClick` được provide:
  - `tabIndex={0}` — row focusable
  - `role="button"` — screen reader announce as button
  - `aria-label="Mở chi tiết {firstColumnValue}"` — context cho screen reader
  - `onKeyDown` — Enter/Space trigger onRowClick
  - `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500` — visual focus indicator bên trong row (ring-inset)

## Verification

- `npx tsc --noEmit` — exit 0
- `npx next lint` — no new warnings (2 pre-existing)
- 3 small targeted edits

## Net a11y improvement

| Change | A11y benefit |
|---|---|
| Card titleAs | Correct heading hierarchy in all contexts (WCAG 1.3.1) |
| Header aria-label | Screen reader announces user identity, not just "menu" |
| Table row keyboard | Power users / motor-impaired users can navigate data tables without mouse |

## Files documentation

```
.impeccable/polish/p3-followups.md   ← this file
```

## Recommended follow-ups (not in this scope)

1. **Tooltip cho metric trong HomeView** — "Tồn kho thấp" so với gì (so với minStockLevel). Tăng Recognition score.
2. **Keyboard shortcut Cmd+N** — cho "Tạo đơn hàng" quick action. Tăng Efficiency score.
3. **Cmd+K command palette** — cho 5 vai trò. Power user feature lớn.
4. **Focus ring AAA contrast** — bump ring-accent-500 sang ring-accent-700 (7:1) cho body focus.
5. **Cached data fallback** — khi error, hiển thị data cũ nếu có. Error Recovery nâng lên 4.
6. **Backend 2 endpoint** — `pendingOrders` + `expiringBatches` cho HomeView metrics mới.

Hoặc nếu user muốn tiếp, có thể craft orders page (next biggest surface) hoặc chạy live mode (cần browser).
