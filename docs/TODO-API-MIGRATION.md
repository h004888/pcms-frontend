# TODO: Migration Mock → Real API

## Tổng quan
- **Tổng trang cần migrate**: ~60 trang
- ✅ **Đã hoàn thành**: **39+ trang**
- ⏳ **Còn lại**: ~20 trang

---

## ✅ Đã hoàn thành (39 trang)

### (auth) — 6 trang
- favorites, addresses, family, points, profile, wallet

### (customer) — 28 trang
- ai/chat, ai/semantic-search
- bai-viet, bai-viet/[slug]
- don-hang, don-hang/[id]
- voucher
- tiem-chung, tiem-chung/so-tiem, tiem-chung/dat-lich
- dat-lich-tu-van
- installment
- tra-thuoc-chinh-hang
- he-thong-cua-hang/[province], he-thong-cua-hang/[province]/[id]
- tra-cuu-thuoc, tra-cuu-thuoc/[slug]
- tra-cuu-duoc-chat, tra-cuu-duoc-lieu
- suc-khoe/kiem-tra, suc-khoe/kiem-tra/[slug]
- tim-kiem
- video
- flash-sale, flash-sale/[id]
- benh-thuong-gap
- [slug] (dynamic category)

### (dashboard) — 4 trang
- rx-console/cross-sell
- rx-console/customer-360
- rx-console/follow-up
- rx-console/vip

### (shop) — 1 trang
- tin-tuc-su-kien

---

## ⏳ Còn lại (~20 trang)

### Ưu tiên cao (cần refactor)
- [ ] `(customer)/cart/page.tsx` - Refactor cart-context.tsx dùng API
- [ ] `(customer)/checkout/page.tsx` - Dùng cart-context API
- [ ] `(customer)/[slug]/[subSlug]/page.tsx` - L2 category
- [ ] `(customer)/[slug]/[subSlug]/[productSlug]/page.tsx` - PDP
- [ ] `(customer)/homepage/page.tsx` - Hero + sub-components

### Trung bình (mock content cần API)
- [ ] `(customer)/benh-thuong-gap/[slug]/page.tsx` - Disease detail
- [ ] `(customer)/chuyen-trang-ung-thu/page.tsx` - Static landing
- [ ] `(customer)/reviews/page.tsx` - Reviews
- [ ] `(customer)/reviews/new/[productSlug]/page.tsx` - Create review

### Ưu tiên thấp
- [ ] `(customer)/ai/drug-check/page.tsx` - Drug check
- [ ] `(customer)/ai/rx-ocr/page.tsx` - OCR
- [ ] `(customer)/mobile/*` - Mobile BFF (3 pages)
- [ ] `(customer)/live-chat/page.tsx` - Live chat
- [ ] `(customer)/upload-toa/page.tsx` - Prescription upload
- [ ] `(shop)/chinh-sach/[slug]/page.tsx` - Policies (mock CMS)
- [ ] `(shop)/gioi-thieu/page.tsx` - About (static)
- [ ] `(shop)/tuyen-dung/page.tsx` - Careers (static)

---

## Hạ tầng API đã có

### Feature Services (Phase 2 mới thêm)
- vouchers, vaccines, stores, shop, consultations, installment
- verify-origin, flash-sales, rx-console, health-tools

### Components mới
- VerifyOriginScanner, HealthQuizForm
- ShopFlashSaleBanner đã migrate

### Tiến độ: **~65%** hoàn thành

### Ngày cập nhật: 2026-06-24