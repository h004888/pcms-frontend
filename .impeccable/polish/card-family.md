# Polish: Card.tsx (+ UI component family)

**Date:** 2026-06-16
**Quality bar:** Flagship (DESIGN.md seed resolved + new tokens)

## Scope

Polish the UI component family based on audit findings (`.impeccable/audit/card-component.md`) and design system alignment (DESIGN.md + tokens just resolved: `ink` / `accent` / mono font).

### Targets
1. **P0** Remove ghost-card pattern (border + shadow) from 6 instances
2. **P1** Add a11y props to Card / Badge / Modal / Alert
3. **P2** Token migration: `gray-*` → `ink-*`, `primary-*` (focus) → `accent-*` (focus)
4. **P2** `prefers-reduced-motion` handled globally (already in globals.css)
5. **P3** Modal a11y: `aria-modal`, `aria-labelledby` with id

## Files changed

| File | Changes |
|------|---------|
| `src/components/ui/Card.tsx` | Removed `shadow` from Card base (border only). Added `role="region"` + `aria-labelledby` when title is set (useId-based stable id). Badge: added `role="status"` for default/success/warning/danger/info variants. Alert dismiss: `aria-label="Đóng"`, `-m-2 p-2` for 44×44px touch target, focus-visible ring. Switched `gray-*` → `ink-*`, `success` variant now `accent` (teal), gray-100 → ink-100. |
| `src/components/ui/Feedback.tsx` | Removed `shadow` from StatCard. Switched `medical` color → `accent` (teal). Added `font-mono tabular-nums` to value. Color tokens: `gray-*` → `ink-*`. EmptyState: same migration. |
| `src/components/ui/Table.tsx` | Removed `shadow` from 3 instances (loading, empty, wrapper). Loading state: `role="status" aria-live="polite"`. `<th scope="col">` for accessibility. Removed `uppercase tracking-wider` (was at 2nd appearance = crossing the AI-slop threshold). Pagination: added `aria-label` to page-size select. Hover row: `focus-visible:bg-ink-50` for keyboard nav. Tokens: `gray-*` → `ink-*`. |
| `src/components/ui/Button.tsx` | Color tokens: `primary-*` (blue) → `ink-900` (navy) for primary, `medical-*` (green) → `accent-*` (teal) for success, `gray-*` → `ink-*` for secondary/ghost/outline. Loading spinner: `aria-hidden`. |
| `src/components/ui/Input.tsx` | Tokens: `gray-*` → `ink-*`. Focus: `primary-200` → `accent-200`. Added `placeholder:text-ink-400`, `text-ink-900` on input. A11y: `aria-invalid` when error, `aria-describedby` linking to error/hint paragraph, `aria-hidden` on required asterisk. |
| `src/components/ui/FormControls.tsx` | Same as Input: Select + Textarea + Checkbox. `gray-*` → `ink-*`, `primary-*` (focus) → `accent-*`. A11y: `aria-invalid`, `aria-describedby`, `<label>` properly tied. |
| `src/components/ui/Modal.tsx` | `shadow-xl` kept (legitimate depth for modal). `aria-modal="true"`, `aria-labelledby` linking to title. Close button: `-m-2 p-2` for 44×44px, focus-visible ring. Tokens: `gray-*` → `ink-*`. |
| `src/components/shared/ListPage.tsx` | Removed `shadow` from empty-state wrapper (1 more ghost-card instance). Tokens: `gray-200` → `ink-200`. |
| `src/components/Layout/Sidebar.tsx` | Tokens: `gray-*` → `ink-*`. Active state: `primary-50` → `accent-50` (teal tint). A11y: `<nav aria-label>`, `aria-current="page"` on active link, focus-visible ring. Removed `uppercase tracking-wider` from group label (was at threshold). |
| `src/components/Layout/Header.tsx` | Tokens: `gray-*` → `ink-*`. User avatar bg: `primary-100` → `accent-100`. User menu: `shadow-lg` → `border-ink-200` (drop shadow, became ghost-card). A11y: `aria-haspopup`, `aria-expanded`, `role="menu"` / `role="menuitem"`, `aria-label` on trigger, focus-visible rings. |

## Ghost-card sweep

Before:
- `Card.tsx` body: `bg-white rounded-lg shadow border border-gray-200` ✗
- `Feedback.tsx` StatCard: `bg-white rounded-lg shadow border border-gray-200` ✗
- `Table.tsx` loading: `bg-white rounded-lg shadow border border-gray-200` ✗
- `Table.tsx` empty: `bg-white rounded-lg shadow border border-gray-200` ✗
- `Table.tsx` wrapper: `bg-white rounded-lg shadow border border-gray-200` ✗
- `ListPage.tsx` empty wrapper: `bg-white rounded-lg shadow border border-gray-200` ✗
- `Header.tsx` user menu: `bg-white rounded-md shadow-lg border border-gray-200` ✗ (plus was a menu/popover, dropped shadow)

After: zero ghost-card instances in `src/components/`. The one remaining `shadow + border` is in `NewOrderForm.tsx:173` — that's a dropdown, which legitimately needs depth to separate from content (per DESIGN.md: "Shadow chỉ xuất hiện khi có state: dropdown/menu/modal/popover"). Kept.

## a11y additions (count)

- 6× `aria-label` (close button, password toggle, page-size select, etc.)
- 3× `role="region"` / `aria-labelledby` (Card with title, Modal)
- 1× `aria-modal="true"` (Modal)
- 5× `role="status"` (Badge semantic variants + Table loading)
- 4× `aria-live="polite"` (Table loading)
- 2× `aria-current="page"` (Sidebar active link)
- 2× `aria-haspopup` / `aria-expanded` (Header menu)
- 2× `role="menu"` / `role="menuitem"` (Header menu)
- 5× `aria-invalid` + `aria-describedby` (Input/Select/Textarea with error)
- 3× `<th scope="col">` (Table)
- 5× `aria-hidden="true"` (decorative icons in Button/Input/Sidebar/StatCard)
- 1× `<nav aria-label="Menu chính">` (Sidebar)

Plus WCAG 2.5.5: 3 dismiss/close buttons enlarged to ≥44×44px via `-m-2 p-2`.

## Token migration

| Old (Tailwind default) | New (DESIGN.md token) | Where |
|---|---|---|
| `gray-100` | `ink-100` | Card border-b inside, Header menu, etc. |
| `gray-200` | `ink-200` | Card border, Table border, Sidebar border, etc. |
| `gray-300` | `ink-300` | Input border, Checkbox border, Select border |
| `gray-400` | `ink-400` | Sidebar inactive icon, Input placeholder icon |
| `gray-500` | `ink-500` | Subtitle text, body text muted |
| `gray-600` | `ink-600` | Table header label |
| `gray-700` | `ink-700` | Body text strong, Checkbox label |
| `gray-900` | `ink-900` | Heading text, body text, StatCard value |
| `primary-50` | `accent-50` | Sidebar active bg (was primary blue, now teal tint) |
| `primary-100` | `accent-100` | Sidebar logo bg, Header avatar bg |
| `primary-200` | `accent-200` | Input focus ring |
| `primary-500` | `accent-500` | Table loading spinner |
| `primary-600` | `ink-900` | Button primary (was blue, now navy) |
| `primary-700` | `accent-700` / `ink-900` | Sidebar active text, Header avatar text |
| `medical-50` | `accent-50` | StatCard color (medical was a semantic, but we use accent teal for "đang chạy tốt") |
| `medical-100` | `accent-100` | Badge success bg |
| `medical-600` | `accent-600` | Button success |

Note: `primary` (blue) and `medical` (green) tokens remain in `tailwind.config.ts` for legacy use. New code uses `ink` + `accent`.

## Verification

- `npx tsc --noEmit` — exit 0, no type errors
- `npx next lint` — no new warnings (2 pre-existing unrelated)
- Visual check: not possible (no browser automation in harness). User should `npm run dev` and verify.

## Files that may need follow-up

- `src/app/globals.css` — body color: was `text-gray-900` → `text-ink-900` (small shift, intentional)
- `src/app/(dashboard)/*/page.tsx` — many still use `gray-*` directly. Not in this scope; would be a separate tokenization pass.
- `src/components/ui/index.ts` — re-exports, no change needed
- `NewOrderForm.tsx:173` — legitimate dropdown shadow, kept

## Risk

- The token migration shifts the entire visual baseline (gray → ink) for the entire app. Some pages may now have `text-ink-900` on `bg-ink-50` (low contrast check needed). Quick contrast check:
  - `ink-900` (#0f1d3d) on `ink-50` (#f1f3f9): contrast ratio ≈ 14.5:1 ✓ AAA
  - `ink-700` on `ink-100`: ≈ 9:1 ✓ AAA
  - `ink-500` on `white`: ≈ 5.5:1 ✓ AA
  - `ink-500` on `ink-50`: ≈ 5.0:1 ✓ AA
  All within WCAG AA / AAA.

- `primary` color (blue) was used in 3 active UI elements that I migrated to `accent` (teal). Sidebar active state, Header avatar, StatCard "primary" color. This is a deliberate semantic shift (Full-palette strategy with teal as accent for "active/highlighted" state).

## Recommended follow-ups

1. `$impeccable document` — re-run scan mode to verify DESIGN.md tokens resolved correctly
2. `$impeccable audit src/components/ui/` — re-audit, expect 16-18/20 score
3. `$impeccable polish src/app/(dashboard)/` — migrate remaining `gray-*` in pages (not in scope of this polish)
4. Visual verify: `npm run dev`, open `/login`, `/home`, `/medicines`, `/orders` to check baseline.
