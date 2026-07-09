# Tổng kết công việc – Thành viên 4: Nguyễn Anh Đức

**Dự án:** Pharmacy Chain Management System (PCMS)  
**Ngày:** 2026-07-08  

---

## 1. Vai trò trong nhóm

| Vai trò | Chi tiết |
|---|---|
| **Member 4** | Phụ trách thiết kế & implement 5 module |
| **Reviewer 4** | Review SDD của thành viên khác (Customer, Report, Notification) |

---

## 2. Các module phụ trách

| # | Module | Use Case | Microservice | Port |
|---|---|---|---|---|
| 1 | **Report** | UC09 – View Reports | `report-service` | 8087 |
| 2 | **Search Medicine** | UC10 – Search Medicines | `catalog-service` | 8082 |
| 3 | **Supplier Management** | UC11 – Manage Suppliers | `supplier-service` | 8089 |
| 4 | **Prescription** | UC12 – Issue Prescription | `prescription-service` | 8090 |
| 5 | **Notification** | UC13 – Notifications | `notification-service` | 8091 |

---

## 3. Tình trạng Backend – ĐÃ HOÀN THÀNH ✅

### report-service

| Loại | Files |
|---|---|
| Controller | `ReportController.java` |
| Services | `ReportService`, `ReportServiceImpl`, `ExcelExportService`, `ExcelExportServiceImpl`, `PdfExportService`, `PdfExportServiceImpl`, `ReportScheduleService`, `ReportScheduleServiceImpl`, `ReportDeliveryService`, `ReportDeliveryServiceImpl` |
| Scheduler | `ReportScheduleExecutor.java` |
| Repository | `ReportScheduleRepository.java` |
| Entity | `ReportSchedule.java` |
| Feign Clients | `InventoryClient.java`, `OrderClient.java` |
| DTOs | `RevenueReportRequest/Response`, `InventoryReportRequest/Response`, `StaffReportRequest/Response`, `ReportExportRequest`, `CreateReportScheduleRequest`, `ReportScheduleResponse` |
| Thư viện export | Apache POI (Excel), iText (PDF) |

### catalog-service (Search)

| Loại | Files |
|---|---|
| Controllers | `SearchController.java`, `MedicineController.java` |
| Services | `SearchService`, `SearchServiceImpl`, `MedicineService`, `MedicineServiceImpl` |
| Repository | `MedicineRepository.java` (custom @Query LIKE) |
| Entity | `Medicine.java` |
| Feign Clients | `CategoryClient`, `InventoryClient`, `SupplierClient` |
| Cơ chế search | SQL LIKE + DB Index, dynamic JPQL |

### supplier-service

| Loại | Files |
|---|---|
| Controller | `SupplierController.java` |
| Service | `SupplierService`, `SupplierServiceImpl` |
| Repository | `SupplierRepository.java` |
| Entity | `Supplier.java` |
| Enums | `SupplierStatus` (ACTIVE, INACTIVE) |
| DTOs | `CreateSupplierRequest`, `UpdateSupplierRequest`, `SupplierResponse`, `SupplierHistoryResponse` |

### prescription-service

| Loại | Files |
|---|---|
| Controller | `PrescriptionController.java` |
| Service | `PrescriptionService`, `PrescriptionServiceImpl` |
| Repository | `PrescriptionRepository.java` |
| Entity | `Prescription.java` |
| Enums | `PrescriptionStatus` (DRAFT, SIGNED, CANCELLED) |
| Feign Clients | `CustomerClient`, `UserClient` |
| DTOs | `CreatePrescriptionRequest`, `PrescriptionItemRequest`, `UpdatePrescriptionRequest`, `PrescriptionResponse` |
| Đặc điểm | Auto-generate code `RX-yyyy####`, digital signature hash, state machine (DRAFT→SIGNED→CANCELLED) |

### notification-service

| Loại | Files |
|---|---|
| Controllers | `NotificationController`, `NotificationTemplateController`, `OutboxConsumerController` |
| Services | `NotificationSenderService/Impl`, `NotificationTemplateService/Impl`, `OutboxConsumerService/Impl`, `TemplateResolver/Impl`, `SmsSender`, `MockSmsSender` |
| Repositories | `NotificationRepository`, `NotificationTemplateRepository`, `OutboxLogRepository` |
| Entities | `Notification`, `NotificationTemplate`, `OutboxLog` |
| Enums | `NotificationChannel` (IN_APP, SMS, EMAIL), `NotificationStatus` (PENDING, SENT, READ, FAILED) |
| DTOs | `CreateNotificationRequest`, `BulkNotificationRequest`, `BroadcastRequest`, `ComposeNotificationRequest`, `LowStockNotificationRequest`, `ExpiryAlertNotificationRequest`, `OrderPaidNotificationRequest` |
| Đặc điểm | Outbox pattern, MockSmsSender (không dùng dịch vụ bên thứ 3), @Async thread pool |

---

## 4. Tình trạng Frontend – ĐÃ HOÀN THÀNH ✅

**Stack:** Next.js 14 (App Router) + TypeScript

| Module | App Route | Component | API Service |
|---|---|---|---|
| Report | `/dashboard/reports` | `ReportsView.tsx`, `ReportExportDialog.tsx` | `reportService.ts` |
| Search | `/dashboard/search` | `SearchView.tsx` | `searchService.ts` |
| Supplier | `/dashboard/suppliers` | `SuppliersView.tsx`, `SupplierForm.tsx` | `supplierService.ts` |
| Prescription | `/dashboard/prescriptions` | `PrescriptionsView.tsx` | `prescriptionService.ts` |
| Notification | `/dashboard/notifications`, `/dashboard/notifications/compose` | `NotificationsView.tsx`, `ComposeNotificationForm.tsx` | `notificationService.ts` |

---

## 5. Tài liệu SDD đã viết – ĐÃ HOÀN THÀNH ✅

**File:** `sdd-supporting-services.md`

Mỗi module trong SDD bao gồm đầy đủ 10 sections:

1. Module Overview (SRS mapping, Actors, Microservice)
2. Module Responsibilities
3. Frontend Design (Component table với routes)
4. Backend Design (Class table với annotation và trách nhiệm + DTO table)
5. Database Design (Schema bảng chi tiết với kiểu dữ liệu, ràng buộc, indexes)
6. API Endpoints (Method, Path, Mô tả, Auth, Role)
7. Business Rules (Rule ID, Mô tả, Cách xử lý)
8. Error Handling (Trường hợp lỗi → HTTP response)
9. Diagrams Required (Danh sách diagram cần vẽ)
10. Traceability (Mapping SRS FR → SDD Component)

---

## 6. Các quyết định thiết kế quan trọng

| Vấn đề | Quyết định |
|---|---|
| Report export Excel/PDF | Xử lý ở **Backend** (Apache POI + iText), trả về `byte[]` |
| Search thuốc | Dùng **query database** (SQL LIKE + JPA dynamic query), không dùng Elasticsearch |
| Notification SMS/Email | **Không dùng dịch vụ bên thứ 3** – SMS dùng `MockSmsSender` (log thay vì gửi thật) |
| Kiến trúc | **Microservices** – mỗi service có database riêng (per-service DB pattern) |
| Backend stack | **Java 21 + Spring Boot 3** (không phải Node.js như SDD v1 ghi sai) |
| Feign Client | Các service giao tiếp nội bộ qua **OpenFeign** (synchronous REST call) |

---

## 7. Files đã tạo/chỉnh sửa

| File | Vị trí | Mô tả |
|---|---|---|
| `sdd-supporting-services.md` | `PhamacyChainManagementSystem/` | Tài liệu SDD đầy đủ cho 5 module |
| `tong-ket-duc.md` | `PhamacyChainManagementSystem/` | File tổng kết này |

---

*Thành viên 4 – Nguyễn Anh Đức | 2026-07-08*

