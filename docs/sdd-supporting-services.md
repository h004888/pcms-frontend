# SDD – Supporting Services Module Design
## Thành viên 4: Nguyễn Anh Đức

**Project:** Pharmacy Chain Management System  
**Document:** Software Design Document – Supporting Services  
**File Name:** `sdd-supporting-services.md`  
**Reference:** SRS_PhamacyChainManagementSystem_v1.0.0, SDD_PhamacyChainManagementSystem_v1.0.0  
**Backend Stack:** Java 21 + Spring Boot 3 (Microservices)  
**Frontend Stack:** Next.js 14 (App Router)  

---

## Mục lục

1. [4.9 Report Module](#49-report-module)
2. [4.10 Search Medicine Design](#410-search-medicine-design)
3. [4.10 Supplier Management Module](#410-supplier-management-module)
4. [4.11 Prescription Module](#411-prescription-module)
5. [4.12 Notification Module](#412-notification-module)

---

## 4.9 Report Module

### 1. Module Overview

Report Module phục vụ UC09 – View Reports. Cho phép Admin và Branch Manager xem và xuất các loại báo cáo: doanh thu, tồn kho và hiệu suất nhân viên. Dữ liệu được lấy qua Feign Client từ các service liên quan (Order Service, Inventory Service).

**SRS Mapping:** UC09, FR9.1 – FR9.5  
**Actors:** Admin, Branch Manager  
**Microservice:** `report-service` (port 8087)

---

### 2. Module Responsibilities

- Tạo báo cáo doanh thu (Revenue Report) theo date range và branch, hỗ trợ group by: ngày / tuần / tháng.
- Tạo báo cáo tồn kho (Inventory Report) bao gồm số lượng tồn hiện tại theo từng chi nhánh.
- Tạo báo cáo hiệu suất nhân viên (Staff Report) dựa trên số đơn hàng xử lý trong kỳ.
- Xuất báo cáo ra file Excel (.xlsx) sử dụng Apache POI.
- Xuất báo cáo ra file PDF sử dụng iText.
- Lên lịch báo cáo định kỳ (Scheduled Report) qua cron expression.
- Cung cấp real-time dashboard stats (tổng đơn hôm nay, doanh thu hôm nay).

---

### 3. Frontend Design

| Component | Trách nhiệm | Route |
|---|---|---|
| `ReportDashboard` | Trang tổng hợp báo cáo, hiển thị realtime stats | `/dashboard/reports` |
| `RevenueReport` | Hiển thị biểu đồ doanh thu theo thời gian | `/dashboard/reports/revenue` |
| `InventoryReport` | Hiển thị bảng tồn kho theo chi nhánh | `/dashboard/reports/inventory` |
| `StaffReport` | Hiển thị hiệu suất nhân viên | `/dashboard/reports/staff` |
| `ReportFilter` | Bộ lọc chung: date range, branch, group by | Component dùng chung |
| `ExportButton` | Nút tải xuống Excel hoặc PDF | Component dùng chung |
| `ReportScheduleModal` | Modal lên lịch gửi báo cáo định kỳ qua email | `/dashboard/reports/schedule` |

---

### 4. Backend Design

**Microservice:** `report-service` | Package: `com.pcms.reportservice`

| Class | Loại | Trách nhiệm |
|---|---|---|
| `ReportController` | @RestController | Xử lý tất cả HTTP request cho báo cáo và export |
| `ReportService` | interface | Định nghĩa contract: revenue(), inventory(), staff(), export() |
| `ReportServiceImpl` | @Service | Implement logic báo cáo, gọi Feign client lấy data |
| `ExcelExportService` | interface | Định nghĩa queueExcelExport() |
| `ExcelExportServiceImpl` | @Service | Dùng Apache POI tạo file .xlsx và trả về byte[] |
| `PdfExportService` | interface | Định nghĩa queuePdfExport() |
| `PdfExportServiceImpl` | @Service | Dùng iText tạo file PDF và trả về byte[] |
| `ReportScheduleService` | interface | Quản lý lịch báo cáo: create(), list(), cancel() |
| `ReportScheduleServiceImpl` | @Service | Lưu lịch vào DB, tính nextRunAt từ cron |
| `ReportScheduleExecutor` | @Component | @Scheduled chạy theo cron, gọi ReportDeliveryService |
| `ReportDeliveryService` | interface | Gửi file báo cáo đến email người nhận |
| `ReportDeliveryServiceImpl` | @Service | Tạo file + gửi qua notification-service |
| `ReportScheduleRepository` | @Repository | Spring Data JPA cho bảng report_schedules |
| `InventoryClient` | @FeignClient | Gọi inventory-service lấy dữ liệu tồn kho |
| `OrderClient` | @FeignClient | Gọi order-service lấy dữ liệu đơn hàng/doanh thu |

**DTO Classes:**

| DTO | Mô tả |
|---|---|
| `RevenueReportRequest` | fromDate, toDate, branchId, groupBy |
| `RevenueReportResponse` | totalRevenue, totalOrders, items (theo ngày/tuần/tháng) |
| `InventoryReportRequest` | branchId, fromDate, toDate |
| `InventoryReportResponse` | totalMedicines, lowStockCount, nearExpiryCount, stockItems |
| `StaffReportRequest` | fromDate, toDate, branchId |
| `StaffReportResponse` | staffStats (userId, totalOrders, totalRevenue) |
| `ReportExportRequest` | type (revenue/inventory/staff), format (excel/pdf), from, to |
| `CreateReportScheduleRequest` | type, format, branchId, cronExpression, recipientEmail, createdBy |
| `ReportScheduleResponse` | Thông tin lịch đã lưu |

---

### 5. Database Design

**Database:** `report_db` (per-service database pattern)

#### Bảng `report_schedules`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã lịch báo cáo |
| type | VARCHAR(30) | NOT NULL | revenue / inventory / staff |
| format | VARCHAR(10) | NOT NULL | excel / pdf |
| branch_id | UUID | NULLABLE | FK branch-service (null = toàn hệ thống) |
| cron_expression | VARCHAR(100) | NOT NULL | Cron expression VD: 0 8 * * MON |
| recipient_email | VARCHAR(100) | NOT NULL | Email nhận báo cáo |
| created_by | UUID | NOT NULL | FK user-service |
| active | BOOLEAN | NOT NULL DEFAULT true | Bật/tắt lịch |
| last_run_at | DATETIME | NULLABLE | Lần chạy cuối |
| next_run_at | DATETIME | NOT NULL | Lần chạy tiếp theo |
| last_status | VARCHAR(20) | NULLABLE | SUCCESS / FAILED |
| last_message | VARCHAR(500) | NULLABLE | Ghi chú lỗi nếu có |
| created_at | DATETIME | NOT NULL | Audit field |
| updated_at | DATETIME | NOT NULL | Audit field |

> **Lưu ý:** Dữ liệu báo cáo được query từ order-service và inventory-service qua Feign Client. Không lưu report data vào report_db.

**Indexes:**

| Index | Columns | Mục đích |
|---|---|---|
| idx_report_schedules_active | active | Tìm lịch đang hoạt động khi cron chạy |
| idx_report_schedules_created_by | created_by | Lọc lịch theo user |

---

### 6. API Endpoints

**Base URL:** `/api/v1/reports`

| Method | Endpoint | Mô tả | Auth | Role |
|---|---|---|---|---|
| GET | /reports/revenue | Xem báo cáo doanh thu | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/revenue | Xem báo cáo doanh thu (body) | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/inventory | Xem báo cáo tồn kho | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/inventory | Xem báo cáo tồn kho (body) | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/staff | Xem báo cáo nhân viên | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/staff | Xem báo cáo nhân viên (body) | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/realtime/stats | Real-time dashboard stats | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/realtime/recent-orders | Danh sách đơn gần đây | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/export | Xuất file (query params) | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/export/excel | Xuất file Excel (async) | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/export/pdf | Xuất file PDF (async) | Yes | ADMIN, BRANCH_MANAGER |
| POST | /reports/schedule | Tạo lịch báo cáo định kỳ | Yes | ADMIN, BRANCH_MANAGER |
| GET | /reports/schedules | Danh sách lịch báo cáo | Yes | ADMIN, BRANCH_MANAGER |
| DELETE | /reports/schedules/{id} | Hủy lịch báo cáo | Yes | ADMIN, BRANCH_MANAGER |

**Query Parameters mẫu:**

```
GET /api/v1/reports/revenue?from=2026-01-01&to=2026-06-30&branchId=uuid&groupBy=month
```

---

### 7. Business Rules

| Rule ID | Mô tả | Xử lý |
|---|---|---|
| BR-RPT-01 | Admin xem toàn hệ thống; Branch Manager chỉ xem chi nhánh mình | API đọc header X-Branch-Id từ API Gateway |
| BR-RPT-02 | fromDate phải nhỏ hơn hoặc bằng toDate | 400 Bad Request nếu vi phạm |
| BR-RPT-03 | Export phải có filter hợp lệ trước khi tạo file | Validate trước khi gọi ExportService |
| BR-RPT-04 | Lịch báo cáo chỉ tạo/hủy bởi Admin hoặc Branch Manager | Xác thực qua JWT role |

---

### 8. Error Handling

| Trường hợp | Phản hồi |
|---|---|
| fromDate > toDate | 400 Bad Request |
| Không có dữ liệu trong kỳ | 200 OK, data rỗng |
| Feign Client lỗi (service down) | 503 Service Unavailable |
| Export type không hợp lệ | 400 Bad Request |
| Không đủ quyền | 403 Forbidden |

---

### 9. Diagrams Required

- **Report Sequence Diagram:** Luồng từ người dùng chọn filter đến khi nhận file export.
- **Report Class Diagram (Backend):** ReportController -> ReportService -> ExcelExportService / PdfExportService -> Feign Clients.
- **Report Scheduler Diagram:** @Scheduled -> ReportScheduleExecutor -> ReportDeliveryService.

---

### 10. Traceability

| SRS UC/FR | SDD Component |
|---|---|
| UC09 – View Reports | Report Module (4.9) |
| FR9.1 – Revenue reports by date range | ReportService.revenue(), GET /reports/revenue |
| FR9.2 – Inventory reports | ReportService.inventory(), GET /reports/inventory |
| FR9.3 – Staff performance reports | ReportService.staff(), GET /reports/staff |
| FR9.4 – Export to Excel | ExcelExportService, POST /reports/export/excel |
| FR9.5 – Export to PDF | PdfExportService, POST /reports/export/pdf |

---

## 4.10 Search Medicine Design

### 1. Module Overview

Search Medicine phục vụ UC10 – Search Medicines. Cho phép tất cả người dùng đã xác thực tìm kiếm thuốc theo tên hoặc lọc theo nhiều tiêu chí. Triển khai trong `catalog-service`, sử dụng dynamic JPQL query trên database, không dùng Search Engine ngoài.

**SRS Mapping:** UC10, FR10.1 – FR10.4  
**Actors:** All authenticated users  
**Microservice:** `catalog-service` (port 8082)

---

### 2. Module Responsibilities

- Tìm kiếm thuốc theo tên (partial match, không phân biệt hoa thường).
- Lọc thuốc theo danh mục (categoryId), khoảng giá (minPrice – maxPrice), tình trạng tồn kho (inStock).
- Autocomplete gợi ý tên thuốc (debounced 300ms phía client, tối đa 5 kết quả).
- Hỗ trợ phân trang và sắp xếp kết quả.
- Sử dụng SQL LIKE + DB Index để tối ưu tốc độ tìm kiếm.

---

### 3. Frontend Design

| Component | Trách nhiệm | Vị trí |
|---|---|---|
| `SearchBar` | Thanh tìm kiếm với debounce 300ms | Header toàn cục |
| `MedicineFilterPanel` | Bộ lọc: danh mục, khoảng giá, tồn kho | Sidebar trang danh sách thuốc |
| `SearchResultList` | Hiển thị danh sách kết quả, phân trang | /medicines/search |
| `AutocompleteDropdown` | Dropdown gợi ý 5 kết quả đầu | Gắn vào SearchBar |

---

### 4. Backend Design

**Microservice:** `catalog-service` | Package: `com.pcms.catalogservice`

| Class | Loại | Trách nhiệm |
|---|---|---|
| `SearchController` | @RestController | Xử lý HTTP request tìm kiếm và autocomplete |
| `MedicineController` | @RestController | Xử lý CRUD thuốc |
| `SearchService` | interface | Định nghĩa autocomplete(), fullSearch() |
| `SearchServiceImpl` | @Service | Thực thi tìm kiếm với JPA dynamic query |
| `MedicineService` | interface | CRUD thuốc |
| `MedicineServiceImpl` | @Service | Implement CRUD, filter, phân trang |
| `MedicineRepository` | @Repository | Spring Data JPA + custom @Query cho search |
| `InventoryClient` | @FeignClient | Gọi inventory-service kiểm tra inStock |
| `CategoryClient` | @FeignClient | Gọi category-service lấy thông tin danh mục |
| `SupplierClient` | @FeignClient | Gọi supplier-service lấy thông tin NCC |

**DTO Classes:**

| DTO | Mô tả |
|---|---|
| `MedicineResponse` | Thông tin thuốc trả về cho search result |
| `PageResponse<T>` | Wrapper phân trang chung |
| `CreateMedicineRequest` | Tạo thuốc mới |
| `UpdateMedicineRequest` | Cập nhật thông tin thuốc |

---

### 5. Database Design

**Database:** `catalog_db` (per-service database pattern)

#### Bảng `medicines`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã thuốc |
| name | VARCHAR(200) | NOT NULL | Tên thuốc |
| slug | VARCHAR(220) | UNIQUE | URL-friendly name (auto-generated) |
| category_id | UUID | NOT NULL | FK category-service |
| supplier_id | UUID | NULLABLE | FK supplier-service |
| price | DECIMAL(15,2) | NOT NULL | Giá bán |
| unit | VARCHAR(30) | NOT NULL | Đơn vị (viên, hộp, chai...) |
| description | TEXT | NULLABLE | Mô tả thuốc |
| ingredients | TEXT | NULLABLE | Thành phần |
| usage_instructions | TEXT | NULLABLE | Hướng dẫn sử dụng |
| requires_prescription | BOOLEAN | NOT NULL DEFAULT false | Cần đơn thuốc |
| status | ENUM | NOT NULL DEFAULT ACTIVE | ACTIVE / INACTIVE |
| image_url | VARCHAR(500) | NULLABLE | Ảnh sản phẩm |
| created_at | DATETIME | NOT NULL | Audit field |
| updated_at | DATETIME | NOT NULL | Audit field |

**Indexes cho Search:**

| Index | Columns | Mục đích |
|---|---|---|
| idx_medicines_name | name | Tối ưu LIKE '%keyword%' |
| idx_medicines_category_id | category_id | Filter theo danh mục |
| idx_medicines_price | price | Filter theo khoảng giá |
| idx_medicines_status | status | Filter ACTIVE/INACTIVE |

---

### 6. API Endpoints

| Method | Endpoint | Mô tả | Auth | Role |
|---|---|---|---|---|
| GET | /search?q=paracetamol | Autocomplete tìm kiếm | Yes | All |
| GET | /search/medicines/autocomplete?q=para | Autocomplete top 5 | Yes | All |
| GET | /search/medicines?q=&categoryId=&minPrice=&maxPrice=&inStock= | Tìm kiếm đầy đủ có filter | Yes | All |
| GET | /medicines | Danh sách thuốc (phân trang) | Yes | All |
| GET | /medicines/{id} | Chi tiết thuốc | Yes | All |
| POST | /medicines | Tạo thuốc | Yes | ADMIN, WAREHOUSE_STAFF |
| PUT | /medicines/{id} | Cập nhật thuốc | Yes | ADMIN, WAREHOUSE_STAFF |
| DELETE | /medicines/{id} | Vô hiệu hóa thuốc | Yes | ADMIN |

---

### 7. Business Rules

| Rule ID | Mô tả | Xử lý |
|---|---|---|
| BR-SRCH-01 | Tìm kiếm partial match, không phân biệt hoa thường | LOWER(name) LIKE LOWER('%keyword%') |
| BR-SRCH-02 | Filter có thể kết hợp nhiều điều kiện | Dynamic JPQL với null check |
| BR-SRCH-03 | Autocomplete trả về tối đa 5 kết quả | LIMIT 5 trong query |
| BR-SRCH-04 | Chỉ trả về thuốc status = ACTIVE | Default filter status = ACTIVE |
| BR-SRCH-05 | Phân trang mặc định 20 kết quả/trang | Spring Pageable defaultValue = "20" |

---

### 8. Error Handling

| Trường hợp | Phản hồi |
|---|---|
| Keyword rỗng / null | Trả về danh sách ACTIVE toàn bộ |
| CategoryId không tồn tại | 404 Not Found |
| minPrice > maxPrice | 400 Bad Request |
| Không có kết quả | 200 OK, data = [] |

---

### 9. Diagrams Required

- **Search Sequence Diagram:** User gõ keyword -> SearchController -> SearchService -> MedicineRepository -> trả về kết quả.
- **Search Class Diagram:** SearchController -> SearchService -> MedicineRepository.

---

### 10. Traceability

| SRS UC/FR | SDD Component |
|---|---|
| UC10 – Search Medicines | Search Design (4.10) |
| FR10.1 – Search by name | SearchServiceImpl.autocomplete(), fullSearch() |
| FR10.2 – Filter by category | Query param categoryId |
| FR10.3 – Filter by price range | Query params minPrice, maxPrice |
| FR10.4 – Filter by stock | Query param inStock, gọi InventoryClient |

---

## 4.10 Supplier Management Module

### 1. Module Overview

Supplier Module phục vụ UC11 – Manage Suppliers. Cho phép Admin quản lý thông tin nhà cung cấp (CRUD) và xem lịch sử nhập hàng từng nhà cung cấp.

**SRS Mapping:** UC11, FR11.1 – FR11.2  
**Actors:** Admin  
**Microservice:** `supplier-service` (port 8089)

---

### 2. Module Responsibilities

- Tạo mới, xem, cập nhật và xóa mềm (soft delete) thông tin nhà cung cấp.
- Xem danh sách nhà cung cấp với tìm kiếm theo tên, phân trang.
- Xem chi tiết nhà cung cấp bao gồm thông tin liên hệ, mã số thuế, ngân hàng.
- Xem lịch sử cung cấp hàng (supply history) của từng nhà cung cấp.
- Nhà cung cấp bị xóa mềm sẽ chuyển status sang INACTIVE.

---

### 3. Frontend Design

| Component | Trách nhiệm | Route |
|---|---|---|
| `SupplierList` | Danh sách nhà cung cấp, tìm kiếm, phân trang | /dashboard/suppliers |
| `SupplierForm` | Form thêm mới / chỉnh sửa nhà cung cấp | /dashboard/suppliers/new, /{id}/edit |
| `SupplierDetail` | Xem chi tiết nhà cung cấp | /dashboard/suppliers/{id} |
| `SupplyHistoryTable` | Bảng lịch sử nhập hàng | Tab trong SupplierDetail |
| `DeleteSupplierDialog` | Dialog xác nhận xóa nhà cung cấp | Modal |

---

### 4. Backend Design

**Microservice:** `supplier-service` | Package: `com.pcms.supplierservice`

| Class | Loại | Trách nhiệm |
|---|---|---|
| `SupplierController` | @RestController | Xử lý HTTP request CRUD và history |
| `SupplierService` | interface | Định nghĩa list(), getById(), create(), update(), softDelete(), history() |
| `SupplierServiceImpl` | @Service | Implement business logic, validate dữ liệu |
| `SupplierRepository` | @Repository | Spring Data JPA, query tìm kiếm theo tên |
| `SupplierStatus` | enum | ACTIVE, INACTIVE |

**DTO Classes:**

| DTO | Mô tả |
|---|---|
| `CreateSupplierRequest` | name, taxCode, contactPerson, phone, email, address, bankName, bankAccount |
| `UpdateSupplierRequest` | Các field có thể cập nhật |
| `SupplierResponse` | Toàn bộ thông tin NCC bao gồm status |
| `SupplierHistoryResponse` | Thông tin lịch sử nhập hàng |
| `PageResponse<T>` | Wrapper phân trang |

---

### 5. Database Design

**Database:** `supplier_db` (per-service database pattern)

#### Bảng `suppliers`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã nhà cung cấp |
| name | VARCHAR(150) | NOT NULL | Tên nhà cung cấp |
| tax_code | VARCHAR(20) | NOT NULL UNIQUE | Mã số thuế |
| contact_person | VARCHAR(100) | NULLABLE | Người liên hệ |
| phone | VARCHAR(20) | NOT NULL | Số điện thoại |
| email | VARCHAR(100) | NULLABLE | Email |
| address | VARCHAR(255) | NULLABLE | Địa chỉ |
| bank_name | VARCHAR(100) | NULLABLE | Tên ngân hàng |
| bank_account | VARCHAR(30) | NULLABLE | Số tài khoản |
| status | ENUM | NOT NULL DEFAULT ACTIVE | ACTIVE / INACTIVE |
| created_at | DATETIME | NOT NULL | Audit field |
| updated_at | DATETIME | NOT NULL | Audit field |

> **Lưu ý:** Lịch sử nhập hàng được lấy từ inventory-service qua Feign Client, không lưu trùng lặp.

---

### 6. API Endpoints

| Method | Endpoint | Mô tả | Auth | Role |
|---|---|---|---|---|
| GET | /suppliers?search=&page=0&size=20 | Danh sách NCC, tìm kiếm theo tên | Yes | ADMIN, WAREHOUSE_STAFF |
| GET | /suppliers/{id} | Chi tiết NCC | Yes | ADMIN, WAREHOUSE_STAFF |
| POST | /suppliers | Tạo NCC mới | Yes | ADMIN |
| PUT | /suppliers/{id} | Cập nhật NCC | Yes | ADMIN |
| DELETE | /suppliers/{id} | Xóa mềm NCC | Yes | ADMIN |
| GET | /suppliers/{id}/history | Xem lịch sử cung cấp hàng | Yes | ADMIN, WAREHOUSE_STAFF |

---

### 7. Business Rules

| Rule ID | Mô tả | Xử lý |
|---|---|---|
| BR-SUP-01 | tax_code phải duy nhất trong hệ thống | DB Unique Constraint + kiểm tra trong Service |
| BR-SUP-02 | Không hard delete NCC; chỉ soft delete | softDelete() cập nhật status sang INACTIVE |
| BR-SUP-03 | NCC INACTIVE vẫn được xem chi tiết | Không filter theo status khi GET by ID |
| BR-SUP-04 | Chỉ Admin được thay đổi dữ liệu NCC | Kiểm tra role qua JWT |

---

### 8. Error Handling

| Trường hợp | Phản hồi |
|---|---|
| Tạo NCC với tax_code đã tồn tại | 409 Conflict |
| GET / DELETE NCC không tồn tại | 404 Not Found |
| Thiếu quyền Admin | 403 Forbidden |

---

### 9. Diagrams Required

- **Supplier Sequence Diagram:** Luồng tạo NCC mới: Admin -> Controller -> Service -> Repository -> DB.
- **Supplier Class Diagram:** SupplierController -> SupplierService -> SupplierRepository -> Supplier entity.

---

### 10. Traceability

| SRS UC/FR | SDD Component |
|---|---|
| UC11 – Manage Suppliers | Supplier Module (4.10) |
| FR11.1 – CRUD supplier | SupplierController, SupplierServiceImpl |
| FR11.2 – View supply history | GET /suppliers/{id}/history, SupplierHistoryResponse |

---

## 4.11 Prescription Module

### 1. Module Overview

Prescription Module phục vụ UC12 – Issue Prescription. Cho phép Dược sĩ (Pharmacist) tạo và quản lý đơn thuốc, liên kết đơn thuốc với đơn hàng bán lẻ tại điểm bán.

**SRS Mapping:** UC12, FR12.1 – FR12.4  
**Actors:** Pharmacist  
**Microservice:** `prescription-service` (port 8090)

---

### 2. Module Responsibilities

- Tạo đơn thuốc mới với danh sách thuốc, liều lượng và chỉ định (diagnosis).
- Lưu đơn thuốc dạng nháp (DRAFT) trước khi ký chính thức.
- Ký đơn thuốc (SIGN): tạo chữ ký điện tử server-side và chuyển status sang SIGNED.
- Tự động sinh mã đơn thuốc duy nhất theo định dạng RX-yyyy#### (FR12.2).
- Liên kết đơn thuốc với đơn hàng tại điểm bán (link-order).
- In đơn thuốc (print): trả về dữ liệu để frontend render bản in.
- Hủy đơn thuốc (CANCEL) nếu chưa liên kết với đơn hàng.

---

### 3. Frontend Design

| Component | Trách nhiệm | Route |
|---|---|---|
| `PrescriptionList` | Danh sách đơn thuốc, phân trang | /dashboard/prescriptions |
| `PrescriptionForm` | Form tạo đơn: chọn bệnh nhân, thuốc, liều lượng | /dashboard/prescriptions/new |
| `PrescriptionDetail` | Xem chi tiết đơn thuốc, trạng thái | /dashboard/prescriptions/{id} |
| `PrescriptionPrintPreview` | Bản xem trước để in đơn thuốc | /dashboard/prescriptions/{id}/print |
| `PrescriptionItemRow` | Dòng thuốc trong form kê đơn | Component con trong PrescriptionForm |

---

### 4. Backend Design

**Microservice:** `prescription-service` | Package: `com.pcms.prescriptionservice`

| Class | Loại | Trách nhiệm |
|---|---|---|
| `PrescriptionController` | @RestController | Xử lý tất cả HTTP request cho đơn thuốc |
| `PrescriptionService` | interface | Định nghĩa list(), getById(), getByCode(), create(), update(), sign(), linkOrder(), print(), cancel() |
| `PrescriptionServiceImpl` | @Service | Implement logic, sinh mã RX, validate pharmacist |
| `PrescriptionRepository` | @Repository | Spring Data JPA cho bảng prescriptions |
| `CustomerClient` | @FeignClient | Gọi customer-service xác thực patient |
| `UserClient` | @FeignClient | Gọi user-service xác thực pharmacist |
| `PrescriptionStatus` | enum | DRAFT, SIGNED, CANCELLED |

**DTO Classes:**

| DTO | Mô tả |
|---|---|
| `CreatePrescriptionRequest` | patientId, doctorId, diagnosis, notes, items[], isDraft, licenseNo |
| `PrescriptionItemRequest` | medicineId, quantity, dosageInstruction |
| `UpdatePrescriptionRequest` | Cập nhật thông tin đơn khi còn DRAFT |
| `PrescriptionResponse` | Toàn bộ thông tin đơn thuốc gồm code, status, items |

---

### 5. Database Design

**Database:** `prescription_db` (per-service database pattern)

#### Bảng `prescriptions`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã nội bộ |
| code | VARCHAR(20) | NOT NULL UNIQUE | Mã đơn thuốc RX-yyyy#### (FR12.2) |
| patient_id | UUID | NOT NULL | FK customer-service (bệnh nhân) |
| doctor_id | UUID | NOT NULL | FK user-service (Pharmacist) |
| order_id | UUID | NULLABLE | FK order-service (sau khi bán hàng) |
| diagnosis | TEXT | NOT NULL | Chẩn đoán bệnh |
| notes | TEXT | NULLABLE | Ghi chú thêm |
| signature_hash | VARCHAR(255) | NOT NULL | Chữ ký điện tử (FR12.4) |
| license_no | VARCHAR(30) | NULLABLE | Số chứng chỉ hành nghề |
| status | ENUM | NOT NULL DEFAULT DRAFT | DRAFT / SIGNED / CANCELLED |
| issued_at | DATETIME | NULLABLE | Thời điểm ký chính thức |
| created_at | DATETIME | NOT NULL | Audit field |

#### Vòng đời trạng thái đơn thuốc

```
[DRAFT] ---(sign)---> [SIGNED] ---(link-order)---> [SIGNED + orderId set]
[DRAFT] ---(cancel)---> [CANCELLED]
[SIGNED, chưa có orderId] ---(cancel)---> [CANCELLED]
```

---

### 6. API Endpoints

| Method | Endpoint | Mô tả | Auth | Role |
|---|---|---|---|---|
| GET | /prescriptions?page=0&size=20 | Danh sách đơn thuốc | Yes | PHARMACIST |
| GET | /prescriptions/{id} | Chi tiết đơn thuốc | Yes | PHARMACIST |
| GET | /prescriptions/code/{code} | Tìm theo mã RX | Yes | PHARMACIST, SALES_STAFF |
| POST | /prescriptions | Tạo đơn thuốc mới (SIGNED) | Yes | PHARMACIST |
| POST | /prescriptions/draft | Lưu đơn thuốc dạng nháp | Yes | PHARMACIST |
| PUT | /prescriptions/{id} | Cập nhật đơn (chỉ khi DRAFT) | Yes | PHARMACIST |
| PUT | /prescriptions/{id}/sign | Ký đơn thuốc | Yes | PHARMACIST |
| POST | /prescriptions/{id}/sign | Ký đơn thuốc (alias) | Yes | PHARMACIST |
| POST | /prescriptions/{id}/link-order?orderId= | Liên kết với đơn hàng | Yes | PHARMACIST, SALES_STAFF |
| GET | /prescriptions/{id}/print | Lấy data để in đơn | Yes | PHARMACIST |
| POST | /prescriptions/{id}/print | In đơn thuốc (alias) | Yes | PHARMACIST |
| DELETE | /prescriptions/{id} | Hủy đơn thuốc | Yes | PHARMACIST |

---

### 7. Business Rules

| Rule ID | Mô tả | Xử lý |
|---|---|---|
| BR-RX-01 | Chỉ PHARMACIST được tạo và ký đơn thuốc | Kiểm tra role qua JWT |
| BR-RX-02 | Mã đơn thuốc tự động sinh RX-yyyy#### (FR12.2) | PrescriptionServiceImpl.generateCode() |
| BR-RX-03 | Đơn thuốc chỉ được chỉnh sửa khi status = DRAFT | Service kiểm tra status trước update |
| BR-RX-04 | Đơn chỉ được hủy khi DRAFT hoặc SIGNED chưa có orderId | Service kiểm tra status và orderId |
| BR-RX-05 | Chữ ký điện tử tạo server-side khi ký (FR12.4) | sign() tạo hash từ nội dung đơn |
| BR-RX-06 | Thuốc yêu cầu kê đơn phải có đơn trước khi bán | Validate trong order-service khi tạo đơn |

---

### 8. Error Handling

| Trường hợp | Phản hồi |
|---|---|
| patientId không tồn tại | 404 Not Found (từ CustomerClient) |
| Chỉnh sửa đơn đã SIGNED | 409 Conflict |
| Hủy đơn đã liên kết với đơn hàng | 409 Conflict |
| Mã code bị trùng (edge case) | Retry sinh mã khác |

---

### 9. Diagrams Required

- **Prescription Sequence Diagram:** Pharmacist tạo đơn -> DRAFT -> ký -> liên kết với đơn hàng.
- **Prescription State Diagram:** DRAFT -> SIGNED -> (CANCELLED hoặc liên kết orderId).
- **Prescription Class Diagram:** PrescriptionController -> PrescriptionService -> PrescriptionRepository -> Prescription entity.

---

### 10. Traceability

| SRS UC/FR | SDD Component |
|---|---|
| UC12 – Issue Prescription | Prescription Module (4.11) |
| FR12.1 – Pharmacist creates prescription | POST /prescriptions, PrescriptionServiceImpl.create() |
| FR12.2 – Unique prescription code | generateCode(), format RX-yyyy#### |
| FR12.3 – Link to order | POST /prescriptions/{id}/link-order |
| FR12.4 – Digital signature | signatureHash field, PrescriptionServiceImpl.sign() |

---

## 4.12 Notification Module

### 1. Module Overview

Notification Module phục vụ UC13 – Notifications. Hệ thống gửi thông báo nội bộ (in-app), theo dõi trạng thái đọc và tự động phát cảnh báo low stock / expiry date. SMS được mô phỏng qua MockSmsSender, không dùng dịch vụ bên thứ 3.

**SRS Mapping:** UC13, FR13.1 – FR13.4  
**Actors:** System, Admin, All authenticated users  
**Microservice:** `notification-service` (port 8091)

---

### 2. Module Responsibilities

- Gửi thông báo đến người dùng cụ thể (1-to-1) hoặc broadcast theo role/branch.
- Tạo thông báo theo template có sẵn (NTPL-LOW-STOCK, NTPL-EXPIRY, NTPL-ORDER-CANCELLED, ...).
- Tự động phát cảnh báo tồn kho thấp (BR02 – Low stock alert).
- Tự động phát cảnh báo thuốc sắp hết hạn trong 30 ngày (BR03 – Expiry alert).
- Xem danh sách thông báo theo trạng thái (tất cả / chưa đọc / đã đọc).
- Đánh dấu thông báo đã đọc (1 hoặc tất cả).
- Retry thông báo bị lỗi.
- Outbox pattern: đảm bảo không mất thông báo khi service restart.

---

### 3. Frontend Design

| Component | Trách nhiệm | Vị trí |
|---|---|---|
| `NotificationBell` | Icon chuông, hiển thị số lượng chưa đọc | Header toàn cục |
| `NotificationList` | Dropdown danh sách thông báo gần nhất | Dropdown từ NotificationBell |
| `NotificationDetail` | Trang xem nội dung chi tiết | /notifications/{id} |
| `NotificationSettings` | Cài đặt nhận thông báo | /profile/notification-settings |
| `NotificationComposeModal` | Modal soạn và gửi thông báo (Admin) | /dashboard/notifications/compose |

---

### 4. Backend Design

**Microservice:** `notification-service` | Package: `com.pcms.notificationservice`

| Class | Loại | Trách nhiệm |
|---|---|---|
| `NotificationController` | @RestController | Xử lý list, send, mark read, delete, retry, bulk/broadcast/compose |
| `NotificationSenderService` | interface | Định nghĩa createAndSend(), list(), markAsRead(), markAllAsRead(), broadcast(), compose(), retry(), softDelete() |
| `NotificationSenderServiceImpl` | @Service | Implement logic gửi và quản lý thông báo |
| `NotificationTemplateService` | interface | Quản lý template thông báo |
| `NotificationTemplateRepository` | @Repository | Spring Data JPA cho notification_templates |
| `NotificationRepository` | @Repository | Spring Data JPA cho notifications |
| `OutboxLogRepository` | @Repository | Spring Data JPA cho outbox_logs |
| `OutboxConsumerService` | interface | Xử lý outbox pattern: retry failed notifications |
| `OutboxConsumerController` | @RestController | Internal endpoint trigger outbox processing |
| `TemplateResolver` | interface | Resolve template key sang nội dung thực tế |
| `TemplateResolverImpl` | @Service | Thay thế placeholder trong template |
| `SmsSender` | interface | Định nghĩa sendSms() |
| `MockSmsSender` | @Service | Mock implementation (log SMS thay vì gửi thật) |
| `AsyncConfig` | @Configuration | Cấu hình @Async thread pool |
| `NotificationChannel` | enum | IN_APP, SMS, EMAIL |
| `NotificationStatus` | enum | PENDING, SENT, READ, FAILED |

**DTO Classes:**

| DTO | Mô tả |
|---|---|
| `CreateNotificationRequest` | recipientId, channel, template, title, body |
| `BulkNotificationRequest` | recipientIds[], channel, template, title, body |
| `BroadcastRequest` | roles[] hoặc branchId, channel, template |
| `ComposeNotificationRequest` | recipientIds[], template key, params để resolve |
| `LowStockNotificationRequest` | Payload từ inventory-service khi low stock |
| `ExpiryAlertNotificationRequest` | Payload từ inventory-service khi gần hết hạn |
| `OrderPaidNotificationRequest` | Payload từ order-service khi thanh toán thành công |
| `NotificationResponse` | Thông tin thông báo trả về client |

---

### 5. Database Design

**Database:** `notification_db` (per-service database pattern)

#### Bảng `notifications`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã thông báo |
| recipient_id | UUID | NOT NULL | FK user-service (người nhận) |
| channel | ENUM | NOT NULL | IN_APP / SMS / EMAIL |
| template | VARCHAR(50) | NULLABLE | Key template (NTPL-LOW-STOCK, ...) |
| title | VARCHAR(150) | NOT NULL | Tiêu đề thông báo |
| body | TEXT | NOT NULL | Nội dung thông báo |
| status | ENUM | NOT NULL DEFAULT PENDING | PENDING / SENT / READ / FAILED |
| retry_count | INT | NOT NULL DEFAULT 0 | Số lần retry |
| sent_at | DATETIME | NULLABLE | Thời điểm gửi thành công |
| read_at | DATETIME | NULLABLE | Thời điểm đọc thông báo |
| created_at | DATETIME | NOT NULL | Audit field |

#### Bảng `notification_templates`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã template |
| key | VARCHAR(50) | NOT NULL UNIQUE | Key tra cứu |
| title_template | VARCHAR(200) | NOT NULL | Template tiêu đề (có placeholder) |
| body_template | TEXT | NOT NULL | Template nội dung |
| channel | ENUM | NOT NULL | Kênh áp dụng |
| created_at | DATETIME | NOT NULL | Audit field |

#### Bảng `outbox_logs`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| id | UUID | PK | Mã outbox log |
| notification_id | UUID | NOT NULL | FK notifications |
| status | VARCHAR(20) | NOT NULL | PENDING / PROCESSED / FAILED |
| error_message | TEXT | NULLABLE | Chi tiết lỗi |
| created_at | DATETIME | NOT NULL | Audit field |

**Indexes:**

| Index | Columns | Mục đích |
|---|---|---|
| idx_notifications_recipient_status | recipient_id, status | Lấy thông báo theo user và trạng thái |
| idx_notifications_created_at | created_at | Sắp xếp theo thời gian |

---

### 6. API Endpoints

| Method | Endpoint | Mô tả | Auth | Role |
|---|---|---|---|---|
| GET | /notifications?recipientId=&status=&page=&size= | Danh sách thông báo | Yes | All |
| GET | /notifications/unread?recipientId= | Danh sách chưa đọc | Yes | All |
| GET | /notifications/{id} | Chi tiết thông báo | Yes | All |
| POST | /notifications | Gửi thông báo 1-to-1 | Yes | ADMIN |
| POST | /notifications/bulk | Gửi thông báo nhiều người | Yes | ADMIN |
| POST | /notifications/broadcast | Gửi broadcast theo role/branch | Yes | ADMIN |
| POST | /notifications/compose | Gửi theo template key | Yes | ADMIN |
| POST | /notifications/{id}/retry | Retry thông báo bị lỗi | Yes | ADMIN |
| PUT | /notifications/{id}/read | Đánh dấu đã đọc | Yes | All |
| PUT | /notifications/read-all?recipientId= | Đánh dấu tất cả đã đọc | Yes | All |
| DELETE | /notifications/{id} | Xóa mềm thông báo | Yes | All (chủ sở hữu) |

**Cơ chế Alert tự động (Internal):**

| Trigger | Nguồn phát | Template |
|---|---|---|
| Low stock alert (BR02) | inventory-service | NTPL-LOW-STOCK |
| Expiry alert (BR03) | inventory-service (cron midnight) | NTPL-EXPIRY |
| Order auto-cancelled (BR01) | order-service | NTPL-ORDER-CANCELLED |

---

### 7. Business Rules

| Rule ID | Mô tả | Xử lý |
|---|---|---|
| BR-NOTIF-01 | Low stock alert gửi cho WAREHOUSE_STAFF và BRANCH_MANAGER chi nhánh liên quan | Broadcast với filter role + branchId |
| BR-NOTIF-02 | Expiry alert kiểm tra mỗi đêm lúc midnight (FR13.2) | @Scheduled(cron = "0 0 0 * * *") trong inventory-service |
| BR-NOTIF-03 | Thông báo thất bại lưu vào outbox_logs để retry | Outbox pattern trong OutboxConsumerService |
| BR-NOTIF-04 | Chỉ người nhận được xóa thông báo của mình | X-User-Id header kiểm tra ownership |
| BR-NOTIF-05 | SMS dùng MockSmsSender trong dev (dễ swap production) | Implement SmsSender interface |

---

### 8. Error Handling

| Trường hợp | Phản hồi |
|---|---|
| recipient không tồn tại | 404 Not Found |
| Xóa thông báo của người khác | 403 Forbidden |
| Retry thông báo đã SENT | 409 Conflict |
| Template key không tồn tại | 400 Bad Request |
| Bulk với danh sách rỗng | 400 Bad Request |

---

### 9. Diagrams Required

- **Notification Sequence Diagram (Alert Flow):** Inventory Service phát hiện low stock -> gọi Notification Service -> tạo thông báo -> gửi đến WAREHOUSE_STAFF.
- **Notification State Diagram:** PENDING -> SENT -> READ / FAILED -> (retry) -> SENT.
- **Notification Class Diagram:** NotificationController -> NotificationSenderService -> NotificationRepository + OutboxLogRepository + TemplateResolver.

---

### 10. Traceability

| SRS UC/FR | SDD Component |
|---|---|
| UC13 – Notifications | Notification Module (4.12) |
| FR13.1 – Low stock alerts | NTPL-LOW-STOCK, broadcast với WAREHOUSE_STAFF |
| FR13.2 – Expiry date alerts | NTPL-EXPIRY, cron midnight từ inventory-service |
| FR13.3 – Email and SMS channels | NotificationChannel.EMAIL, MockSmsSender |
| FR13.4 – Admin configure notification | POST /notifications/compose, template management |

---

*Tài liệu này được viết bởi Thành viên 4 – Nguyễn Anh Đức*  
*Version: 1.0 | Date: 2026-07-08*

