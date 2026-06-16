# AGENTS

## Design Context (PCMS)

PCMS là hệ thống quản lý chuỗi nhà thuốc — Next.js 14 App Router + Tailwind + TypeScript. Giao diện authenticated app là **product register** (admin/dashboard phục vụ công việc dược sĩ hằng ngày). Trang `/login` là surface brand-led duy nhất; phần còn lại giữ giọng product.

**Primary user:** Dược sĩ (POS, kê đơn, tra cứu thuốc, thanh toán). Bối cảnh ca làm việc, có khách chờ, ánh sáng mạnh. UI phải theo kịp — không animation cản workflow.

**Strategic principles** (chi tiết trong `PRODUCT.md`):

1. **Thực hành những gì mình khuyến nghị** — giao diện chính xác như đơn thuốc. Không mơ hồ, không ẩn sau hai cú click.
2. **Tốc độ trước tiên** — một thao tác = một tương tác ngắn. Không blocking, không page-load choreography.
3. **Dày đặc nhưng có hệ thống** — bảng/panel dày đặc, nhịp thị giác rõ giữa dữ liệu/hành động/trạng thái.
4. **Bản sắc y tế tự tin** — accent navy/indigo + teal, typography sắc nét. Không minh họa hoạt hình, không pastel.
5. **Một ngôn ngữ, nhiều vai trò** — Admin/CEO/Quản lý/Dược sĩ/Khách hàng dùng chung từ vựng component.

**Visual direction** (seed, chi tiết trong `DESIGN.md`):

- **Color strategy:** Full palette — Primary (navy/indigo trầm), Accent (teal), Status (semantic), Neutral ramp lạnh.
- **Typography:** Inter cho UI + JetBrains Mono / IBM Plex Mono cho dữ liệu (SKU, số lô, đơn giá, ID).
- **Motion:** Restrained — 150–250ms state change, tôn trọng `prefers-reduced-motion`.
- **Elevation:** Flat-by-default. Border 1px + surface tách nhẹ. Shadow chỉ cho dropdown/modal/popover.
- **Density:** Cao có tổ chức — bảng nhiều dòng, panel nhiều nhãn.

**A11y:** WCAG 2.1 AA. Body contrast ≥ 4.5:1, text lớn ≥ 3:1. Focus ring rõ. Tương phản đủ đọc dưới ánh sáng mạnh.

**Anti-references (cấm dùng):**

- **AI-slop template** — eyebrow lặp lại trên mỗi section, thẻ icon+heading+text đồng nhất vô tận, gradient text, bo góc >16px trên card, glassmorphism trang trí.
- **Bootstrap admin cũ / template admin framework mặc định** — primary-600 generic, shadow+border cùng lúc trên card (ghost-card).
- **Y tế "dễ thương"** — minh họa hoạt hình, pastel, copy cố vui nhộn.
- **Dashboard bệnh viện nặng nề** — quá nhiều nút, quá nhiều màu, mật độ thiếu tổ chức.
- **Cream/sand/paper body background** — warm-neutral AI default 2026.
- **Page-load choreography** (staggered reveal, scroll-driven) — cản ca làm việc.

**Files tham chiếu:**

- `PRODUCT.md` — register, users, purpose, personality, principles, a11y.
- `DESIGN.md` — visual system (seed). Re-run `$impeccable document` ở scan mode khi có code thật để resolve hex/font/shadow.
- `.impeccable/live/config.json` — Next.js App Router, `src/app/layout.tsx` là inject target.
