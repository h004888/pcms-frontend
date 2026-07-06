# Người 5 — Dashboard Operations (17 màn hình)

**Domain:** Kho, đơn hàng, Rx Console, thông báo, báo cáo
**Backend liên quan:** `inventory-service`, `order-service`, `payment-service`, `notification-service`, `report-service`, `pharmacist-workbench-service`

| # | Màn hình | Route | File |
|---|----------|-------|------|
| 1 | Chi tiết thanh toán | `/payments/[id]` | `src/app/(dashboard)/payments/[id]/page.tsx` |
| 2 | Tồn kho | `/inventory` | `src/app/(dashboard)/inventory/page.tsx` |
| 3 | Nhập kho | `/inventory/import` | `src/app/(dashboard)/inventory/import/page.tsx` |
| 4 | Xuất kho | `/inventory/export` | `src/app/(dashboard)/inventory/export/page.tsx` |
| 5 | Chuyển kho | `/inventory/transfer` | `src/app/(dashboard)/inventory/transfer/page.tsx` |
| 6 | Danh sách đơn hàng | `/orders` | `src/app/(dashboard)/orders/page.tsx` |
| 7 | Tạo đơn hàng mới | `/orders/new` | `src/app/(dashboard)/orders/new/page.tsx` |
| 8 | Chi tiết đơn hàng | `/orders/[id]` | `src/app/(dashboard)/orders/[id]/page.tsx` |
| 9 | Chi tiết hóa đơn | `/invoices/[id]` | `src/app/(dashboard)/invoices/[id]/page.tsx` |
| 10 | Danh sách thông báo | `/notifications` | `src/app/(dashboard)/notifications/page.tsx` |
| 11 | Soạn thông báo | `/notifications/compose` | `src/app/(dashboard)/notifications/compose/page.tsx` |
| 12 | Báo cáo | `/reports` | `src/app/(dashboard)/reports/page.tsx` |
| 13 | Rx Console — Tư vấn | `/rx-console/consult` | `src/app/(dashboard)/rx-console/consult/page.tsx` |
| 14 | Rx Console — Cross-sell | `/rx-console/cross-sell` | `src/app/(dashboard)/rx-console/cross-sell/page.tsx` |
| 15 | Rx Console — Customer 360° | `/rx-console/customer-360` | `src/app/(dashboard)/rx-console/customer-360/page.tsx` |
| 16 | Rx Console — Follow-up | `/rx-console/follow-up` | `src/app/(dashboard)/rx-console/follow-up/page.tsx` |
| 17 | Rx Console — VIP | `/rx-console/vip` | `src/app/(dashboard)/rx-console/vip/page.tsx` |
