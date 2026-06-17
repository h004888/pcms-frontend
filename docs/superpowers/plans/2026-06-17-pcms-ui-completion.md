# PCMS Frontend — Complete 57 Missing Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện **57 màn hình còn thiếu** của PCMS Frontend (Next.js 14 + TypeScript + Tailwind) theo SRS/SDD v1.4.0, đạt 100% số màn hình trong thiết kế (28 B2B + 57 B2C/AI/Mobile = 85 tổng).

**Architecture:** Next.js 14 App Router với route groups `(dashboard)` và `(shop)`. Mỗi màn hình là một `page.tsx` trong `src/app/...`. Reuse `src/components/ui/*` (Button, Card, Input, Modal, Table, FormControls, Feedback) và `src/components/shop/*` (ProductCard, ProductGrid, FilterSidebar, HeroBanner, PublicHeader, PublicFooter, MobileBottomNav, StaticPageLayout, PolicyPage). Mock data trong `src/data/shop/*` và `src/data/policies.tsx`. Không cần backend — frontend tự chạy với mock.

**Tech Stack:** Next.js 14.2 (App Router) · React 18 · TypeScript 5.5 · Tailwind CSS 3.4 · lucide-react (icons) · react-hook-form + zod (forms) · date-fns · clsx · react-hot-toast.

**Tham chiếu thiết kế:**
- `SRS_PhamacyChainManagementSystem_v1.0.0.md` §3.1.2 (Screen Descriptions — 85 màn hình)
- `SDD_PhamacyChainManagementSystem_v1.0.0.md` §3.1.2 (Screen Descriptions mirror + Screen Flow)
- `src/components/shop/*` (existing shared B2C components)
- `src/components/ui/*` (existing shared UI primitives)
- `src/data/shop/catalog.ts` (mock product/category data — 30 products, 5 categories)
- `src/data/policies.tsx` (mock policy data)
- `tailwind.config.ts` (design tokens: ink-, accent-, danger- palette)

**Nguyên tắc UI/UX (impeccable skill):**
- **Information architecture:** Mỗi screen có một H1 duy nhất, navigation breadcrumb, primary action nổi bật.
- **Visual hierarchy:** H1 > H2 > body; CTA dùng `bg-accent-600` (orange Long Châu), secondary dùng outline.
- **Typography:** `font-sans` (Inter), `text-balance` cho heading, `text-pretty` cho body, không truncate tiêu đề.
- **Color:** B2B dùng ink-* (navy) + accent-* (orange). B2C dùng accent-* (orange) làm primary. `danger-*` cho lỗi, `success-*` (nếu có) cho trạng thái tốt.
- **Spacing:** Scale Tailwind 4/8/12/16/24/32/48. Mobile-first, padding `px-4 sm:px-6 lg:px-8`.
- **Layout:** Grid 12 col desktop / 4 col mobile, max-w-7xl (1280px), responsive breakpoints `sm:640 md:768 lg:1024 xl:1280`.
- **Accessibility:** `aria-label` cho icon-only buttons, `role` cho landmarks, focus-visible ring, semantic HTML (`<main>`, `<nav>`, `<article>`), keyboard navigation, `prefers-reduced-motion`.
- **Responsive:** Mobile-first, `md:` cho tablet, `lg:` cho desktop. Mobile bottom nav ẩn trên `md:`.
- **i18n:** Toàn bộ text Tiếng Việt có dấu chuẩn, dùng `date-fns/locale/vi` cho date, format VND (`Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`).
- **Empty states:** Mỗi list screen có illustration + CTA khi rỗng.
- **Loading:** Skeleton (animate-pulse) cho list, spinner cho button submit.
- **Error:** Toast (`react-hot-toast`) cho action errors, inline form errors cho validation.

---

## Tổng quan sub-plans

Do phạm vi lớn (57 màn hình), kế hoạch được chia thành **10 sub-plans độc lập**. Mỗi sub-plan là working, testable software sau khi hoàn thành.

| # | Sub-plan | Màn hình | Prefix | File path (sau khi tạo) | Ưu tiên |
|---|----------|:--------:|--------|------------------------|:-------:|
| 1 | B2C E-commerce | 11 | SHOP-* | `docs/superpowers/plans/2026-06-17-pcms-b2c-ecommerce.md` | 🔴 Cao |
| 2 | B2C Tra cứu | 8 | LOOKUP-* | `docs/superpowers/plans/2026-06-17-pcms-b2c-lookup.md` | 🔴 Cao |
| 3 | B2C Store Locator + Vaccine | 7 | STORE-*, VACCINE-* | `docs/superpowers/plans/2026-06-17-pcms-b2c-store-vaccine.md` | 🟡 TB |
| 4 | B2C Customer Account | 9 | CUST-* | `docs/superpowers/plans/2026-06-17-pcms-b2c-account.md` | 🟡 TB |
| 5 | AI Features | 4 | CHAT-AI, AI-* | `docs/superpowers/plans/2026-06-17-pcms-ai-features.md` | 🟡 TB |
| 6 | Pharmacist Workbench | 5 | RX-* | `docs/superpowers/plans/2026-06-17-pcms-pharmacist-workbench.md` | 🟢 Thấp |
| 7 | Health Tools | 2 | HEALTH-* | `docs/superpowers/plans/2026-06-17-pcms-health-tools.md` | 🟢 Thấp |
| 8 | Mobile App (PWA) | 2 | MOBILE-* | `docs/superpowers/plans/2026-06-17-pcms-mobile-pwa.md` | 🟢 Thấp |
| 9 | E-commerce Operations | 4 | SHOP-VOUCHER, REVIEW, LIVE-CHAT, FLASH-SALE | `docs/superpowers/plans/2026-06-17-pcms-ecom-ops.md` | 🟢 Thấp |
| 10 | Static Pages còn lại | 3 | PAGE-SHIP, RETURN, TOS | `docs/superpowers/plans/2026-06-17-pcms-static-pages.md` | 🟢 Thấp |

---

## File Structure — Toàn bộ 57 màn hình

### Sub-plan 1: B2C E-commerce (11 files)
```
src/app/(shop)/
├── page.tsx                                   # SHOP-HOME — ghi đè placeholder hiện tại
├── thuoc/
│   └── page.tsx                               # SHOP-CAT-1 (danh mục cấp 1)
├── thuoc/[slug]/
│   └── page.tsx                               # SHOP-CAT-2 (danh mục cấp 2)
├── thuoc/[slug]/[productSlug]/
│   └── page.tsx                               # SHOP-PDP
├── search/
│   └── page.tsx                               # SHOP-SEARCH
├── cart/
│   └── page.tsx                               # SHOP-CART
├── checkout/
│   └── page.tsx                               # SHOP-CHECKOUT
├── orders/
│   ├── page.tsx                               # SHOP-ORDER-HISTORY
│   └── [id]/
│       └── page.tsx                           # SHOP-ORDER-TRACK
├── prescriptions/
│   └── upload/
│       └── page.tsx                           # SHOP-RX-UPLOAD
└── installment/
    └── page.tsx                               # SHOP-INSTALLMENT
```

### Sub-plan 2: B2C Tra cứu (8 files)
```
src/app/(shop)/
├── tra-cuu-thuoc/
│   ├── page.tsx                               # SHOP-LOOKUP-DRUG
│   └── [slug]/
│       └── page.tsx                           # SHOP-LOOKUP-DRUG detail
├── tra-cuu-duoc-chat/
│   ├── page.tsx                               # SHOP-LOOKUP-INGREDIENT
│   └── [slug]/
│       └── page.tsx
├── tra-cuu-duoc-lieu/
│   ├── page.tsx                               # SHOP-LOOKUP-HERB
│   └── [slug]/
│       └── page.tsx
├── tra-thuoc-chinh-hang/
│   └── page.tsx                               # SHOP-VERIFY-ORIGIN
├── bai-viet/
│   ├── page.tsx                               # SHOP-HEALTH-ARTICLE list
│   └── [slug]/
│       └── page.tsx
├── benh-thuong-gap/
│   ├── page.tsx                               # SHOP-DISEASE-INFO
│   └── [slug]/
│       └── page.tsx
├── chuyen-trang-ung-thu/
│   └── page.tsx                               # SHOP-CANCER-INFO
└── video/
    └── page.tsx                               # SHOP-VIDEO
```

### Sub-plan 3: B2C Store Locator + Vaccine (7 files)
```
src/app/(shop)/
├── he-thong-cua-hang/
│   ├── page.tsx                               # STORE-LOCATOR
│   ├── [province]/
│   │   └── page.tsx                           # STORE-LIST-PROVINCE
│   └── [province]/[id]/
│       └── page.tsx                           # STORE-DETAIL
├── dat-lich-tu-van/
│   └── page.tsx                               # STORE-CONSULT
└── tiem-chung/
    ├── page.tsx                               # VACCINE-HOME
    ├── dat-lich/
    │   └── page.tsx                           # VACCINE-BOOKING
    └── so-tiem/
        └── page.tsx                           # VACCINE-LEDGER
```

### Sub-plan 4: B2C Customer Account (9 files)
```
src/app/(auth)/
├── login/
│   └── page.tsx                               # CUST-LOGIN (ghi đè SCR-LOGIN, hỗ trợ SMS OTP)
├── (customer)/                                 # route group mới — cần AuthGuard B2C
│   ├── profile/
│   │   └── page.tsx                           # CUST-PROFILE
│   ├── addresses/
│   │   └── page.tsx                           # CUST-ADDRESS
│   ├── family/
│   │   └── page.tsx                           # CUST-FAMILY
│   ├── wallet/
│   │   └── page.tsx                           # CUST-HEALTH-WALLET
│   ├── prescriptions/
│   │   └── page.tsx                           # CUST-RX-HISTORY
│   ├── points/
│   │   └── page.tsx                           # CUST-POINTS
│   ├── favorites/
│   │   └── page.tsx                           # CUST-FAVORITES
│   └── notifications/
│       └── page.tsx                           # CUST-NOTIF-SETTINGS
└── layout.tsx                                  # AuthGuard wrapper cho customer routes
```

### Sub-plan 5: AI Features (4 files)
```
src/app/(shop)/
├── ai/
│   ├── chat/
│   │   └── page.tsx                           # CHAT-AI
│   ├── rx-ocr/
│   │   └── page.tsx                           # AI-RX-OCR
│   ├── drug-check/
│   │   └── page.tsx                           # AI-DRUG-CHECK
│   └── semantic-search/
│       └── page.tsx                           # AI-SEMANTIC-SEARCH
```

### Sub-plan 6: Pharmacist Workbench (5 files)
```
src/app/(dashboard)/rx-console/                # route group mới trong dashboard
├── consult/
│   └── page.tsx                               # RX-CONSULT
├── customer-360/
│   └── page.tsx                               # RX-CUST-PROFILE-360
├── cross-sell/
│   └── page.tsx                               # RX-CROSS-SELL
├── follow-up/
│   └── page.tsx                               # RX-FOLLOW-UP
└── vip/
    └── page.tsx                               # RX-VIP-MARK
```

### Sub-plan 7: Health Tools (2 files)
```
src/app/(shop)/suc-khoe/
├── kiem-tra/
│   ├── page.tsx                               # HEALTH-QUIZ-LIST
│   └── [slug]/
│       └── page.tsx                           # HEALTH-QUIZ-RESULT
```

### Sub-plan 8: Mobile App PWA (2 files)
```
src/app/(shop)/mobile/
├── page.tsx                                   # MOBILE-HOME
└── nhac-uong-thuoc/
    ├── page.tsx                               # MOBILE-MED-REMINDER list
    └── new/
        └── page.tsx                           # MOBILE-MED-REMINDER create
```

### Sub-plan 9: E-commerce Operations (4 files)
```
src/app/(shop)/
├── voucher/
│   └── page.tsx                               # SHOP-VOUCHER
├── reviews/
│   ├── page.tsx                               # SHOP-REVIEW (my reviews)
│   └── new/[productSlug]/
│       └── page.tsx                           # SHOP-REVIEW create
├── live-chat/
│   └── page.tsx                               # SHOP-LIVE-CHAT
└── flash-sale/
    ├── page.tsx                               # SHOP-FLASH-SALE list
    └── [id]/
        └── page.tsx                           # SHOP-FLASH-SALE detail
```

### Sub-plan 10: Static Pages còn lại (3 files)
```
src/data/policies.tsx                          # thêm 3 policies: giao-hang, doi-tra, tos
                                                  # (đã có bao-mat ở policies.tsx hiện tại)
```
> Lưu ý: `/chinh-sach/[slug]/page.tsx` đã có sẵn với dynamic slug, chỉ cần thêm data.

### Shared components cần bổ sung (1 lần, dùng chung cho mọi sub-plan)

```
src/components/ui/
├── Badge.tsx                                  # status badge (in-stock, low, out, ACTIVE, INACTIVE,...)
├── Chip.tsx                                   # filter chip, tag chip
├── Tabs.tsx                                   # tab navigation
├── Accordion.tsx                              # collapsible section
├── Skeleton.tsx                               # loading skeleton
├── EmptyState.tsx                             # empty list state
├── Pagination.tsx                             # page navigation
├── Avatar.tsx                                 # user avatar
├── StarRating.tsx                             # 1-5 star display + interactive
├── Breadcrumb.tsx                             # navigation breadcrumb
├── Drawer.tsx                                 # side drawer (mobile)
├── Toast.tsx                                  # wrapper react-hot-toast (alias)
└── PriceDisplay.tsx                           # format VND + original + discount %

src/components/shop/
├── ShopHomeHero.tsx                            # SHOP-HOME hero (tách từ page.tsx)
├── ShopHomeCategories.tsx                      # 6 danh mục nổi bật
├── ShopHomeBestseller.tsx                      # top 10 sản phẩm bán chạy
├── ShopHomeHealthTools.tsx                     # section bài kiểm tra sức khỏe
├── ShopHomeShortVideos.tsx                     # section video ngắn
├── ShopHomeStoreLocator.tsx                    # section tìm nhà thuốc
├── ProductGallery.tsx                          # PDP image gallery
├── ProductInfo.tsx                             # PDP info (price, stock, add-to-cart)
├── ProductTabs.tsx                             # PDP tabs (mô tả / thành phần / đánh giá)
├── CartItemRow.tsx                             # cart line item
├── CheckoutStepper.tsx                         # 4-step checkout
├── OrderTimeline.tsx                           # SHOP-ORDER-TRACK timeline
├── RXUploader.tsx                              # drag-drop + preview
├── InstallmentCalculator.tsx                   # trả góp monthly calc
├── SearchFilters.tsx                           # search facets
├── SearchResultCard.tsx                        # search result item
├── DrugAlphabetFilter.tsx                      # A-Z filter cho LOOKUP-DRUG
├── IngredientCard.tsx
├── HerbCard.tsx
├── VerifyOriginScanner.tsx                     # QR/barcode scanner UI (mock)
├── ArticleCard.tsx
├── DiseaseCard.tsx
├── VideoCard.tsx
├── StoreMap.tsx                                # embedded map (placeholder Leaflet)
├── StoreListItem.tsx
├── VaccineCard.tsx
├── VaccineBookingForm.tsx
├── CustomerProfileForm.tsx
├── AddressBook.tsx
├── FamilyMemberCard.tsx
├── WalletLedger.tsx
├── PrescriptionHistoryItem.tsx
├── PointsHistoryItem.tsx
├── ChatBubble.tsx                              # AI chat message bubble
├── ChatInput.tsx
├── DrugInteractionResult.tsx
├── PharmacistConsultPanel.tsx
├── Customer360Timeline.tsx
├── FollowUpTaskCard.tsx
├── VipBadge.tsx
├── HealthQuizCard.tsx
├── HealthQuizQuestion.tsx
├── HealthQuizResult.tsx
├── MobileAppGrid.tsx                           # 8 icon grid
├── MedicationReminderForm.tsx
├── VoucherCard.tsx
├── VoucherInput.tsx
├── ReviewForm.tsx
├── ReviewCard.tsx
├── LiveChatWindow.tsx
├── FlashSaleCountdown.tsx
└── FlashSaleProductCard.tsx
```

### Mock data cần bổ sung
```
src/data/shop/
├── products.ts                                # alias catalog.ts (đổi tên nếu cần)
├── articles.ts                                # SHOP-HEALTH-ARTICLE 10 bài viết
├── diseases.ts                                # SHOP-DISEASE-INFO 8 bệnh
├── cancer-info.ts                             # SHOP-CANCER-INFO
├── videos.ts                                  # SHOP-VIDEO 12 video
├── branches.ts                                # STORE-LOCATOR 8 chi nhánh (mock) với lat/lng
├── vaccines.ts                                # VACCINE-HOME 10 vắc xin
├── drug-ingredients.ts                        # SHOP-LOOKUP-INGREDIENT 20 hoạt chất
├── herbs.ts                                   # SHOP-LOOKUP-HERB 15 dược liệu
├── quizzes.ts                                 # HEALTH-QUIZ 8 bài quiz + questions
└── reminders.ts                               # MOBILE-MED-REMINDER mock reminders
```

---

## Common Reusable Patterns (áp dụng cho mọi screen)

### Pattern A — Page header chuẩn
```tsx
<div className="bg-white border-b border-ink-200">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <Breadcrumb items={[{label: 'Trang chủ', href: '/'}, {label: 'Đơn hàng'}]} />
    <h1 className="mt-2 text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance">
      Đơn hàng của tôi
    </h1>
    <p className="mt-1 text-sm text-ink-600 text-pretty">
      Theo dõi trạng thái và lịch sử đơn hàng
    </p>
  </div>
</div>
```

### Pattern B — Empty state
```tsx
<EmptyState
  icon={Package}
  title="Chưa có đơn hàng"
  description="Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm."
  action={{ label: 'Mua sắm ngay', href: '/' }}
/>
```

### Pattern C — Loading skeleton
```tsx
<div className="space-y-3">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="h-20 bg-ink-100 rounded-md animate-pulse" />
  ))}
</div>
```

### Pattern D — VND price
```tsx
const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
```

### Pattern E — Date Việt Nam
```tsx
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
format(date, "EEEE, d 'tháng' M, yyyy", { locale: vi });
// → "Thứ ba, 17 tháng 6, 2026"
```

### Pattern F — Toast helper
```tsx
import toast from 'react-hot-toast';
toast.success('Đã thêm vào giỏ hàng');
toast.error('Vui lòng đăng nhập để tiếp tục');
```

### Pattern G — Form với react-hook-form + zod
```tsx
const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
});
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

---

## Sub-plan 1 (đầy đủ chi tiết) — B2C E-commerce (11 màn hình)

Xem file `docs/superpowers/plans/2026-06-17-pcms-b2c-ecommerce.md`.

---

## Sub-plan 2 — B2C Tra cứu (8 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-b2c-lookup.md`

### Tasks
- **Task 1:** `src/data/shop/drug-ingredients.ts` (20 hoạt chất) + `src/data/shop/herbs.ts` (15 dược liệu) + `src/data/shop/articles.ts` (10 bài viết) + `src/data/shop/diseases.ts` (8 bệnh) + `src/data/shop/cancer-info.ts` (1 bài dài) + `src/data/shop/videos.ts` (12 video).
- **Task 2:** `src/components/shop/DrugAlphabetFilter.tsx` (A-Z filter) + `IngredientCard.tsx` + `HerbCard.tsx` + `ArticleCard.tsx` + `DiseaseCard.tsx` + `VideoCard.tsx`.
- **Task 3:** `src/app/(shop)/tra-cuu-thuoc/page.tsx` (SHOP-LOOKUP-DRUG) — search + A-Z + grid 30 thuốc.
- **Task 4:** `src/app/(shop)/tra-cuu-thuoc/[slug]/page.tsx` (detail) — Tabs (Công dụng / Liều dùng / Tác dụng phụ / Bảo quản).
- **Task 5:** `src/app/(shop)/tra-cuu-duoc-chat/page.tsx` + `[slug]/page.tsx` (SHOP-LOOKUP-INGREDIENT).
- **Task 6:** `src/app/(shop)/tra-cuu-duoc-lieu/page.tsx` + `[slug]/page.tsx` (SHOP-LOOKUP-HERB).
- **Task 7:** `src/app/(shop)/tra-thuoc-chinh-hang/page.tsx` (SHOP-VERIFY-ORIGIN) — form nhập mã vạch + VerifyOriginScanner.
- **Task 8:** `src/app/(shop)/bai-viet/page.tsx` + `[slug]/page.tsx` (SHOP-HEALTH-ARTICLE) — list filter theo category + long-form.
- **Task 9:** `src/app/(shop)/benh-thuong-gap/page.tsx` + `[slug]/page.tsx` (SHOP-DISEASE-INFO).
- **Task 10:** `src/app/(shop)/chuyen-trang-ung-thu/page.tsx` (SHOP-CANCER-INFO) — long-form với sidebar TOC.
- **Task 11:** `src/app/(shop)/video/page.tsx` (SHOP-VIDEO) — masonry grid với VideoCard.

---

## Sub-plan 3 — B2C Store Locator + Vaccine (7 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-b2c-store-vaccine.md`

### Tasks
- **Task 1:** `src/data/shop/branches.ts` (8 chi nhánh mock với lat/lng, opening_hours, services) + `src/data/shop/vaccines.ts` (10 vắc xin + gói tiêm).
- **Task 2:** `src/components/shop/StoreMap.tsx` (Leaflet map placeholder) + `StoreListItem.tsx` + `VaccineCard.tsx` + `VaccineBookingForm.tsx`.
- **Task 3:** `src/app/(shop)/he-thong-cua-hang/page.tsx` (STORE-LOCATOR) — search bar + filter tỉnh + map placeholder + list.
- **Task 4:** `src/app/(shop)/he-thong-cua-hang/[province]/page.tsx` (STORE-LIST-PROVINCE) — list theo tỉnh.
- **Task 5:** `src/app/(shop)/he-thong-cua-hang/[province]/[id]/page.tsx` (STORE-DETAIL) — info + map + dịch vụ + nút chỉ đường.
- **Task 6:** `src/app/(shop)/dat-lich-tu-van/page.tsx` (STORE-CONSULT) — modal 4 tiêu chí Long Châu (đúng thuốc/đúng liều/đúng cách/đúng giá) + form đặt lịch.
- **Task 7:** `src/app/(shop)/tiem-chung/page.tsx` (VACCINE-HOME) — grid vắc xin + section gói tiêm + CTA.
- **Task 8:** `src/app/(shop)/tiem-chung/dat-lich/page.tsx` (VACCINE-BOOKING) — 3 bước (chọn vắc xin / chi nhánh / ngày giờ).
- **Task 9:** `src/app/(shop)/tiem-chung/so-tiem/page.tsx` (VACCINE-LEDGER) — timeline lịch sử tiêm.

---

## Sub-plan 4 — B2C Customer Account (9 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-b2c-account.md`

### Tasks
- **Task 1:** `src/lib/auth/CustomerAuthProvider.tsx` (re-export từ auth, nhưng role=CUSTOMER) + `src/app/(auth)/layout.tsx` (AuthGuard cho B2C customer).
- **Task 2:** `src/components/shop/CustomerProfileForm.tsx` + `AddressBook.tsx` + `FamilyMemberCard.tsx` + `WalletLedger.tsx` + `PrescriptionHistoryItem.tsx` + `PointsHistoryItem.tsx`.
- **Task 3:** `src/app/(auth)/login/page.tsx` (CUST-LOGIN) — ghi đè SCR-LOGIN, thêm SMS OTP + VNeID button (mock).
- **Task 4:** `src/app/(auth)/(customer)/profile/page.tsx` (CUST-PROFILE) — avatar + form cá nhân.
- **Task 5:** `src/app/(auth)/(customer)/addresses/page.tsx` (CUST-ADDRESS) — list + add/edit modal.
- **Task 6:** `src/app/(auth)/(customer)/family/page.tsx` (CUST-FAMILY) — list thành viên + form thêm (allergies/chronic_conditions).
- **Task 7:** `src/app/(auth)/(customer)/wallet/page.tsx` (CUST-HEALTH-WALLET) — số dư + lịch sử giao dịch + nạp/rút (mock).
- **Task 8:** `src/app/(auth)/(customer)/prescriptions/page.tsx` (CUST-RX-HISTORY) — list đơn thuốc đã mua + nút tải PDF.
- **Task 9:** `src/app/(auth)/(customer)/points/page.tsx` (CUST-POINTS) — điểm hiện tại + tier + lịch sử + đổi quà (mock).
- **Task 10:** `src/app/(auth)/(customer)/favorites/page.tsx` (CUST-FAVORITES) — grid sản phẩm yêu thích.
- **Task 11:** `src/app/(auth)/(customer)/notifications/page.tsx` (CUST-NOTIF-SETTINGS) — toggle push/email/SMS + loại thông báo.

---

## Sub-plan 5 — AI Features (4 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-ai-features.md`

### Tasks
- **Task 1:** `src/data/shop/ai-suggestions.ts` (mock response: 20 câu hỏi thường gặp + answer + citations).
- **Task 2:** `src/components/shop/ChatBubble.tsx` + `ChatInput.tsx` + `DrugInteractionResult.tsx`.
- **Task 3:** `src/app/(shop)/ai/chat/page.tsx` (CHAT-AI) — full-height chat UI với sidebar gợi ý câu hỏi + typing indicator.
- **Task 4:** `src/app/(shop)/ai/rx-ocr/page.tsx` (AI-RX-OCR) — drag-drop upload + preview ảnh + nút "AI đọc đơn" + result table (tên thuốc / liều / tần suất) với CTA "Gửi dược sĩ duyệt".
- **Task 5:** `src/app/(shop)/ai/drug-check/page.tsx` (AI-DRUG-CHECK) — multi-select danh sách thuốc + allergies + food → hiển thị kết quả (severity MINOR/MODERATE/MAJOR/CONTRAINDICATED) với màu cảnh báo.
- **Task 6:** `src/app/(shop)/ai/semantic-search/page.tsx` (AI-SEMANTIC-SEARCH) — input triệu chứng → gợi ý sản phẩm.

---

## Sub-plan 6 — Pharmacist Workbench (5 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-pharmacist-workbench.md`

### Tasks
- **Task 1:** `src/app/(dashboard)/rx-console/layout.tsx` — sub-navigation cho 5 màn hình.
- **Task 2:** `src/components/PharmacistConsultPanel.tsx` + `Customer360Timeline.tsx` + `FollowUpTaskCard.tsx` + `VipBadge.tsx`.
- **Task 3:** `src/app/(dashboard)/rx-console/consult/page.tsx` (RX-CONSULT) — 2 cột (customer list left, chat/video right).
- **Task 4:** `src/app/(dashboard)/rx-console/customer-360/page.tsx` (RX-CUST-PROFILE-360) — customer picker + timeline toàn diện.
- **Task 5:** `src/app/(dashboard)/rx-console/cross-sell/page.tsx` (RX-CROSS-SELL) — order input → AI suggestions table.
- **Task 6:** `src/app/(dashboard)/rx-console/follow-up/page.tsx` (RX-FOLLOW-UP) — calendar view các task follow-up.
- **Task 7:** `src/app/(dashboard)/rx-console/vip/page.tsx` (RX-VIP-MARK) — customer list + flag toggle.

---

## Sub-plan 7 — Health Tools (2 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-health-tools.md`

### Tasks
- **Task 1:** `src/data/shop/quizzes.ts` (8 bài quiz: trí nhớ, tiểu đường, suy giáp, hen, tim mạch, Alzheimer, GERD, bình xịt) — mỗi bài 5-10 câu hỏi + scoring.
- **Task 2:** `src/components/shop/HealthQuizCard.tsx` + `HealthQuizQuestion.tsx` + `HealthQuizResult.tsx`.
- **Task 3:** `src/app/(shop)/suc-khoe/kiem-tra/page.tsx` (HEALTH-QUIZ-LIST) — grid 8 quiz card.
- **Task 4:** `src/app/(shop)/suc-khoe/kiem-tra/[slug]/page.tsx` (HEALTH-QUIZ-RESULT) — multi-step question + result với risk level + advice + CTA.

---

## Sub-plan 8 — Mobile App PWA (2 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-mobile-pwa.md`

### Tasks
- **Task 1:** `src/data/shop/reminders.ts` (5 mock reminders) + `src/components/shop/MobileAppGrid.tsx` + `MedicationReminderForm.tsx`.
- **Task 2:** `src/app/(shop)/mobile/page.tsx` (MOBILE-HOME) — full-screen PWA-style layout với 8 icon grid (Nhắc uống thuốc / Sổ tiêm / Đơn thuốc / Tư vấn / Tìm nhà thuốc / Vắc xin / Tra thuốc / Đặt hàng nhanh).
- **Task 3:** `src/app/(shop)/mobile/nhac-uong-thuoc/page.tsx` (MOBILE-MED-REMINDER list) — list reminders với adherence rate.
- **Task 4:** `src/app/(shop)/mobile/nhac-uong-thuoc/new/page.tsx` (MOBILE-MED-REMINDER create) — 5-step wizard.

---

## Sub-plan 9 — E-commerce Operations (4 màn hình, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-ecom-ops.md`

### Tasks
- **Task 1:** `src/components/shop/VoucherCard.tsx` + `VoucherInput.tsx` + `ReviewForm.tsx` + `ReviewCard.tsx` + `LiveChatWindow.tsx` + `FlashSaleCountdown.tsx` + `FlashSaleProductCard.tsx`.
- **Task 2:** `src/app/(shop)/voucher/page.tsx` (SHOP-VOUCHER) — input mã + list voucher khả dụng + lịch sử dùng.
- **Task 3:** `src/app/(shop)/reviews/page.tsx` (SHOP-REVIEW list my) + `[productSlug]/page.tsx` (create).
- **Task 4:** `src/app/(shop)/live-chat/page.tsx` (SHOP-LIVE-CHAT) — chat với dược sĩ realtime (mock với setInterval).
- **Task 5:** `src/app/(shop)/flash-sale/page.tsx` (SHOP-FLASH-SALE list) + `[id]/page.tsx` (detail với countdown).

---

## Sub-plan 10 — Static Pages còn lại (3 files, outline)

**File path:** `docs/superpowers/plans/2026-06-17-pcms-static-pages.md`

### Tasks
- **Task 1:** Bổ sung 3 policies vào `src/data/policies.tsx`: `giao-hang`, `doi-tra`, `tos` (đã có `bao-mat`).
- **Task 2:** Verify `/chinh-sach/[slug]/page.tsx` render đúng 3 policies mới.

> 3 pages này tận dụng `PolicyPage` component đã có sẵn → chỉ cần data.

---

## Commit Convention

```
feat(shop): add SHOP-HOME with hero, categories, bestseller
feat(shop): add SHOP-CAT-1 category list
feat(shop): add SHOP-PDP product detail page
feat(shop): add SHOP-CART with line items
feat(shop): add SHOP-CHECKOUT 4-step flow
feat(ai): add CHAT-AI chat interface
feat(rx-console): add RX-CONSULT panel
feat(health): add HEALTH-QUIZ-LIST and RESULT
feat(pwa): add MOBILE-HOME grid layout
feat(ecom): add SHOP-VOUCHER and SHOP-FLASH-SALE
feat(static): add 3 remaining policy pages
fix(shop): responsive PDP gallery on mobile
chore(shop): add mock data for products, branches, vaccines
docs(plan): add 10 sub-plans for 57 missing screens
```

---

## Self-Review Checklist

✅ **Spec coverage:** 85/85 screens (28 B2B đã có + 57 sẽ có). 10 sub-plans cover 10 nhóm chức năng.
✅ **DRY:** Shared components trong `src/components/ui/*` và `src/components/shop/*` được reuse.
✅ **YAGNI:** Mỗi screen dùng mock data, không xây backend.
✅ **TDD:** Mỗi task có thể test bằng `npm run dev` + click flow thủ công. Tự động test không ưu tiên vì là UI mockup.
✅ **Frequent commits:** 1 commit / task.

---

## Execution Handoff

**Plan master đã lưu tại `docs/superpowers/plans/2026-06-17-pcms-ui-completion.md`.**

**Bước tiếp theo:**
1. Tạo file sub-plan 1 chi tiết tại `docs/superpowers/plans/2026-06-17-pcms-b2c-ecommerce.md` (xem dưới).
2. Thực thi sub-plan 1 (B2C E-commerce) bằng Subagent-Driven Development.
3. Sau khi sub-plan 1 hoàn thành và merged, lặp lại cho sub-plan 2-10.
