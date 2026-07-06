# Người 4 — Services & Dashboard Master Data (17 màn hình)

**Domain:** Dịch vụ khách hàng (tiêm chủng, tư vấn) + Quản lý danh mục backend
**Backend liên quan:** `branch-service`, `catalog-service`, `customer-service`, `user-service`, `prescription-service`, `payment-service`

| # | Màn hình | Route | File |
|---|----------|-------|------|
| 1 | Tiêm chủng | `/tiem-chung` | `src/app/(customer)/tiem-chung/page.tsx` |
| 2 | Đặt lịch tiêm | `/tiem-chung/dat-lich` | `src/app/(customer)/tiem-chung/dat-lich/page.tsx` |
| 3 | Sổ tiêm | `/tiem-chung/so-tiem` | `src/app/(customer)/tiem-chung/so-tiem/page.tsx` |
| 4 | Đặt lịch tư vấn | `/dat-lich-tu-van` | `src/app/(customer)/dat-lich-tu-van/page.tsx` |
| 5 | Live Chat | `/live-chat` | `src/app/(customer)/live-chat/page.tsx` |
| 6 | Dashboard Home | `/home` | `src/app/(dashboard)/home/page.tsx` |
| 7 | Tìm kiếm toàn hệ thống | `/search` | `src/app/(dashboard)/search/page.tsx` |
| 8 | Quản lý chi nhánh | `/branches` | `src/app/(dashboard)/branches/page.tsx` |
| 9 | Quản lý danh mục | `/categories` | `src/app/(dashboard)/categories/page.tsx` |
| 10 | Quản lý thuốc | `/medicines` | `src/app/(dashboard)/medicines/page.tsx` |
| 11 | Quản lý nhà cung cấp | `/suppliers` | `src/app/(dashboard)/suppliers/page.tsx` |
| 12 | Quản lý người dùng | `/users` | `src/app/(dashboard)/users/page.tsx` |
| 13 | Danh sách khách hàng | `/customers` | `src/app/(dashboard)/customers/page.tsx` |
| 14 | Chi tiết khách hàng | `/customers/[id]` | `src/app/(dashboard)/customers/[id]/page.tsx` |
| 15 | Lịch sử khách hàng | `/customers/[id]/history` | `src/app/(dashboard)/customers/[id]/history/page.tsx` |
| 16 | Quản lý đơn thuốc | `/prescriptions` | `src/app/(dashboard)/prescriptions/page.tsx` |
| 17 | Quản lý thanh toán | `/payments` | `src/app/(dashboard)/payments/page.tsx` |
