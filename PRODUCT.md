# Product

## Register

product

## Users

**Primary — Dược sĩ (Pharmacist).** Người dùng chính, dùng PCMS hằng ngày tại quầy: POS bán hàng, kê đơn thuốc, tra cứu thuốc và tương tác thuốc, áp dụng loyalty/điểm thưởng, xử lý thanh toán (tiền mặt / thẻ / QR). Bối cảnh: làm việc theo ca, có khách hàng chờ, môi trường hiệu thuốc có ánh sáng mạnh. Job-to-be-done: hoàn thành một giao dịch bán thuốc có đơn chính xác, không mắc lỗi, trong thời gian ngắn nhất có thể.

**Secondary:**
- **Quản lý chi nhánh** — tồn kho, nhập/xuất FIFO theo lô, lịch sử khách, báo cáo chi nhánh.
- **CEO / Admin** — tổng quan doanh thu, tồn kho chuỗi, quản lý chi nhánh & người dùng.
- **Khách hàng** — lịch sử mua, điểm thưởng (qua trang /customers/[id]/history).

Thiết kế mặc định phục vụ dược sĩ; mọi vai trò dùng chung một từ vựng component.

## Product Purpose

PCMS (Pharmacy Chain Management System) là hệ thống vận hành chuỗi nhà thuốc — từ ca bán hàng đến quản lý tồn kho theo lô và báo cáo doanh thu theo chi nhánh. Thành công khi:
- Dược sĩ hoàn thành một ca mà không phát sinh lỗi (đặc biệt với đơn thuốc có chữ ký số).
- Quản lý ra quyết định nhập hàng / điều phối dựa trên dữ liệu tồn kho thời gian thực.
- CEO nhìn được sức khỏe chuỗi trong một màn hình tổng quan.

## Brand Personality

**Hiện đại — nhanh — gọn.**

- *Hiện đại:* cảm giác dụng cụ y tế chính xác, không phô trương. Như một máy đo huyết áp tốt — yên tĩnh, đáng tin, làm đúng việc của nó.
- *Nhanh:* ưu tiên thao tác trong 1–2 phím. Không blocking, không animation trang trí cản dòng công việc.
- *Gọn:* thông tin dày đặc nhưng có hệ thống — bảng nhiều dòng, panel nhiều nhãn, nhưng nhịp thị giác rõ ràng giữa dữ liệu và hành động.

Bản sắc y tế được mang bằng accent (teal / sage) và typography sắc nét — không phải bằng hình minh họa hoạt hình, không phải bằng màu pastel. Trang `/login` có thể mang cảm giác thương hiệu nhiều hơn (một surface brand-led duy nhất); toàn bộ authenticated app giữ giọng product.

## Anti-references

PCMS KHÔNG nên trông giống:

- **AI-slop template** — eyebrow lặp lại trên mỗi section, thẻ đồng nhất vô tận (icon + heading + text), gradient text, bo góc 32px+, glassmorphism trang trí, meta-criticism copy.
- **Bootstrap admin cũ / template admin mặc định** của framework — primary-600 generic, shadow+border mọi nơi.
- **Y tế "dễ thương"** — minh họa hoạt hình, pastel, copy cố vui nhộn. Dược sĩ cần tin tưởng, không cần đáng yêu.
- **Dashboard bệnh viện nặng nề** — quá nhiều nút, quá nhiều màu trạng thái, mật độ thiếu tổ chức.

**Tham chiếu dương (theo hướng tốt):** Linear, Stripe. Trang quản trị tối giản, kiểu chữ sắc nét, bảng màu trung tính, rất ít nhiễu. Áp dụng được cảm giác "yên tĩnh có kiểm soát" đó cho y tế.

## Design Principles

1. **Thực hành những gì mình khuyến nghị.** PCMS quản lý dược phẩm — giao diện phải chính xác như đơn thuốc. Không gì mơ hồ, không gì ẩn sau hai cú click. Tên nút, nhãn cột, trạng thái đơn hàng phải khớp với ngôn ngữ ngành.
2. **Tốc độ trước tiên.** Một thao tác = một tương tác ngắn. Tải không blocking; lỗi inline; không animation cản ca làm việc. Dược sĩ đang có khách — UI phải theo kịp.
3. **Dày đặc nhưng có hệ thống.** Bảng nhiều dòng, panel nhiều nhãn, danh sách dài — đều được chào đón. Nhịp thị giác rõ ràng phân tách dữ liệu / hành động / trạng thái; người dùng luôn biết đang nhìn gì và có thể làm gì tiếp theo.
4. **Bản sắc y tế tự tin.** Mang bản sắc bằng accent (teal / sage) và typography — không phải bằng minh họa. Bệnh viện không vui nhộn, nhưng cũng không lạnh lẽo.
5. **Một ngôn ngữ, nhiều vai trò.** Admin, CEO, Quản lý, Dược sĩ, Khách hàng dùng cùng từ vựng component — cùng shape nút, cùng form control, cùng cách phân trang. Không phải năm phiên bản giao diện.

## Accessibility & Inclusion

- **WCAG 2.1 AA tối thiểu** trên toàn bộ authenticated app.
  - Tương phản văn bản body ≥ 4.5:1, text lớn (≥18px hoặc bold ≥14px) ≥ 3:1, placeholder text cùng mức body.
  - Mọi input có `<label>`; mọi nút icon có `aria-label`; focus ring rõ (`focus-visible:ring-2`).
  - Tất cả trạng thái (selected / hover / active / disabled) đều có phiên bản tương phản đạt chuẩn, không dựa vào màu đơn thuần.
- **`prefers-reduced-motion: reduce`** — tắt transition phức tạp, page-load choreography, skeleton shimmer; giữ crossfade ≤ 150ms hoặc instant.
- **Ánh sáng môi trường y tế** — tương phản phải đủ để đọc dưới đèn huỳnh quang / nắng qua cửa hiệu thuốc. Tránh phụ thuộc vào subtle shadows.
- **Tiếng Việt có dấu** — font stack bao gồm family hỗ trợ đầy đủ (`'Inter'`, fallback `system-ui`, `Segoe UI`); line-height ≥ 1.5 cho body để dấu không chạm dòng kế; không cắt ký tự khi xuống dòng.
