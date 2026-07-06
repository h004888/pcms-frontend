# Người 1 — Auth & Trang tĩnh (17 màn hình)

**Domain:** Xác thực, hồ sơ cá nhân, trang thông tin, admin banner
**Backend liên quan:** `auth-service`, `user-service`

| # | Màn hình | Route | File |
|---|----------|-------|------|
| 1 | Đăng nhập | `/login` | `src/app/(auth)/login/page.tsx` |
| 2 | Đăng ký | `/register` | `src/app/(auth)/register/page.tsx` |
| 3 | Quên mật khẩu | `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` |
| 4 | Hồ sơ cá nhân | `/profile` | `src/app/(auth)/profile/page.tsx` |
| 5 | Sổ địa chỉ | `/addresses` | `src/app/(auth)/addresses/page.tsx` |
| 6 | Gia đình | `/family` | `src/app/(auth)/family/page.tsx` |
| 7 | Sản phẩm yêu thích | `/favorites` | `src/app/(auth)/favorites/page.tsx` |
| 8 | Điểm thưởng | `/points` | `src/app/(auth)/points/page.tsx` |
| 9 | Ví sức khỏe | `/wallet` | `src/app/(auth)/wallet/page.tsx` |
| 10 | Giới thiệu | `/gioi-thieu` | `src/app/(shop)/gioi-thieu/page.tsx` |
| 11 | Tuyển dụng | `/tuyen-dung` | `src/app/(shop)/tuyen-dung/page.tsx` |
| 12 | Tin tức & Sự kiện | `/tin-tuc-su-kien` | `src/app/(shop)/tin-tuc-su-kien/page.tsx` |
| 13 | Chi tiết chính sách | `/chinh-sach/[slug]` | `src/app/(shop)/chinh-sach/[slug]/page.tsx` |
| 14 | Quản lý Home Banner | `/admin/home-banners` | `src/app/admin/home-banners/page.tsx` |
| 15 | Tạo Banner mới | `/admin/home-banners/new` | `src/app/admin/home-banners/new/page.tsx` |
| 16 | Sửa Banner | `/admin/home-banners/[id]` | `src/app/admin/home-banners/[id]/page.tsx` |
| 17 | Tìm kiếm sản phẩm | `/tim-kiem` | `src/app/(customer)/tim-kiem/page.tsx` |
