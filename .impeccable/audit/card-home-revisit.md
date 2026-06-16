# Re-audit: Card.tsx + HomeView.tsx (sau polish + tokenization + document)

**Date:** 2026-06-16
**Scope:** 2 file đã qua nhiều round cải thiện

---

## So sánh điểm

| Target | Trước (audit gốc) | Sau (re-audit) | Δ |
|---|---|---|---|
| `Card.tsx` (với Feedback.tsx, Table.tsx) | **12/20** (Acceptable) | **18/20** (Excellent) | **+6** |
| `HomeView.tsx` (với critique 20/40) | **20/40** (Acceptable) | **~30/40** (Good) | **+10** |

---

## Card.tsx + family — 18/20

| # | Dimension | Trước | Sau | Lý do |
|---|---|---|---|---|
| 1 | Accessibility | 2 | **3** | Card có `role="region" + aria-labelledby`; Badge có `role="status"` cho semantic variants; Alert dismiss 44×44px; aria-modal + aria-labelledby trên Modal; aria-invalid + aria-describedby trên Input/Select/Textarea; aria-current="page" trên Sidebar; aria-haspopup + aria-expanded + role=menu trên Header. Còn thiếu: <th scope> trên Header row (chỉ ở Table). Skip lên 4 cần AAA focus customization. |
| 2 | Performance | 4 | **4** | Không có gì thay đổi. Đơn giản, không bundle bloat. |
| 3 | Theming | 2 | **4** | `gray-*` → `ink-*` xong toàn bộ (23 files). `primary-*` (focus) → `accent-*` (focus). `medical-*` (green) → `accent-*` (teal). Page bg `--pcms-bg` = cool off-white. Status semantics có ramp riêng. Tokens giờ consistent. |
| 4 | Responsive | 3 | **3** | Không có thay đổi lớn. Input/Button/Modal đã có 44px touch target. Card padding scale OK. Skip lên 4 cần breakpoint audit chi tiết hơn. |
| 5 | Anti-Patterns | 1 | **4** | **Ghost-card: 7 instances → 0.** Modal giữ `shadow-xl` (legitimate). Dropdown giữ `shadow-lg` (legitimate). 0 gradient text, 0 glassmorphism, 0 emoji decoration lặp lại, 0 rounding > 16px. Uppercase tracking-wider giảm từ 2 nơi → 0 nơi eyebrow (còn 2 chỗ là PCMS wordmark + time-of-day eyebrow trong HomeView, cả hai đều mono — intentional brand). |
| **Total** | | **12/20** | **18/20** | **+6 — đạt Excellent (minor polish only)** |

### Cải thiện cụ thể

| Metric | Trước | Sau |
|---|---|---|
| Ghost-card instances | 5 | 0 |
| `gray-*` references trong UI components | 30+ | 0 |
| `primary-*` references trong UI components | 12+ | 0 |
| `uppercase tracking-wider` decorative | 2 | 0 (còn 2 intentional brand) |
| A11y attributes added | 0 | 30+ |
| Touch targets < 44px | 2 (Alert dismiss, Modal close) | 0 |
| `prefers-reduced-motion` | 0 | 1 (global rule) |

### Còn lại (P3 — minor polish)

- **Focus ring customization**: Hiện dùng default Tailwind `ring-accent-500` (4.5:1 trên white = AA). Để đạt AAA, có thể tăng ring width hoặc contrast.
- **Card title h-level**: Hiện cứng `<h3>`. Nên accept `titleAs` prop cho nested contexts. Đã note trong audit gốc.
- **Header avatar aria-label**: Hiện không có. Screen reader đọc "T" (first letter). Nên `aria-label={state.user?.fullName}`.
- **Table `<th scope="row">`**: Có `scope="col"` ở column header, chưa có `scope="row"` ở row header. Nếu có cột "STT" hoặc "#" thì cần scope="row".

---

## HomeView.tsx — ước lượng ~30/40

### Nielsen heuristics (re-score)

| # | Heuristic | Trước | Sau | Lý do |
|---|---|---|---|---|
| 1 | Visibility of System Status | 2 | **3** | Skeleton thay spinner (visible feedback), `aria-live="polite"` trên metrics section, error state với Alert + retry CTA. Còn thiếu: progress cho retry đang chạy (nên có button loading state). |
| 2 | Match Between System and Real World | 3 | **4** | Tiếng Việt + thuật ngữ dược. Time-of-day greeting ("Ca sáng · Thứ Hai, 16 tháng 6") + "{lastName}, sẵn sàng cho ca làm việc" — natural, contextual. "Tạo đơn đầu tiên" CTA trong empty state. "Lô sắp hết hạn" metric pharmacy-specific. |
| 3 | User Control and Freedom | 2 | **3** | Retry CTA trong error state. Empty state có "Tạo đơn đầu tiên" link. Recent orders + low stock click vào chi tiết. Còn thiếu: undo cho destructive actions (nhưng không có destructive actions trên dashboard). |
| 4 | Consistency and Standards | 3 | **4** | Cùng Card, StatCard, Button, Alert như toàn app. Quick actions: 1 primary (ink-900) + 3 outline (white + ink-200 border) — flat-by-default, equal weight among secondary. |
| 5 | Error Prevention | 2 | **3** | Error state với Alert + retry CTA. Còn thiếu: confirm dialog (không có destructive trên dashboard). Skeleton visible during load (user không click trong khi load). |
| 6 | Recognition Rather than Recall | 3 | **3** | 4 metric, quick actions, recent orders + low stock list. Có thể cải thiện: tooltip giải thích "Tồn kho thấp" so với gì (so với minStockLevel?). |
| 7 | Flexibility and Efficiency | 1 | **2** | Skeleton không chặn cả page (user có thể click quick actions trong khi load). Recent orders click vào chi tiết. Còn thiếu: keyboard shortcut cho "Tạo đơn hàng" (Cmd+N). |
| 8 | Aesthetic and Minimalist | 2 | **4** | **8 StatCard → 4** theo role dược sĩ. Quick actions: **1 primary + 3 outline** thay vì 4 màu pastel cạnh tranh. Flat-by-default surface. Greeting context-aware, no emoji. |
| 9 | Error Recovery | 1 | **4** | Error Alert với "Thử lại" button inline. Cùng status với success. Có thể cải thiện: cached data fallback khi offline. |
| 10 | Help and Documentation | 1 | **2** | Empty state có CTA (guidance thay vì blank). Time-of-day greeting làm context. Còn thiếu: tooltip cho từng metric. |
| **Total** | | **20/40** | **~30/40** | **+10 — Acceptable → Good** |

### Cải thiện cụ thể

| Metric | Trước | Sau |
|---|---|---|
| 8 StatCard hero-metric template | ✗ | **4 StatCard, role-focused** |
| 4 pastel quick-actions | ✗ | **1 primary + 3 outline (flat)** |
| Loading = full spinner | ✗ | **4 Skeleton + 2 ListSkeleton** |
| Error = console.error only | ✗ | **Alert + retry CTA + aria-live** |
| Greeting 👋 + first-name | ✗ | **Time-of-day + last-name, no emoji** |
| "Tổng đơn" duplicate | ✗ | **Replaced với "Lô sắp hết hạn"** |
| Empty state text-only | ✗ | **Icon + text + CTA "Tạo đơn đầu tiên"** |
| aria-live | 0 | **2 (metrics + error retry button aria-hidden)** |
| Quick actions: 4 màu pastel | ✗ | **1 primary ink-900 + 3 outline** |

### Còn lại (P2 — minor improvement)

- **Tooltip cho metric**: "Tồn kho thấp" so với gì? (so với minStockLevel của từng lô) — thêm tooltip sẽ tăng Recognition score.
- **Keyboard shortcut**: Cmd+N cho "Tạo đơn hàng" — tăng Efficiency score.
- **Time-of-day accuracy**: Dùng `new Date().getHours()` local — nếu user ở múi giờ khác có thể lệch. Có thể dùng server time.
- **Cached data fallback**: Khi error, hiển thị data cũ nếu có (improvement lên 9 Error Recovery).
- **Cmd+K command palette**: Bước tiếp theo của Efficiency (cả 5 vai trò đều được lợi).

---

## Cross-target observations

### Đã đạt (theo original audit findings)

| Audit gốc issue | Status |
|---|---|
| Ghost-card pattern (P0) | ✅ 7 instances → 0 |
| Card role/aria-labelledby (P1) | ✅ Fixed |
| Badge status role (P1) | ✅ Fixed |
| Alert dismiss < 44px (P1) | ✅ Fixed (Modal too) |
| Hard-coded gray-* (P2) | ✅ 23 files migrated |
| No prefers-reduced-motion (P2) | ✅ Global rule in globals.css |
| Card title h-level (P3) | ⚠️ Chưa fix (P3) |

### Đã đạt (theo original critique findings)

| Critique issue | Status |
|---|---|
| 8 StatCard hero-metric (P0) | ✅ 4 metric, role-focused |
| Error fetch im lặng (P0) | ✅ Alert + retry |
| 4 pastel quick-actions (P1) | ✅ 1 primary + 3 outline |
| Ghost-card 5 nơi (P1) | ✅ 0 instances |
| "Tổng đơn" duplicate (P2) | ✅ Replaced |
| Greeting 👋 (P2) | ✅ Context-aware, no emoji |
| Loading = spinner (P2) | ✅ Skeleton |

### Cải thiện toàn codebase

| Metric | Original | Sau 5 round |
|---|---|---|
| `gray-*` references | 100+ | 0 |
| `primary-*` (legacy blue) | 30+ | 0 (still in config for legacy) |
| `medical-*` (legacy green) | 10+ | 0 |
| Ghost-card pattern | 7 | 0 |
| `uppercase tracking-wider` (decorative) | 2 | 0 |
| `prefers-reduced-motion` | 0 | 1 (global) |
| A11y attributes | 1 (Modal close) | 30+ |
| Tokens resolved in DESIGN.md | 0 | 31 hex + 7 typography roles + 16 component variants |

---

## Verdict

**Card family**: 12/20 → **18/20 (Excellent)** — minor polish only.
**HomeView**: 20/40 → **~30/40 (Good)** — major issues resolved, room for tooltip + keyboard shortcut.

Toàn codebase đã đồng bộ với design system mới. Hai anti-pattern lớn (ghost-card, AI-slop template) đã fix. Healthcare brand identity (ink navy + teal accent) rõ ràng.

## Risks / known limitations

1. **Visual verify chưa làm** — không có browser automation. User cần `npm run dev` + mở các trang để xác nhận.
2. **Performance chưa đo** — chỉ structural review, chưa chạy Lighthouse / Web Vitals.
3. **Dark mode chưa có** — DESIGN.md không cam kết. Có thể thêm nếu user muốn.
4. **Tooltip + keyboard shortcut** — P2 follow-up, cải thiện HomeView lên 32-34/40.

## Recommended next commands

1. `$impeccable polish` follow-ups còn lại (P3): focus ring AAA, Card titleAs, Header avatar aria-label, Table th scope="row".
2. `$impeccable craft` orders page (next biggest surface).
3. `$impeccable live` — pick element, iterate trong browser.
4. Backend: 2 endpoint `pendingOrders` + `expiringBatches` để 2 metric mới có data thật.
