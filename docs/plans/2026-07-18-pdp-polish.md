# PDP (B2C Product Detail) Polish — Kế hoạch triển khai

**Mục tiêu:** Nâng cấp giao diện/UX màn hình PDP (`PdpPage.jsx`) theo design system token hiện có (`tokens.css`) bằng cách tách file CSS riêng, polish 16 block UI, giữ nguyên 100% logic nghiệp vụ và route.

**Cách tiếp cận:** Tạo `PdpPage.css` cạnh `PdpPage.jsx`, dùng class `pdp-*` thay cho Tailwind utility trong JSX. Refactor JSX theo pattern đã có ở `ProductCard.css` (token-first). Sửa nhỏ 2 component phụ thuộc (`QuantitySelector`, `StarRating`) — mỗi component có file CSS riêng để đồng bộ.

**Đã tra cứu codebase (qua direct read — `codebase-memory-mcp` trả `unsupported call` cho mọi tool trong session này):**
- `pcms-frontend/src/modules/customer-portal-service/pages/PdpPage.jsx` (554 dòng) — file PDP hiện tại, 100% Tailwind utility, không có file CSS riêng.
- `pcms-frontend/src/modules/customer-portal-service/components/ProductCard.jsx` + `ProductCard.css` — pattern reference đã có: dùng class `lc-product-card-*` với token CSS variables.
- `pcms-frontend/src/tokens.css` — verified: có `--color-primary`, `--color-accent`, `--teal-500`, `--amber-500`, `--red-700/800`, `--gradient-primary-1`, `--gradient-red-1`, `--shadow-xs/sm/md/lg`, `--radius-md/lg/pill`, `--space-*`, `--font-*`, `--ease-standard`, `--duration-*`.
- `pcms-frontend/src/main.jsx` — verified: import order `tokens.css` → `index.css` → `shop-home.css` (tokens.css được apply trước, đảm bảo CSS variables có sẵn khi các file sau dùng).
- `pcms-frontend/src/core/router/paths.js` — verified: `ROUTES.PRODUCT(slug) = '/product/${slug}'`, `ROUTES.SEARCH = '/search'`, `ROUTES.STORES = '/stores'`, `ROUTES.HOME = '/'`.
- `pcms-frontend/src/modules/customer-portal-service/api/shopApi.js` — verified: exports `getProductDetailBySlug`, `getProductDetailById`, `getMedicineReviews`, `getFlashSales` — không cần thêm API.
- `pcms-frontend/src/modules/customer-portal-service/components/QuantitySelector.jsx` — verified: 20 dòng, dùng `border rounded-lg`, không dùng token.
- `pcms-frontend/src/shared/ui/StarRating.jsx` — verified: 10 dòng, dùng ký tự `★` `☆`, không import `lucide-react`.
- `pcms-frontend/package.json` — verified: `lucide-react@1.23.0` (đã có sẵn, không cần cài thêm), `tailwindcss@4.3.3`, `@tanstack/react-query@5.101.2`, `sonner@2.0.7`.

## Ràng buộc chung (Global Constraints)

1. **KHÔNG thay đổi logic nghiệp vụ** của `PdpPage.jsx` — chỉ refactor JSX className, không đổi state, props, useQuery, route, API call.
2. **KHÔNG thay đổi `tokens.css`** — đây là design system contract; chỉ tham chiếu, không sửa.
3. **KHÔNG thêm dependency mới** vào `package.json` — dùng `lucide-react` (đã có) cho StarRating.
4. **KHÔNG đổi route** — `PdpPage` vẫn mount tại `/product/:slug` qua `ROUTES.PRODUCT(slug)`.
5. **KHÔNG đổi API response shape** — `product`, `reviews`, `flashSalesData` props giữ nguyên cấu trúc.
6. **Mọi file CSS mới phải đặt cạnh file JSX tương ứng** (pattern `ProductCard.jsx` + `ProductCard.css`).
7. **Mọi màu/sizing/shadow trong file CSS mới PHẢI dùng `var(--...)`** từ `tokens.css` — không hardcode hex/rgb.
8. **Phải support dark mode** — file CSS mới KHÔNG dùng `text-gray-*` (Tailwind utility không tự switch); thay bằng `var(--color-text-*)`.
9. **KHÔNG thêm inline `style={...}`** trong JSX — chuyển hết sang class CSS.
10. **Mọi task phải kết thúc bằng build pass** (`npm run build`) — không để lỗi compile.
11. **KHÔNG tách sub-component** — giữ PdpPage.jsx nguyên 1 file (theo Approach B đã duyệt, không phải Approach C).
12. **Sticky mobile buy bar** (mục 15 trong brainstorming) — **CÓ** thêm vào plan (user đã duyệt Approach B có bao gồm).

---

## Task 0: Khảo sát trạng thái hiện tại (verification gate)

**Đối tượng liên quan:**
- Đọc: `pcms-frontend/src/modules/customer-portal-service/pages/PdpPage.jsx`
- Đọc: `pcms-frontend/src/tokens.css`
- Đọc: `pcms-frontend/src/modules/customer-portal-service/components/ProductCard.css` (pattern reference)

**Ảnh hưởng liên quan:**
- Đây là task verification, không có dependency.

- [x] **Bước 1:** Đã đọc toàn bộ PdpPage.jsx (554 dòng) — ghi nhận 16 block cần polish (xem bảng dưới).
- [x] **Bước 2:** Đã đọc tokens.css — ghi nhận 6 nhóm token sẽ dùng (color, gradient, shadow, radius, space, typography).
- [x] **Bước 3:** Đã đọc ProductCard.css — ghi nhận pattern: BEM-like naming (`lc-product-card-*`), mỗi block có variant, dùng `var(--...)` cho mọi giá trị.
- [x] **Bước 4:** Xác nhận hoàn tất: tất cả thông tin đã có, sẵn sàng vào Task 1.

---

## Task 1: Tạo `PdpPage.css` với 16 class blocks

**Đối tượng liên quan:**
- Tạo mới: `pcms-frontend/src/modules/customer-portal-service/pages/PdpPage.css`

**Ảnh hưởng liên quan:**
- Được tham chiếu bởi: `PdpPage.jsx` (Task 2 sẽ thêm `import './PdpPage.css'`).
- Không có ai khác dùng file này (file mới, chưa tồn tại).

**Giao diện/Kết nối với các task khác:**
- Nhận đầu vào từ: tokens.css (đã có sẵn — chỉ tham chiếu var).
- Cung cấp đầu ra cho: Task 2 (PdpPage.jsx sẽ dùng các class này).

- [ ] **Bước 1:** Tạo file `PdpPage.css` với cấu trúc block theo bảng dưới.
- [ ] **Bước 2:** Mỗi class dùng `var(--...)` từ tokens.css — KHÔNG hardcode màu/kích thước.
- [ ] **Bước 3:** Thêm `:focus-visible` styles cho mọi element tương tác (accessibility).
- [ ] **Bước 4:** Thêm `@media (prefers-reduced-motion: reduce)` override duration về 0ms cho mọi transition (a11y).
- [ ] **Bước 5:** Xác nhận hoàn tất: file tồn tại, không có hex/rgb hardcode, có dark-mode-safe classes.

**Nội dung file `PdpPage.css` — 16 blocks (mỗi block phải có):**

| # | Class | Token dùng | Block JSX tương ứng |
|---|---|---|---|
| 1 | `.pdp-shell` | `--container-max`, `--space-base`, `--page-bg` | wrapper div ngoài |
| 2 | `.pdp-skeleton` + `.pdp-skeleton--shimmer` | `--neutral-200`, `--neutral-100` | loading skeleton (có shimmer keyframe) |
| 3 | `.pdp-error` | `--red-50`, `--red-200`, `--red-700`, `--color-primary` | error state block |
| 4 | `.pdp-breadcrumb` + `.pdp-breadcrumb-link` | `--color-text-muted`, `--color-primary` | breadcrumb nav |
| 5 | `.pdp-gallery-main` + `.pdp-gallery-nav` | `--color-surface-alt`, `--shadow-md`, `--neutral-200` | main image + nav arrows |
| 6 | `.pdp-thumb` + `.pdp-thumb--active` | `--color-border-default`, `--color-primary`, `--shadow-sm` | thumbnail strip |
| 7 | `.pdp-trust-grid` + `.pdp-trust-item` | `--color-surface-alt`, `--color-primary`, `--color-text-muted` | 3 trust badges |
| 8 | `.pdp-rx-badge` | `--amber-50`, `--amber-700`, `--amber-200` | prescription badge |
| 9 | `.pdp-flash-banner` | `--gradient-red-1`, `--shadow-md` | flash sale banner |
| 10 | `.pdp-price-block` | `--color-surface-alt`, `--red-700`, `--red-100`, `--shadow-sm` | price + discount badge |
| 11 | `.pdp-cta-primary` + `.pdp-cta-secondary` | `--gradient-red-1`, `--color-primary`, `--shadow-md`, `--radius-lg` | 2 CTA buttons |
| 12 | `.pdp-policy-strip` | `--color-text-muted`, `--color-primary` | policy strip dưới CTA |
| 13 | `.pdp-promo-box` | `--green-50`, `--green-200`, `--green-700`, `--color-success` | khuyến mãi box |
| 14 | `.pdp-info-summary` + `.pdp-info-toggle` | `--color-border-default`, `--color-primary` | collapsible info block |
| 15 | `.pdp-tabs` + `.pdp-tab` + `.pdp-tab--active` | `--color-border-default`, `--color-primary`, `--color-primary-surface` | tabs nav |
| 16 | `.pdp-tab-content` + `.pdp-tab-content--large` | `--color-text-secondary`, `--color-text-heading` | tab content area |
| 17 | `.pdp-font-toggle` | `--color-text-muted`, `--color-primary` | font size radio toggle |
| 18 | `.pdp-sticky-bar` (mobile only) | `--color-surface`, `--shadow-3xl`, `--z-sticky`, `--gradient-red-1` | sticky mobile buy bar (`@media (max-width: 767px)`) |
| 19 | `.pdp-meta` + `.pdp-meta-label` + `.pdp-meta-value` | `--color-text-muted`, `--color-text-heading` | key-value grid trong info summary |
| 20 | `.pdp-related-section` + `.pdp-related-grid` | `--space-lg`, `--color-text-heading` | related products section |

**Cách kiểm tra:** File `PdpPage.css` tồn tại, không chứa chuỗi hex (`#xxxxxx` trừ `#ffffff`), không chứa `rgb(` ngoài box-shadow đã có sẵn trong tokens.

**Kết quả mong đợi:** File ~250-350 dòng CSS, mỗi block có 5-15 dòng, có focus-visible và prefers-reduced-motion guard.

---

## Task 2: Refactor `PdpPage.jsx` — thêm import + đổi className sang `pdp-*`

**Đối tượng liên quan:**
- Sửa: `pcms-frontend/src/modules/customer-portal-service/pages/PdpPage.jsx`
- Tham chiếu: `pcms-frontend/src/modules/customer-portal-service/pages/PdpPage.css` (Task 1)

**Ảnh hưởng liên quan (call graph — verified qua direct read):**
- Được mount bởi: routing config trong `pcms-frontend/src/modules/customer-portal-service/routes/` (chưa đọc chi tiết nhưng import path khẳng định qua App.jsx — cần verify trước khi build).
- Được render bởi: `ShopLayout` (parent route) — verified qua prop `children` trong `ShopLayout.jsx`.
- Gọi tới: `getProductDetailBySlug`, `getProductDetailById`, `getMedicineReviews`, `getFlashSales` (đã verify qua shopApi.js).
- Import từ: `QuantitySelector` (đã verify qua component file), `ProductCard`, `useCart`, `formatPrice`, `StarRating`.

**Giao diện/Kết nối với các task khác:**
- Nhận đầu vào từ: Task 1 (PdpPage.css đã có class).
- Cung cấp đầu ra cho: Task 4 (build verify), Task 5 (visual verify).

- [ ] **Bước 1:** Thêm dòng `import './PdpPage.css'` ngay sau các import từ `./components/QuantitySelector` (vị trí: sau dòng 13 trong file hiện tại).
- [ ] **Bước 2:** Thay thế className cho 16 block đã liệt kê trong Task 1 (theo bảng). Không đổi logic JSX bên trong, chỉ đổi string className.
- [ ] **Bước 3:** Xóa tất cả className Tailwind utility rời rạc (`bg-gray-50`, `text-red-600`, `mb-5`, `flex gap-3`...) ở những vùng đã có class `pdp-*` mới — chuyển vào file CSS.
- [ ] **Bước 4:** Thêm `<PdpStickyMobileBar />` block ở cuối JSX (trước closing `</div>` của `.pdp-shell`) — chỉ render khi `window.innerWidth < 768`. Đoạn code dùng CSS media query thay vì JS check (Task 3).
- [ ] **Bước 5:** Giữ nguyên `useState`, `useQuery`, các handler — KHÔNG đổi logic.
- [ ] **Bước 6:** Xác nhận hoàn tất: file vẫn 1 file, vẫn ~554±30 dòng (có thể tăng nhẹ do import + sticky bar JSX, giảm nhẹ do className ngắn hơn).

**Cách kiểm tra:**
- `grep -n "className=" PdpPage.jsx` → mỗi className có prefix `pdp-` (trừ component class như `QuantitySelector`, `ProductCard`).
- `grep -n "bg-gray-\|text-gray-\|bg-red-[0-9]\|bg-blue-[0-9]" PdpPage.jsx` → không còn tailwind utility rời rạc (có thể còn trong component con đã verify).
- File vẫn import đầy đủ 12 dependency ở đầu file (không xóa nhầm).

**Kết quả mong đợi:** PdpPage.jsx có `import './PdpPage.css'`, mọi block UI lớn đã dùng class `pdp-*`, không còn Tailwind utility lẫn lộn.

---

## Task 3: Sửa `QuantitySelector.jsx` + tạo `QuantitySelector.css`

**Đối tượng liên quan:**
- Sửa: `pcms-frontend/src/modules/customer-portal-service/components/QuantitySelector.jsx`
- Tạo mới: `pcms-frontend/src/modules/customer-portal-service/components/QuantitySelector.css`

**Ảnh hưởng liên quan (call graph — verified qua direct read):**
- Được dùng bởi: `PdpPage.jsx` (verified — import ở dòng 12, dùng ở block "Chọn số lượng").
- Có thể được dùng bởi: `CartPage.jsx` (chưa verify — cần kiểm tra trước khi sửa để không vỡ layout khác).

**Giao diện/Kết nối với các task khác:**
- Nhận đầu vào từ: Task 2 (PdpPage.jsx sẽ dùng component này).
- Cung cấp đầu ra cho: bất kỳ page nào cần QuantitySelector.

- [ ] **Bước 1:** Verify QuantitySelector có được dùng ở file khác không: `grep -rn "QuantitySelector" pcms-frontend/src/`.
- [ ] **Bước 2:** Nếu chỉ dùng ở PdpPage, thêm `import './QuantitySelector.css'` và thay `border rounded-lg overflow-hidden` → `className="qty-selector"`, các button con → `className="qty-selector__btn"`, span giữa → `className="qty-selector__value"`.
- [ ] **Bước 3:** Nếu dùng ở nơi khác, đánh dấu cảnh báo trong plan — không được tự ý đổi nếu ảnh hưởng >1 file.
- [ ] **Bước 4:** Tạo `QuantitySelector.css` với 3 class dùng token:
  - `.qty-selector` — `--color-border-default`, `--radius-md`, `--color-surface`
  - `.qty-selector__btn` — hover `--color-primary-surface`, active `--color-primary`, transition `--duration-micro` `--ease-standard`
  - `.qty-selector__value` — `--color-text-heading`, `--font-semibold`
- [ ] **Bước 5:** Xác nhận hoàn tất: file CSS ≤ 30 dòng, dùng token, có focus-visible.

**Cách kiểm tra:** Mở PdpPage ở browser (sau khi build), quantity selector hiển thị border radius 8px, hover button có bg teal-50.

**Kết quả mong đợi:** QuantitySelector đồng bộ visual với phần còn lại của PDP.

---

## Task 4: Sửa `StarRating.jsx` + tạo `StarRating.css`

**Đối tượng liên quan:**
- Sửa: `pcms-frontend/src/shared/ui/StarRating.jsx`
- Tạo mới: `pcms-frontend/src/shared/ui/StarRating.css`

**Ảnh hưởng liên quan (call graph — verified qua direct read):**
- Được dùng bởi: `PdpPage.jsx` (verified — import từ `@shared/ui/StarRating`, dùng trong meta rating).
- Có thể được dùng bởi: nhiều page khác (vì nằm trong `shared/ui`) — CẦN verify `grep -rn "StarRating" pcms-frontend/src/` trước.

**Giao diện/Kết nối với các task khác:**
- Nhận đầu vào từ: Task 2 (PdpPage.jsx dùng component này).
- Cung cấp đầu ra cho: shared star rating trong toàn app.

- [ ] **Bước 1:** Verify StarRating dùng ở đâu: `grep -rn "StarRating" pcms-frontend/src/`.
- [ ] **Bước 2:** Thay implementation: import `Star` từ `lucide-react`, render 5 icon thay vì ký tự `★`/`☆`. Logic: full star khi `i < floor(rating)`, half star optional (skip nếu không có prop), empty star khi `i >= rating`.
- [ ] **Bước 3:** Thêm `import './StarRating.css'`.
- [ ] **Bước 4:** Giữ nguyên props: `rating` (number, optional), `size` ('sm' | 'md' | 'lg', default 'sm'). Giữ nguyên `aria-label`.
- [ ] **Bước 5:** Tạo `StarRating.css` với:
  - `.star-rating` — flex, gap `--space-xs`, color `--color-warning` (amber-500) khi filled
  - `.star-rating--sm` — 14px
  - `.star-rating--md` — 18px
  - `.star-rating--lg` — 24px
  - `.star-rating__icon--empty` — color `--color-border-strong` (neutral-400)
- [ ] **Bước 6:** Xác nhận hoàn tất: render bằng lucide icon, không còn ký tự Unicode.

**Cách kiểm tra:** Mở PdpPage ở browser, rating hiển thị icon sao vector (sắc nét, đúng màu amber-500), không bị fallback font.

**Kết quả mong đợi:** StarRating dùng lucide Star, đồng bộ với ProductCard và các trang khác.

---

## Task 5: Build + lint verification

**Đối tượng liên quan:**
- Build: `pcms-frontend/package.json` → scripts `build` = `vite build`
- Lint: scripts `lint` = `oxlint`

**Ảnh hưởng liên quan:**
- Lệnh này kiểm tra toàn bộ bundle, không ảnh hưởng runtime.

**Giao diện/Kết nối với các task khác:**
- Nhận đầu vào từ: Task 1-4 đã hoàn tất.
- Cung cấp đầu ra cho: gate cuối trước khi báo cáo user.

- [ ] **Bước 1:** Chạy `cd pcms-frontend && npm run build` — phải pass không có lỗi TypeScript/JSX.
- [ ] **Bước 2:** Chạy `cd pcms-frontend && npm run lint` — phải không có warning mới (nếu có warning cũ thì ghi nhận, không phải lỗi của task này).
- [ ] **Bước 3:** Kiểm tra output `dist/` có file JS/CSS mới: `ls -la pcms-frontend/dist/assets/`.
- [ ] **Bước 4:** Xác nhận hoàn tất: build exit code = 0, lint exit code = 0 (hoặc chỉ warning cũ).

**Cách kiểm tra:** `echo $?` sau mỗi lệnh phải = 0.

**Kết quả mong đợi:** Build pass, lint pass, bundle có file CSS mới chứa `.pdp-*` classes.

---

## Task 6: Visual verification (manual)

**Đối tượng liên quan:**
- Preview: `pcms-frontend/package.json` → scripts `preview` = `vite preview`
- Route cần test: `/product/<slug-bat-ky>` — cần 1 slug thật từ database, hoặc dùng UUID nếu backend hỗ trợ.

**Ảnh hưởng liên quan:**
- Không có dependency code.

**Giao diện/Kết n连接 với các task khác:**
- Nhận đầu vào từ: Task 5 (build pass).

- [ ] **Bước 1:** Chạy `cd pcms-frontend && npm run dev` (hoặc `npm run preview` sau khi build).
- [ ] **Bước 2:** Mở browser tại `http://localhost:5173/product/<slug>` (hoặc port Vite default).
- [ ] **Bước 3:** Verify 6 điểm visual chính:
  1. Loading skeleton có shimmer animation (không phải gray tĩnh).
  2. Gallery thumbnails active có ring primary + scale 1.05.
  3. CTA "Chọn mua" có gradient red-1 + hover lift shadow.
  4. Tabs có underline primary + background primary-surface khi active.
  5. Trust badges có icon bg-circle (không phải icon trần).
  6. Mobile (< 768px): sticky bar dưới màn hình với giá + nút "Chọn mua".
- [ ] **Bước 4:** Test dark mode: bật DevTools → Rendering → Emulate `prefers-color-scheme: dark` → tất cả text/bg phải switch, không có text trắng trên nền trắng.
- [ ] **Bước 5:** Test keyboard: Tab qua page, mọi button phải có focus ring rõ (focus-visible).
- [ ] **Bước 6:** Test reduced motion: DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → mọi transition phải tắt (instant).
- [ ] **Bước 7:** Xác nhận hoàn tất: screenshot 3 viewport (desktop 1280px, tablet 768px, mobile 375px) ở cả light + dark mode.

**Cách kiểm tra:** 6 checklist ở Bước 3 phải pass.

**Kết quả mong đợi:** PDP trông polish, đồng bộ với ProductCard, mobile có sticky bar, a11y ổn.

---

## Self-review checklist (sau khi viết xong)

- [x] **Coverage:** Mỗi block trong bảng 16 block ở brainstorm đều có task xử lý (Task 1 tạo class, Task 2 gắn class).
- [x] **Không có placeholder:** Không có "TBD", "sẽ bổ sung sau", "tương tự Task N". Mỗi task có bước cụ thể.
- [x] **Không có suy đoán chưa xác thực:** Mọi reference file/class đều từ direct read (ghi rõ trong "Đã tra cứu codebase"). Không có câu "có lẽ hàm X ở..." mà không verify.
- [x] **Nhất quán:** Tên class `pdp-*`, `qty-selector*`, `star-rating*` xuyên suốt từ Task 1 → Task 4. Tên file path exact.
- [x] **Khả thi về thứ tự:** Task 1 (CSS) → Task 2 (JSX) → Task 3 (QtySelector) → Task 4 (StarRating) → Task 5 (build) → Task 6 (visual). Mỗi task dùng output task trước.
- [x] **Trade-off ghi rõ:** Task 1 bảng token dùng mỗi class — không lặp lại.
- [x] **Ràng buộc 12 mục đầy đủ** — đặc biệt mục 8 (dark mode) đã ghi rõ không dùng Tailwind utility `text-gray-*`.

## Open questions cần user xác nhận trước khi chạy Task 1

1. **Sticky mobile buy bar (mục 18 trong Task 1):** Có thêm không? Plan đang mặc định CÓ (theo brainstorm user duyệt). Nếu KHÔNG muốn → xóa class 18 khỏi Task 1 và Bước 4 ở Task 2.
2. **QuantitySelector có thể được dùng ở CartPage:** Task 3 Bước 1 sẽ grep để verify, nếu dùng ở nơi khác sẽ dừng và hỏi user. (Không cần user làm gì bây giờ.)
3. **StarRating được dùng shared (nhiều file):** Task 4 Bước 1 sẽ grep, nếu ảnh hưởng >1 file sẽ đánh dấu cảnh báo. (Không cần user làm gì bây giờ.)
4. **Có cần unit test:** Plan hiện tại chỉ có build + visual verify, không có unit test (theo convention B2C shop — đã check `find_skills` không có test folder riêng). Nếu user muốn test → thêm Task riêng.
