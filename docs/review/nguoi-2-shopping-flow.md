# Người 2 — Shopping Flow (17 màn hình)

**Domain:** Toàn bộ flow mua sắm: duyệt sản phẩm → giỏ hàng → thanh toán → đơn hàng → đánh giá
**Backend liên quan:** `customer-portal-service`, `order-service`, `payment-service`

| # | Màn hình | Route | File |
|---|----------|-------|------|
| 1 | Trang chủ Customer | `/` | `src/app/(customer)/page.tsx` |
| 2 | Danh mục cấp 1 | `/[slug]` | `src/app/(customer)/[slug]/page.tsx` |
| 3 | Danh mục cấp 2 | `/[slug]/[subSlug]` | `src/app/(customer)/[slug]/[subSlug]/page.tsx` |
| 4 | Chi tiết sản phẩm | `/[slug]/[subSlug]/[productSlug]` | `src/app/(customer)/[slug]/[subSlug]/[productSlug]/page.tsx` |
| 5 | Giỏ hàng | `/cart` | `src/app/(customer)/cart/page.tsx` |
| 6 | Thanh toán | `/checkout` | `src/app/(customer)/checkout/page.tsx` |
| 7 | Flash Sale | `/flash-sale` | `src/app/(customer)/flash-sale/page.tsx` |
| 8 | Chi tiết Flash Sale | `/flash-sale/[id]` | `src/app/(customer)/flash-sale/[id]/page.tsx` |
| 9 | Voucher / Mã giảm giá | `/voucher` | `src/app/(customer)/voucher/page.tsx` |
| 10 | Trả góp | `/installment` | `src/app/(customer)/installment/page.tsx` |
| 11 | Đơn hàng của tôi | `/don-hang` | `src/app/(customer)/don-hang/page.tsx` |
| 12 | Chi tiết đơn hàng | `/don-hang/[id]` | `src/app/(customer)/don-hang/[id]/page.tsx` |
| 13 | Upload toa thuốc | `/upload-toa` | `src/app/(customer)/upload-toa/page.tsx` |
| 14 | Đánh giá sản phẩm | `/reviews` | `src/app/(customer)/reviews/page.tsx` |
| 15 | Viết đánh giá mới | `/reviews/new/[productSlug]` | `src/app/(customer)/reviews/new/[productSlug]/page.tsx` |
| 16 | Hệ thống cửa hàng | `/he-thong-cua-hang` | `src/app/(customer)/he-thong-cua-hang/page.tsx` |
| 17 | Cửa hàng theo tỉnh | `/he-thong-cua-hang/[province]` | `src/app/(customer)/he-thong-cua-hang/[province]/page.tsx` |
