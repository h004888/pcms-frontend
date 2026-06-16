# Audit: Card.tsx (and systemic ghost-card pattern)

**Target:** `src/components/ui/Card.tsx` + ghost-card pattern instances in `Feedback.tsx`, `Table.tsx`
**Date:** 2026-06-16

## Diagnostic Scan

### 1. Accessibility (A11y)

**Score: 2/4** (Partial — some a11y effort, significant gaps)

- **No semantic role on Card**: rendered as `<div>`. Sighted users see "card" but screen readers announce nothing. For a card with title + body, recommended: `role="region"` + `aria-labelledby` pointing to title id. Currently the `h3` is unlinked to the body.
- **No programmatic association between Card title and body**: a screen reader user navigating by landmark can't tell which heading belongs to which content block.
- **Title element is `<h3>`** (hard-coded): if a Card is placed under an `<h2>` it works, but if placed in a flat page (no h2 above), it creates a heading-level skip. The Card should accept `titleAs` prop (h2/h3/h4) or compute level from context.
- **Badge component has no semantic role**: status indicators should expose their meaning to assistive tech. `<span class="bg-yellow-100 text-yellow-800">Pending</span>` is announced as "Pending" with no status context. Should be `<span role="status">` or `<span aria-label="Trạng thái: đang chờ">`.
- **Alert dismiss button is text-only "✕"** — technically fine because ✕ is widely understood, but an `aria-label="Đóng"` would be safer (and Modal.tsx has it; Alert.tsx doesn't — inconsistent).
- **No live region for dynamic content inside Card** (e.g. dashboard's recent orders list) — `aria-live="polite"` on Card body if data updates.
- **Color-only status semantics**: Badge variants `default / success / warning / danger / info / gray` use color to convey state. WCAG 1.4.1 (Use of Color) violation if color is the *only* way status is communicated. Currently each badge *also* has text content, so it's actually compliant — but worth noting that this is fragile if a future variant relies on color alone.

**WCAG criteria failing:** 1.3.1 (Info and Relationships — no role/aria-labelledby on Card), 4.1.2 (Name, Role, Value — Badge has no role).

### 2. Performance

**Score: 4/4** (Excellent for this scope)

- Card is a simple div wrapper, no perf cost.
- `clsx` is tree-shakeable, used correctly.
- No memoization needed at this size.
- No layout thrashing, no expensive animations, no bundle bloat.
- StatCard (in Feedback.tsx) similarly clean.

### 3. Theming

**Score: 2/4** (Partial — tokens exist but inconsistently used)

- **`bg-white` hard-coded** on Card body and Alert body — not a token. Any theme switch (dark mode, branded surface) would require touching every Card.
- **`border-gray-200` hard-coded** — same problem. DESIGN.md's "neutral ramp lạnh" commitment lives in prose only; code uses Tailwind's `gray-200` directly.
- **`text-gray-900 / text-gray-500` hard-coded** for title and subtitle — contrast will need recalculation if neutral ramp changes.
- **Badge uses design tokens correctly** (`primary-100`, `medical-100`, etc.) — good.
- **Alert uses design tokens** for variants — good.
- **Mix of `bg-white` and `bg-gray-100` across siblings** (Card body = white, table header = gray-50, modal = white) — inconsistent surface hierarchy.
- **No dark mode support** — project ships light only. Per PRODUCT.md a11y: WCAG 2.1 AA, dark mode is not required. But this is a long-term theming debt.
- **`rounded-lg` (8px)** is the consistent radius. ✓
- No `prefers-color-scheme` handling.

### 4. Responsive Design

**Score: 3/4** (Good — responsive, minor touch target issues)

- **No fixed widths** — Card uses fluid `px-5 py-4` padding, parent controls width via grid.
- **Padding scales appropriately** — Card body has 20px horizontal × 16px vertical, comfortable on mobile.
- **Alert `flex items-start`** keeps icon + text aligned correctly on narrow viewports.
- **Badge `px-2 py-0.5`** is decorative (not interactive), so small size is OK.
- **Alert dismiss button "✕"** has no padding spec — at 14–16px font size, the clickable area is roughly 14×14px. WCAG 2.5.5 (Target Size) minimum is 44×44px. **Failing for touch users.**
- **Card title h3 doesn't truncate** — very long titles could overflow on narrow viewports. No `truncate` or `line-clamp` applied.
- **No breakpoints defined inside Card** — relies entirely on parent grid/flex. That's correct, but means Card must be tested under tight parent constraints.

**WCAG criteria failing:** 2.5.5 (Target Size — Alert dismiss button).

### 5. Anti-Patterns

**Score: 1/4** (Heavy AI aesthetic — 1 systemic tell: ghost-card)

**Critical anti-pattern: Ghost-card.** The literal codex defect from parent SKILL.md: `border: 1px solid X` + `box-shadow: 0 Npx Mpx ...` on the same element. M ≥ 16px not required — the *combination* itself is the tell.

Instances confirmed in this audit (and expanded beyond the target file):

| File | Line | Code |
|------|------|------|
| `src/components/ui/Card.tsx` | 18 | `bg-white rounded-lg shadow border border-gray-200` |
| `src/components/ui/Feedback.tsx` | 66 | `bg-white rounded-lg shadow border border-gray-200 p-5` (StatCard) |
| `src/components/ui/Table.tsx` | 33 | `bg-white rounded-lg shadow border border-gray-200 p-8 text-center` (loading) |
| `src/components/ui/Table.tsx` | 42 | `bg-white rounded-lg shadow border border-gray-200 p-8 text-center` (empty) |
| `src/components/ui/Table.tsx` | 49 | `bg-white rounded-lg shadow border border-gray-200 overflow-hidden` (table wrapper) |

**5 instances across 3 files.** The pattern is repeated verbatim, suggesting it's a "house style" copy-pasted from a tutorial rather than a deliberate choice. The codex defect is that border *and* shadow together look generic-SaaS — borders OR shadows, not both. Per DESIGN.md absolute ban.

**Other anti-patterns:** None found in Card.tsx scope.
- No gradient text ✓
- No glassmorphism ✓
- No emoji ✓
- No sketchy SVG ✓
- `rounded-lg` (8px) is within ≤16px ceiling ✓
- No `bg-clip-text` ✓

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|------------|
| 1 | Accessibility | 2 | No `role`/`aria-labelledby` on Card; Badge has no status role; Alert dismiss button is < 44×44px |
| 2 | Performance | 4 | Card is simple div, no perf concerns |
| 3 | Theming | 2 | `bg-white`, `border-gray-200`, `text-gray-900/500` hard-coded; no design tokens for surfaces |
| 4 | Responsive | 3 | No fixed widths, good padding; Alert dismiss touch target too small |
| 5 | Anti-Patterns | 1 | **Ghost-card pattern in 5 instances** (Card, StatCard, Table loading/empty/wrapper) |
| **Total** | | **12/20** | **Acceptable — significant work needed, focused on anti-pattern cleanup and a11y** |

## Anti-Patterns Verdict

**Pass/fail: FAIL.** This component family carries a structural AI tell: the ghost-card pattern. The repeated `rounded-lg shadow border border-gray-200` string is verbatim the codex defect. Beyond Card.tsx, it propagates to StatCard, Table loading state, Table empty state, and Table wrapper — five places. Fixing Card.tsx alone won't fix the systemic problem; the audit scope expanded to Feedback.tsx and Table.tsx because the same string appears there.

## Executive Summary

- **Audit Health Score:** 12/20 (Acceptable)
- **Total issues found:** 7 (P0: 1, P1: 3, P2: 2, P3: 1)
- **Top issues:**
  1. [P0] Ghost-card pattern repeats in 5 components — systemic anti-pattern, copy-paste from same source
  2. [P1] Card has no semantic role or aria-labelledby tying title to body
  3. [P1] Badge has no semantic role for status communication
  4. [P1] Alert dismiss button is below 44×44px touch target
  5. [P2] Hard-coded `bg-white` / `border-gray-200` / `text-gray-*` instead of design tokens
- **Recommended next steps:** Fix the ghost-card string in one place, then propagate. Add a11y props to Card/Badge/Alert. Move from Tailwind gray-* to token names once the Full-palette seed is resolved.

## Detailed Findings by Severity

### [P0] Ghost-card pattern repeats in 5 components
- **Location:** `Card.tsx:18`, `Feedback.tsx:66`, `Table.tsx:33`, `Table.tsx:42`, `Table.tsx:49`
- **Category:** Anti-Pattern
- **Impact:** All cards/tables on the platform share the same generic "shadow + border" look. Reduces visual hierarchy (everything looks equally lifted), contradicts DESIGN.md absolute ban, and signals AI-default chrome to anyone fluent in dashboard design.
- **WCAG/Standard:** DESIGN.md absolute ban: "border HOẶC shadow, không cả hai".
- **Recommendation:** Pick one default — **border only** is the safer choice for product UI (flat-by-default, less visual noise). Drop `shadow` from the 5 instances. For Modal (which legitimately needs depth to separate from page), keep `shadow-xl` but drop `border`. Define a `<Card>` base class in `globals.css` and use it consistently.
- **Suggested command:** `$impeccable polish` (fix once, propagate) or `$impeccable layout` (refactor with care for systemic impact).

### [P1] Card has no semantic role or aria-labelledby
- **Location:** `Card.tsx:13-18`
- **Category:** Accessibility
- **Impact:** Screen reader users navigating by landmark can't identify which card is which. Card with "Đơn hàng gần đây" is announced as a generic region with no name.
- **WCAG/Standard:** WCAG 1.3.1 (Info and Relationships), 4.1.2 (Name, Role, Value)
- **Recommendation:** Add `role="region"` and `aria-labelledby={titleId}` when `title` is provided. Generate a stable id from title (slugified) or accept an explicit `ariaLabelledBy` prop.
- **Suggested command:** `$impeccable harden` (production-grade a11y).

### [P1] Badge has no semantic role for status
- **Location:** `Card.tsx:55-58`
- **Category:** Accessibility
- **Impact:** Status communicated by color + text. The text is read by screen reader ("Pending"), but the status *category* (success/warning/danger) is lost. A pharmacist using screen reader hears "Pending" but not "Status: warning" — they can't distinguish pending-order from expiring-batch without context.
- **WCAG/Standard:** WCAG 1.3.1, 4.1.2
- **Recommendation:** Add `role="status"` (or `role="note"` for non-critical). Better: prepend the status to the visible text: e.g. `Cảnh báo: 2 lô sắp hết hạn` instead of just `2 lô`. Less code, more accessible.
- **Suggested command:** `$impeccable clarify` (copy + label review).

### [P1] Alert dismiss button below 44×44px touch target
- **Location:** `Card.tsx:84-86`
- **Category:** Accessibility
- **Impact:** Pharmacist on tablet (POS context) cannot reliably tap the small ✕ button. WCAG 2.5.5 minimum is 44×44 CSS pixels. Currently the button is roughly 14×14.
- **WCAG/Standard:** WCAG 2.5.5 (Target Size, Level AAA — but increasingly the de facto standard for touch UIs)
- **Recommendation:** Add `min-w-[44px] min-h-[44px] flex items-center justify-center` to the dismiss button, and visually pad the ✕ glyph with `p-2` (or larger). Visual click target and accessible target can be the same by using a larger padded button.
- **Suggested command:** `$impeccable adapt` (responsive + touch).

### [P2] Hard-coded Tailwind gray-*/white instead of design tokens
- **Location:** `Card.tsx:18, 50, 52, 66, 75, 84` and across the codebase
- **Category:** Theming
- **Impact:** When the Full-palette seed is resolved (navy/indigo primary, teal accent, semantic status), every gray-* reference will need re-evaluation for contrast against the new surfaces. Refactor cost compounds.
- **WCAG/Standard:** None directly; affects future maintainability
- **Recommendation:** Introduce semantic tokens in `globals.css` (e.g. `--surface-card: #ffffff`, `--border-subtle: #e5e7eb`, `--text-primary: #111827`, `--text-muted: #6b7280`) and reference via Tailwind's `theme.extend.colors` mapping. Then refactor Card to use tokens. This is medium-effort but pays off for every subsequent variant.
- **Suggested command:** `$impeccable document` (re-run in scan mode after refactor) or `$impeccable polish` if combined with ghost-card fix.

### [P2] No `prefers-reduced-motion` handling
- **Location:** Card itself has no animation, but `Feedback.tsx` has `animate-spin` (LoadingSpinner) and `animate-pulse` is implied for skeleton states; `Table.tsx:34` has `animate-spin`
- **Category:** Accessibility
- **Impact:** User with reduced-motion OS setting still sees infinite spinner. WCAG 2.3.3 (Animation from Interactions) recommends honoring this preference.
- **WCAG/Standard:** WCAG 2.3.3
- **Recommendation:** Add `@media (prefers-reduced-motion: reduce) { .animate-spin, .animate-pulse { animation: none; } }` to `globals.css`. Or replace spinner with static "Đang tải..." text under reduced motion.
- **Suggested command:** `$impeccable harden`.

### [P3] Card title `<h3>` level is hard-coded
- **Location:** `Card.tsx:21`
- **Category:** Accessibility (heading hierarchy)
- **Impact:** If Card is the only container on a page (no h1/h2 above), it creates a heading-level skip (h1 → h3). Rare in practice because Card lives inside dashboard pages that always have an h1, but worth fixing.
- **WCAG/Standard:** WCAG 1.3.1 (heading order)
- **Recommendation:** Accept a `titleAs` prop ('h2' | 'h3' | 'h4'), default 'h3'. Or use `<h2>` for top-level Cards and `<h3>` for nested.
- **Suggested command:** `$impeccable polish` (low priority — bundled with other Card fixes).

## Patterns & Systemic Issues

1. **"border + shadow" string copy-pasted 5 times.** This is a house style that escaped review. Fix the Card component once, then propagate. Adding a `card-base` class in `globals.css` and using it everywhere would prevent recurrence.

2. **Hard-coded Tailwind gray-* for surfaces.** Card, StatCard, Table all use `bg-white border-gray-200 text-gray-900 text-gray-500`. When the DESIGN.md "Full palette" seed resolves into actual hex values, every one of these will need a token. Refactor preemptively.

3. **Inconsistent a11y props across similar components.** Modal has `aria-label="Đóng"`; Alert's dismiss button doesn't. Card has no role; Alert has `role="alert"`. There's a partial a11y effort but no consistent pattern. Define a checklist per component type.

4. **No animation a11y handling at all.** Across the codebase, `animate-spin` and `animate-pulse` are used freely. No `prefers-reduced-motion` rules anywhere. This will be a recurring audit finding until handled.

## Positive Findings

1. **`rounded-lg` (8px) consistent across Card family** — within the ≤16px ceiling from parent SKILL.md. No codex "32px+" tell.
2. **Alert correctly uses `role="alert"`** — good baseline a11y.
3. **Modal correctly uses `shadow-xl` only (no border)** — the right pattern, just not propagated to Card.
4. **No gradient text, no glassmorphism, no emoji, no sketchy SVG** in any component — the codebase is broadly free of decorative slop.
5. **clsx used correctly** for conditional classes — clean composition.

## Recommended Actions

1. **[P0] `$impeccable polish src/components/ui/Card.tsx`**: Remove `shadow` from Card base class. Drop `shadow` from `Feedback.tsx:66` (StatCard) and `Table.tsx:33, 42, 49`. One edit each. Result: 5 ghost-card instances gone, all cards uniformly border-only. This is a quick, high-leverage fix.
2. **[P1] `$impeccable harden src/components/ui/Card.tsx`**: Add `role="region"` + `aria-labelledby` to Card. Add `role="status"` to Badge. Add `min-w-[44px] min-h-[44px]` to Alert dismiss button. Address all P1 a11y in one pass.
3. **[P2] `$impeccable harden src/app/globals.css`**: Add `prefers-reduced-motion` rule to suppress `animate-spin` and `animate-pulse` under user preference.
4. **[P2] `$impeccable document`**: Re-run in scan mode after ghost-card + a11y fixes. Will resolve hex/OKLCH for the Full-palette seed and replace DESIGN.md seed with concrete values.
5. **[P3] `$impeccable polish`**: Final pass for any residual issues — Card title h-level, hard-coded grays if budget allows.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
> Re-run `$impeccable audit` after fixes to see your score improve.
