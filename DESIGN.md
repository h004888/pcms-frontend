---
name: "PCMS Design System"
description: "Hệ thống thiết kế cho PCMS — Pharmacist's Workbench. Hiện đại, nhanh, gọn."
colors:
  # === Page surfaces (cool off-white, slight blue tint) ===
  page-bg: "#f8f9fc"
  surface: "#ffffff"

  # === Primary: ink (deep navy/indigo) ===
  # Brand surface, primary button, heading text
  ink-50:  "#f1f3f9"
  ink-100: "#e6e9f5"
  ink-200: "#c5cce4"
  ink-300: "#9aa3c8"
  ink-400: "#6b75a8"
  ink-500: "#475089"
  ink-600: "#2f3870"
  ink-700: "#1e2a5e"
  ink-800: "#141d49"
  ink-900: "#0f1d3d"

  # === Accent: teal ===
  # Focus ring, active link, success semantic, identifier highlight
  accent-50:  "#f0fdfa"
  accent-100: "#ccfbf1"
  accent-200: "#99f6e4"
  accent-300: "#5eead4"
  accent-400: "#2dd4bf"
  accent-500: "#14b8a6"
  accent-600: "#0d9488"
  accent-700: "#0d7a72"
  accent-800: "#115e59"
  accent-900: "#134e4a"

  # === Status (semantic — không thay thế nhau) ===
  warning-50:  "#fefce8"
  warning-100: "#fef9c3"
  warning-500: "#eab308"
  warning-700: "#a16207"
  warning-800: "#854d0e"
  danger-50:   "#fef2f2"
  danger-100:  "#fee2e2"
  danger-500:  "#ef4444"
  danger-600:  "#dc2626"
  danger-700:  "#b91c1c"
  danger-800:  "#991b1b"
  info-50:     "#eff6ff"
  info-100:    "#dbeafe"
  info-500:    "#3b82f6"
  info-700:    "#1d4ed8"
  info-800:    "#1e40af"
  distinct-50: "#faf5ff"
  distinct-100: "#f3e8ff"
  distinct-700: "#7e22ce"
  distinct-800: "#6b21a8"

typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2.25rem"   # 36px — H1 ở /home, /login brand panel
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"    # 24px — H2 modal, page title
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"      # 16px — Card title, modal title
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"  # 14px — Body, description, helper
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"   # 12px — Eyebrow, column header, badge
    fontWeight: 600
    lineHeight: 1.4
  mono-data:
    fontFamily: "JetBrains Mono, IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem" # 13px — SKU, số lô, ID, version
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1, 'zero' 1"   # tabular-nums

rounded:
  sm: "4px"      # Badge, small inline
  md: "6px"      # Button, Input, Alert, Select, Textarea
  lg: "8px"      # Card, StatCard, Table wrapper, Modal, value-prop icon
  full: "9999px" # Loading spinner, user avatar

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "48px"
  "4xl": "64px"

components:
  # === Button ===
  button-primary:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"     # md size
  button-primary-hover:
    backgroundColor: "{colors.ink-800}"
  button-primary-disabled:
    backgroundColor: "{colors.ink-300}"
    textColor: "{colors.ink-100}"
  button-success:
    backgroundColor: "{colors.accent-600}"
    textColor: "{colors.surface}"
  button-success-hover:
    backgroundColor: "{colors.accent-700}"
  button-danger:
    backgroundColor: "{colors.danger-600}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.ink-100}"
    textColor: "{colors.ink-900}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-700}"
    border: "1px solid {colors.ink-300}"
  button-focus:
    ringColor: "{colors.accent-500}"
    ringOffset: "2px"

  # === Card ===
  card-default:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.ink-200}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"   # px-5 py-4
  card-title:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 600
    textColor: "{colors.ink-900}"
  card-subtitle:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    fontWeight: 400
    textColor: "{colors.ink-500}"

  # === StatCard ===
  statcard-default:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.ink-200}"
    rounded: "{rounded.lg}"
    padding: "20px"        # p-5
  statcard-value:
    typography: "{typography.mono-data}"
    fontWeight: 600
    fontSize: "1.5rem"     # 24px, larger than body
    textColor: "{colors.ink-900}"

  # === Input ===
  input-default:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.ink-300}"
    rounded: "{rounded.md}"
    padding: "8px 12px"    # py-2 px-3
    textColor: "{colors.ink-900}"
  input-placeholder:
    textColor: "{colors.ink-400}"
  input-focus:
    borderColor: "{colors.accent-500}"
    ringColor: "{colors.accent-200}"
  input-error:
    borderColor: "{colors.danger-500}"
    ringColor: "{colors.danger-200}"

  # === Modal ===
  modal-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "max-h-[90vh]"
  modal-backdrop:
    backgroundColor: "rgba(0, 0, 0, 0.5)"

  # === Badge ===
  badge-default:
    backgroundColor: "{colors.ink-100}"
    textColor: "{colors.ink-800}"
  badge-success:
    backgroundColor: "{colors.accent-100}"
    textColor: "{colors.accent-800}"
  badge-warning:
    backgroundColor: "{colors.warning-100}"
    textColor: "{colors.warning-800}"
  badge-danger:
    backgroundColor: "{colors.danger-100}"
    textColor: "{colors.danger-800}"
  badge-info:
    backgroundColor: "{colors.info-100}"
    textColor: "{colors.info-800}"
---

# Design System: PCMS

## 1. Overview

**Creative North Star: "The Pharmacist's Workbench."**

PCMS là bàn làm việc của dược sĩ — không phải bệnh viện, không phải SaaS chung chung. Dược sĩ bán thuốc, kê đơn, tra cứu tương tác thuốc, in hóa đơn, cập nhật tồn kho theo lô — tất cả trong một ca làm việc. Giao diện phải đủ yên tĩnh để không cản ca, đủ chính xác để dược sĩ tin tưởng, đủ gọn để thông tin dày đặc vẫn đọc nhanh. Cảm giác người dùng khi ngồi vào: yên tâm, không choáng ngợp, mọi thứ đúng chỗ.

Tính cách **hiện đại — nhanh — gọn** kéo mọi quyết định. Bốn vai màu có tên — Ink (navy/indigo trầm) cho brand surface và primary action, Teal (accent) cho highlight, semantic status cho warning/danger/info, ink ramp cho neutrals. Kiểu chữ **sans cho UI, mono cho dữ liệu** — Inter cho điều hướng, nhãn, hướng dẫn; JetBrains Mono cho SKU, số lô, đơn giá, định danh, version. Chuyển động **tiết chế** — chỉ state change 150–250ms, không page-load choreography; tôn trọng `prefers-reduced-motion`.

Trang `/login` mang cảm giác thương hiệu nhiều hơn (split layout, ink-900 panel trái); toàn bộ authenticated app giữ giọng product. **Một từ vựng component** cho 5 vai trò (Admin/CEO/Quản lý/Dược sĩ/Khách hàng) — cùng shape nút, cùng form control, cùng cách phân trang.

**Key Characteristics:**
- Bốn vai màu có tên, mỗi vai dùng có chủ đích — không phải "primary + tailwind gray".
- Sans cho UI, mono cho dữ liệu dạng số/mã — dược sĩ đọc SKU và số lô mỗi phút.
- Mật độ cao nhưng có hệ thống: bảng nhiều dòng, panel nhiều nhãn, nhịp thị giác rõ ràng.
- Bản sắc y tế tự tin — không minh họa hoạt hình, không pastel dễ thương.
- Vietnamese-first copy, line-height ≥ 1.5 ở body cho dấu không chạm dòng kế.

## 2. Colors: The Four-Role Palette

**The Four-Role Rule.** PCMS dùng đúng bốn vai màu: **Primary (Ink — navy/indigo trầm)**, **Accent (Teal — y tế)**, **Status (semantic — warning/danger/info/distinct)**, **Neutral (Ink ramp cho surface/text/border)**. Mỗi vai có một vai trò duy nhất; vai này không thay thế vai kia. Ví dụ: status-danger chỉ dùng cho cảnh báo thuốc/đơn hàng lỗi, không dùng làm accent trang trí.

### Primary (Ink — Brand Surface)
- **Ink-Indigo / Ink-900** (#0f1d3d): Primary brand surface — login brand panel trái, primary button, page heading. Đậm nhất trong ink ramp, dùng cho "đây là action quan trọng nhất".
- **Ink-Navy / Ink-700** (#1e2a5e): Hover state, secondary fill. Sáng hơn 900 nhưng vẫn đậm — dùng khi cần depth phụ.
- **Ink-Mist / Ink-100** (#e6e9f5): Subtle surface, dividers, sidebar logo bg. Cool tint, không warm.

### Accent (Teal — Highlight & Success)
- **Pharmacy-Teal / Accent-500** (#14b8a6): Focus ring, active link, identifier highlight (SKU, order #). Màu "y tế chính xác" — đậm vừa đủ, không chói.
- **Deep-Teal / Accent-700** (#0d7a72): Hover state, success text, success button bg. Đậm hơn 500, dùng khi action dẫn đến success.
- **Pale-Teal / Accent-50** (#f0fdfa): Subtle accent surface — active sidebar item bg, callout bg, "PAID" status bg. Nhẹ nhàng, không lấn át.

### Status (Semantic — không thay thế)
- **Yellow / Warning** (#fef9c3 → #854d0e): Pending orders, low stock, expired lô cảnh báo. Pattern: "cần chú ý nhưng chưa critical".
- **Red / Danger** (#fee2e2 → #991b1b): Cancelled orders, locked users, failed payments, errors. Pattern: "đã lỗi hoặc sắp lỗi".
- **Blue / Info** (#dbeafe → #1e40af): Completed orders, read notifications. Pattern: "trạng thái trung tính, thông tin".
- **Purple / Distinct** (#f3e8ff → #6b21a8): Refunded. Pattern: "trạng thái đặc biệt, ít gặp".

### Neutral (Ink Ramp — Surface, Text, Border)
- **Ink-50 / Cool Paper** (#f1f3f9): Subtle highlight bg, dashboard loading bg.
- **Ink-100 / Mist** (#e6e9f5): Decorative bg, "DRAFT" / "INACTIVE" status.
- **Ink-200 / Haze** (#c5cce4): **Card/Table border** — quan trọng nhất, dùng nhiều nhất.
- **Ink-300 / Fog** (#9aa3c8): Input border, checkbox border.
- **Ink-400 / Soft** (#6b75a8): Decorative icon, placeholder icon, sidebar inactive icon.
- **Ink-500 / Muted** (#475089): Subtitle text, body muted, page subtitle. 5.5:1 trên white — AA.
- **Ink-700 / Strong** (#1e2a5e): Body text strong, link text.
- **Ink-900 / Heading** (#0f1d3d): H1, H2, body emphasis. 14.5:1 trên white — AAA.

**Page background:** `#f8f9fc` (cool off-white, slight blue tint) — tránh cream/sand warm-neutral AI default 2026.

**Surface:** `#ffffff` (card, modal, input bg).

**Named Rules:**
- **The Four-Role Rule.** Mỗi vai màu có một vai trò duy nhất. Status-danger không trang trí. Accent-teal không thay thế ink-900 cho primary action.
- **The Cool-Neutral Rule.** Neutral ramp nghiêng cool (lạnh nhẹ), không warm. Tránh cream/sand/paper làm body bg.
- **The Status-Accent Lock.** `accent-500` (teal) đồng thời là success semantic. PAID/ACTIVE/SIGNED đều dùng teal. Không dùng green riêng.

## 3. Typography: Sans UI + Mono Data

**UI Font:** Inter — loaded via `next/font/google` với subsets `'latin'` + `'vietnamese'`. CSS variable `--font-sans`.
**Mono Font:** JetBrains Mono — loaded via `next/font/google` với subsets `'latin'` + `'vietnamese'`. CSS variable `--font-mono`.

**Character:** Sans gọn, kỹ thuật, trung tính. Đủ rộng cho tiếng Việt có dấu. Mono mang lại cảm giác "dụng cụ đo chính xác" cho SKU, số lô, đơn giá — yếu tố dược sĩ nhìn mỗi phút và cần phân biệt ký tự rõ (1 vs l vs I, 0 vs O).

### Hierarchy

- **Display** (Inter semibold, 2.25rem / 36px, lh 1.2, ls -0.01em): H1 ở login brand panel, page hero. Dùng cho "tuyên ngôn" của màn hình — chỉ 1 mỗi page.
- **Headline** (Inter semibold, 1.5rem / 24px, lh 1.3): Page title (H1 ở dashboard), modal title, brand section heading.
- **Title** (Inter semibold, 1rem / 16px, lh 1.4): Card title, sub-section title. Heading h3 hoặc tương đương.
- **Body** (Inter regular, 0.875rem / 14px, lh 1.5): Nội dung chính, mô tả, helper text. Line-length 65–75ch ở prose; dày hơn ở table cell.
- **Body Strong** (Inter medium, 0.875rem, lh 1.5): Label trong form, link text, table cell value.
- **Label** (Inter semibold, 0.75rem / 12px, lh 1.4): Eyebrow, column header, badge. **Chỉ dùng uppercase khi mang tính brand** (PCMS wordmark); column header giữ sentence-case.
- **Mono Data** (JetBrains Mono regular, 0.8125rem / 13px, lh 1.5, `tnum` + `zero` OpenType): SKU, số lô, đơn giá, ID, version, code, bar code. tabular-nums để align số trong cột.

**Named Rules:**
- **The Mono Data Rule.** Bất kỳ dữ liệu nào dạng mã (SKU, số lô, ID, đơn giá, version) phải dùng mono + tabular-nums. Lý do: dược sĩ cần phân biệt ký tự chính xác; alignment số trong bảng quan trọng cho việc scan.
- **The Single-Family Rule.** Một sans family (Inter) cho toàn UI. Display/body không cần pairing. Một mono family (JetBrains Mono) cho data. Hai family là đủ.

## 4. Elevation: Flat by Default

**The Flat-By-Default Rule.** Bề mặt phẳng theo mặc định. Phân lớp bằng **border 1px + tách surface nhẹ**, không phải shadow đậm. Shadow chỉ xuất hiện cho UI cần tách khỏi content.

### Shadow Vocabulary

- **`shadow-xl`** (Modal only): Modal cần depth để tách khỏi page. Backdrop `bg-black/50`.
- **`shadow-lg`** (Dropdown/Popover only): Auto-complete dropdown, search suggest, user menu. Cần tách khỏi content bên dưới.
- *Không có shadow cho card thường, button, input, table, stat card.* Border 1px (ink-200) là đủ.

### Border Strategy

- **Card/Table wrapper border:** `1px solid {ink-200}`. Không shadow.
- **Input border:** `1px solid {ink-300}`. Focus đổi sang `accent-500` + ring-2.
- **Divider (chia row trong table/list):** `divide-y divide-{ink-200}` hoặc border-bottom `ink-200`.

**Named Rule:**
- **The No-Ghost-Card Rule.** Border HOẶC shadow, không cả hai. Pair `border + shadow` trên cùng element là "ghost-card" anti-pattern — đã audit và fix toàn app, không tái sử dụng.

## 5. Components

### Buttons
- **Shape:** rounded-md (6px)
- **Variants:**
  - **Primary (ink-900):** Primary action — "Đăng nhập", "Lưu", "Tạo đơn hàng", "Tạo đơn đầu tiên". Đậm nhất, full-width trong form.
  - **Success (accent-600):** Action dẫn đến success state — "Xác nhận thanh toán", "Hoàn tất đơn".
  - **Danger (red-600):** Hủy, xóa — **luôn kèm confirm dialog**.
  - **Secondary (ink-100):** Fill nhẹ, secondary action — "Đóng", "Hủy bỏ" trong form.
  - **Outline (white + ink-300 border):** Tertiary action — "Quay lại", "Xem chi tiết".
  - **Ghost:** Transparent bg, chỉ text — "Hủy" trong dialog, link phụ.
- **Sizes:** sm (px-2.5 py-1.5 text-xs), md (px-4 py-2 text-sm), lg (px-5 py-2.5 text-base).
- **Hover:** darker (ink-900 → ink-800, accent-600 → accent-700).
- **Focus:** `focus:ring-2 focus:ring-accent-500 focus:ring-offset-1`.
- **Disabled:** bg-ink-300 text-ink-100, cursor-not-allowed.
- **A11y:** `<button type="submit|button">` rõ ràng, loading spinner `aria-hidden`, loading text visible.

### Cards
- **Shape:** rounded-lg (8px)
- **Background:** white
- **Border:** `1px solid {ink-200}` (no shadow)
- **Padding:** `px-5 py-4` (16/20)
- **Title (h3):** text-base (1rem) font-semibold text-ink-900
- **Subtitle:** text-sm text-ink-500 mt-0.5
- **Divider header/body:** `border-b border-ink-200`
- **A11y:** `role="region" aria-labelledby={titleId}` khi có title.

### Stat Cards
- **Shape:** rounded-lg (8px)
- **Background:** white
- **Border:** `1px solid {ink-200}`
- **Padding:** `p-5` (20)
- **Title:** text-sm font-medium text-ink-500
- **Value:** text-2xl (1.5rem) font-semibold `font-mono tabular-nums` text-ink-900
- **Icon container:** rounded-lg, semantic color bg (accent-50 / yellow-50 / red-50 / ink-50)
- **Trend:** text-xs, semantic (up=accent-700, down=red-600, flat=ink-500)
- **Color variants:** primary (ink-50), accent (accent-50), warning (yellow-50), danger (red-50)

### Inputs
- **Shape:** rounded-md (6px)
- **Border:** `1px solid {ink-300}`
- **Padding:** `py-2 px-3` (8/12)
- **Background:** white
- **Text:** text-ink-900, placeholder text-ink-400
- **Focus:** border-accent-500 + ring-2 ring-accent-200
- **Error:** border-danger-500 + ring-danger-200 + error text danger-600
- **Disabled:** bg-ink-50 text-ink-500
- **A11y:** `<label htmlFor>`, `aria-invalid`, `aria-describedby` linking to error/hint, asterisk `aria-hidden`.

### Modals
- **Shape:** rounded-lg (8px)
- **Background:** white
- **Shadow:** `shadow-xl` (chỉ modal được dùng shadow)
- **Backdrop:** `bg-black/50`
- **Width:** sm (max-w-md), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl)
- **Padding:** `px-5 py-4` body, `px-5 py-3` header/footer
- **Close:** ✕ button 44×44px touch target (`-m-2 p-2`), aria-label="Đóng"
- **A11y:** `role="dialog" aria-modal="true" aria-labelledby={titleId}`, Esc to close.

### Table
- **Shape:** rounded-lg (8px) wrapper
- **Background:** white
- **Border:** `1px solid {ink-200}` (no shadow)
- **Header:** bg-ink-50, text-ink-600 text-xs font-semibold (NO uppercase tracked)
- **Row:** hover bg-ink-50, focus-visible bg-ink-50 (keyboard nav)
- **Cell:** text-sm text-ink-900; mono cho IDs/SKUs; tabular-nums cho số tiền
- **Divider:** `divide-y divide-ink-200`
- **Loading:** `role="status" aria-live="polite"` cho toàn bảng
- **Empty:** EmptyState component (icon + text + optional CTA)
- **Pagination:** Page-size select + Prev/Next buttons + Trang X/Y counter

### Badge
- **Shape:** rounded (4px)
- **Variants:** default (ink-100/ink-800), success (accent-100/accent-800), warning (yellow-100/yellow-800), danger (red-100/red-800), info (blue-100/blue-800), gray (ink-100/ink-700)
- **Padding:** `px-2 py-0.5`, text-xs font-medium
- **A11y:** `role="status"` cho semantic variants (success, warning, danger, info, default); gray variant không có role (decorative)

### Alert
- **Shape:** rounded-md (6px)
- **Background:** semantic-50, border semantic-200, text semantic-800
- **Icon:** emoji (ℹ️ ✅ ⚠️ ⛔) — `aria-hidden`
- **Padding:** `px-4 py-3`, gap-3
- **Dismiss:** ✕ button 44×44px, aria-label="Đóng", focus-visible
- **A11y:** `role="alert"` (assertive when shown)

### Sidebar
- **Width:** w-64 (256px), sticky left
- **Background:** white, `border-r border-ink-200`
- **Logo:** pill icon in `bg-accent-100` rounded-lg, text `accent-700`. Wordmark "PCMS" + subtitle "Pharmacy Chain".
- **Group label:** text-xs font-semibold text-ink-500 (NO uppercase tracked)
- **Active item:** bg-accent-50 text-accent-800 font-medium, icon accent-700
- **Hover item:** bg-ink-50 text-ink-700
- **Footer:** version + copyright, text-xs text-ink-500
- **A11y:** `<nav aria-label="Menu chính">`, `aria-current="page"` on active link

### Header
- **Height:** h-16 (64px), sticky top
- **Background:** white, `border-b border-ink-200`
- **Heading:** text-lg font-semibold text-ink-900 (system title)
- **User avatar:** circle accent-100, text accent-800
- **User menu:** role="menu" with role="menuitem" items; bg-white border-ink-200
- **A11y:** `aria-haspopup="menu"`, `aria-expanded={open}`, `aria-label="Mở menu tài khoản"`

### Quick Actions (Dashboard)
- **Layout:** 2-col mobile (`grid-cols-2`), 4-col desktop (`sm:grid-cols-4`), gap-3
- **Primary (1 dominant):** `bg-ink-900 text-white`, icon `accent-400` — chiếm 80% tương tác của dược sĩ trong ca
- **Outline (3 secondary):** `bg-white border border-ink-200 text-ink-700`, hover `bg-ink-50`
- **Equal weight among outline**, primary dominant visually
- **Padding:** `p-5`, gap-2.5
- **A11y:** focus-visible ring-accent-500

### Form Panel (Login)
- **Layout:** Right column on desktop, full-width on mobile
- **Form max-width:** `max-w-sm` (384px)
- **Inputs:** Standard Input component (above)
- **Submit button:** full-width primary
- **Demo accounts:** `<details>` collapsed by default, mono text for credentials, click to autofill
- **Auth error:** Alert variant="danger" with role="alert", retry CTA inline

### Brand Panel (Login)
- **Layout:** Left column on desktop (lg+), collapsed on top mobile
- **Background:** `bg-ink-900` (drenched)
- **Text:** white + ink-200 + ink-300 hierarchy
- **Accent:** 1px solid `bg-accent-500` stripe at top
- **Logo block:** `bg-ink-800 ring-1 ring-ink-700` icon container, wordmark mono in `accent-400`
- **Value props:** 3 items, icon in `bg-ink-800 ring-1 ring-ink-700`, title `text-white`, body `text-ink-300`
- **Footer:** mono `text-ink-400`

## 6. Do's and Don'ts

### Do:

- **Do** dùng `font-mono tabular-nums` cho mọi dữ liệu dạng mã (SKU, số lô, ID, đơn giá, version, code). Lý do: dược sĩ cần phân biệt ký tự chính xác; alignment số trong bảng quan trọng.
- **Do** dùng Ink (navy) cho primary brand surface — primary button, login brand panel, h1. Dùng Teal (accent) cho highlight — focus ring, active link, identifier, success semantic.
- **Do** dùng border 1px `ink-200` để phân lớp card; shadow chỉ dành cho modal (`shadow-xl`) và dropdown/popover (`shadow-lg`).
- **Do** giữ một từ vựng component cho 5 vai trò (Admin/CEO/Quản lý/Dược sĩ/Khách hàng). Cùng shape nút, cùng form control, cùng cách phân trang.
- **Do** tuân thủ WCAG 2.1 AA: tương phản ≥ 4.5:1 cho body text (ink-900 trên white = 14.5:1, ink-500 trên white = 5.5:1), focus-visible ring trên mọi interactive, ARIA roles chính xác.
- **Do** tôn trọng `prefers-reduced-motion`: 0 transition phức tạp dưới 0.01ms (global rule trong globals.css).
- **Do** dùng tiếng Việt có dấu, line-height ≥ 1.5 cho body. Không cắt ký tự khi xuống dòng.
- **Do** dùng 4 metric quan trọng cho dashboard dược sĩ (Doanh thu, Tồn kho, Đơn chờ, Lô sắp hết hạn) — không phải 8 metric tổng quát. Mỗi metric có semantic color riêng.
- **Do** dùng `<details>` cho demo accounts thay vì card nổi bật. Collapsed by default để không cạnh tranh với primary CTA.
- **Do** viết error message ngay dưới input + Alert trên đầu form. Cho retry CTA trong error state.

### Don't:

- **Don't** dùng `border + box-shadow` cùng lúc trên card thường (ghost-card anti-pattern). Border HOẶC shadow, không cả hai. **Đã audit và fix toàn app, không tái sử dụng.**
- **Don't** dùng `bg-clip-text` gradient text. Trang trí không có ý nghĩa. Nhấn mạnh bằng weight hoặc size.
- **Don't** dùng `backdrop-blur` (glassmorphism) trừ khi có mục đích depth thật (modal/dropdown/popover). Không trên card thường.
- **Don't** bo góc > 16px trên card/section/input. Pill đầy đủ OK cho tag/button. Trên 16px là rounding quá đà (codex tell).
- **Don't** dùng cream/sand/paper/parchment làm body background. Cool off-white (#f8f9fc) hoặc cool neutral ramp — tránh warm-by-default.
- **Don't** dùng minh họa hoạt hình / sketchy SVG (loose-sketch, doodle, wavy) / feTurbulence "paper grain". Dược sĩ cần tin tưởng, không cần đáng yêu.
- **Don't** lặp lại eyebrow uppercase tracked trên mỗi section / mỗi card — AI-slop grammar. Một kicker có chủ đích là voice (PCMS wordmark); lặp lại là template.
- **Don't** dùng animation page-load choreography (staggered reveal, scroll-driven sequences). Cản ca làm việc của dược sĩ. State change 150–250ms là đủ.
- **Don't** tạo 4-card grid icon+heading+text lặp lại vô tận. Vary layout; dùng table khi dữ liệu dạng bảng.
- **Don't** phụ thuộc vào màu đơn thuần để truyền tải trạng thái — luôn kèm icon hoặc text cho status quan trọng (đơn thuốc, tương tác thuốc, hết hạn lô).
- **Don't** tạo 5 phiên bản giao diện cho 5 vai trò. Một ngôn ngữ component, nhiều quyền truy cập (RBAC).
- **Don't** dùng emoji 👋 ✅ 🎉 🧪 làm decoration lặp lại. Một icon Lucide (CheckCircle2, Pill, PillBottle, ClipboardList) nhất quán với phần còn lại.
- **Don't** dùng `gray-` (Tailwind default) cho neutral — dùng `ink-` ramp. `gray-200` quá ấm, không khớp "cool neutral" rule.
- **Don't** dùng `primary-` (Tailwind blue) cho brand — dùng `ink-` (navy). Blue là AI default 2026, navy mới có bản sắc y tế.
- **Don't** dùng `green-` cho success — dùng `accent-` (teal). "PAID", "ACTIVE", "SIGNED" đều dùng teal theo Status-Accent Lock.
