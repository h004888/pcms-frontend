# 💊 PCMS Frontend - Pharmacy Chain Management System

> **Next.js 14** frontend cho hệ thống quản lý chuỗi nhà thuốc PCMS
> Kết nối với backend Spring Boot microservices (xem repo [h004888/pcms-backend](https://github.com/h004888/pcms))

**Stack:** Next.js 14.2 (App Router) · TypeScript 5.5 · Tailwind CSS 3.4 · React Hook Form 7 · Zod 3 · Axios 1.7 · Lucide Icons

---

## 📋 Tính năng

✅ **Authentication** - JWT login với email/password (UC01)
✅ **Dashboard** - Role-based KPI widgets
✅ **Quản lý người dùng** - CRUD với role-based access (UC02)
✅ **Quản lý chi nhánh** - CRUD với manager assignment (UC03)
✅ **Quản lý thuốc** - CRUD với category/supplier FK (UC04)
✅ **Danh mục thuốc** - Categories management
✅ **Nhà cung cấp** - Supplier CRUD (UC11)
✅ **Tồn kho** - Import/Export với FIFO batch tracking (UC05)
✅ **Khách hàng** - CRUD với loyalty points (UC08, BR07)
✅ **Đơn hàng** - Create with auto-discount (UC06, BR04)
✅ **Thanh toán** - Cash/Card/QR (UC07)
✅ **Đơn thuốc** - Prescription với digital signature (UC12)
✅ **Tìm kiếm** - Medicine search với autocomplete (UC10)
✅ **Thông báo** - In-app/Email/SMS (UC13, NSF-09)
✅ **Báo cáo** - Revenue/Inventory stats (UC09)

**Vietnamese UI** 🇻🇳 - Toàn bộ giao diện tiếng Việt theo SRS §4.4
**Role-based** 🔐 - Menu và chức năng thay đổi theo role (Admin/CEO/Manager/Pharmacist/Customer)
**Responsive** 📱 - Hoạt động trên mobile/tablet/desktop
**Modern Stack** ⚡ - Next.js App Router, TypeScript, Tailwind CSS

---

## 🛠 Yêu cầu môi trường

| Tool | Version | Verify |
|---|---|---|
| **Node.js** | 20+ | `node --version` |
| **npm** | 10+ | `npm --version` |
| **Backend** | PCMS API running | `http://localhost:8080` |

Backend phải đang chạy trước khi start frontend (xem [h004888/pcms](https://github.com/h004888/pcms) để biết cách start backend).

---

## 🚀 Cài đặt & Chạy

### 1. Cài Node.js 20+

**Windows:**
- Tải từ: https://nodejs.org/
- Hoặc dùng `choco install nodejs`

**macOS:**
```bash
brew install node@20
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Cài dependencies

```bash
cd pcms-frontend
npm install
```

### 3. Cấu hình API URL

Tạo/sửa file `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Nếu backend chạy ở host khác:
```bash
NEXT_PUBLIC_API_URL=http://192.168.1.100:8080/api/v1
```

### 4. Chạy dev server

```bash
npm run dev
```

Mở browser: **http://localhost:3000**

### 5. Build cho production

```bash
npm run build
npm run start
```

App sẽ chạy ở port 3000 (production mode).

---

## 📂 Cấu trúc dự án

```
pcms-frontend/
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind theme
├── postcss.config.js
├── .env.local                # API URL
├── .gitignore
├── README.md
│
├── src/
│   ├── app/                  # Next.js App Router (pages)
│   │   ├── layout.tsx        # Root layout + AuthProvider
│   │   ├── page.tsx          # Redirect to /home
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx              # SCR-LOGIN
│   │   ├── home/
│   │   │   └── page.tsx              # SCR-HOME (Dashboard)
│   │   ├── users/                     # UC02
│   │   │   ├── page.tsx              # SCR-USER-LIST
│   │   │   └── form/UserForm.tsx
│   │   ├── branches/                  # UC03
│   │   │   ├── page.tsx              # SCR-BRANCH-LIST
│   │   │   └── form/BranchForm.tsx
│   │   ├── medicines/                 # UC04
│   │   │   ├── page.tsx
│   │   │   └── form/MedicineForm.tsx
│   │   ├── categories/               # Categories
│   │   │   └── page.tsx
│   │   ├── suppliers/                 # UC11
│   │   │   └── page.tsx
│   │   ├── customers/                 # UC08
│   │   │   ├── page.tsx
│   │   │   ├── form/CustomerForm.tsx
│   │   │   └── [id]/history/page.tsx # SCR-CUST-HISTORY
│   │   ├── orders/                    # UC06
│   │   │   ├── page.tsx              # SCR-ORDER-LIST
│   │   │   ├── new/page.tsx          # SCR-ORDER-NEW (with BR04)
│   │   │   └── [id]/page.tsx         # SCR-ORDER-DETAIL
│   │   ├── payments/                  # UC07
│   │   │   └── [id]/page.tsx         # SCR-PAYMENT
│   │   ├── inventory/                 # UC05
│   │   │   ├── page.tsx              # SCR-INV-LIST
│   │   │   └── import/page.tsx       # SCR-INV-IMPORT
│   │   ├── prescriptions/             # UC12
│   │   │   └── page.tsx              # SCR-RX
│   │   ├── notifications/             # UC13
│   │   │   └── page.tsx              # SCR-NOTIF-LIST + COMPOSE
│   │   ├── reports/                   # UC09
│   │   │   └── page.tsx              # SCR-REPORT
│   │   └── search/                    # UC10
│   │       └── page.tsx              # SCR-SEARCH
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── FormControls.tsx       # Select/Textarea/Checkbox
│   │   │   ├── Card.tsx               # Card/Badge/Alert
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx              # DataTable + Pagination
│   │   │   ├── Feedback.tsx           # EmptyState/Loading/StatCard
│   │   │   └── index.ts
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx            # Role-based menu
│   │   │   ├── Header.tsx             # User dropdown
│   │   │   ├── DashboardLayout.tsx    # Auth guard
│   │   │   └── index.ts
│   │   └── shared/
│   │       └── ListPage.tsx           # Generic CRUD list page
│   │
│   ├── lib/
│   │   ├── api.ts                     # Axios + token interceptor
│   │   ├── auth.ts                    # Login/logout helpers
│   │   ├── auth-context.tsx           # React Context for auth
│   │   ├── utils.ts                   # Formatters (VND, date, status)
│   │   └── menu.ts                    # Role-based menu config
│   │
│   ├── hooks/
│   │   └── useApi.ts                  # useApiList, useApiDetail
│   │
│   └── types/
│       └── index.ts                   # All TypeScript types
```

---

## 🔐 Demo Accounts

Sau khi tạo user trong database (xem hướng dẫn ở repo backend), bạn có thể đăng nhập với:

| Role | Email | Password | Quyền |
|---|---|---|---|
| Admin | `admin@pcms.vn` | `admin123` | Toàn quyền |
| CEO | `ceo@pcms.vn` | `ceo123` | Toàn quyền trừ users |
| Pharmacist | `pharmacist@pcms.vn` | `pharma123` | Bán hàng, kê đơn |

Xem cách tạo user mẫu trong [backend README](https://github.com/h004888/pcms#-c%C3%A1ch-ch%E1%BA%A1y-d%E1%BB%B1-%C3%A1n).

---

## 🎨 Screenshots

_(Coming soon)_

| Login | Dashboard | Orders |
|:---:|:---:|:---:|
| TBD | TBD | TBD |

---

## 🔧 Tech Stack Details

### Core
- **Next.js 14.2** - React framework với App Router
- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library
- **react-hot-toast** - Toast notifications

### Forms & Validation
- **react-hook-form 7** - Form state management
- **zod 3** - Schema validation
- **@hookform/resolvers** - Connect zod to RHF

### HTTP & Data
- **axios 1.7** - HTTP client
- **date-fns 3** - Date utilities
- **clsx 2** - Conditional className

---

## 🐛 Troubleshooting

### ❌ "Failed to connect to localhost:8080"

**Fix:** Đảm bảo backend đang chạy:
```bash
# Check Eureka
curl http://localhost:8761/actuator/health
# Phải trả về: {"status":"UP"}
```

### ❌ "Network Error" khi login

**Fix:** Check CORS. Backend phải cho phép frontend origin. Nếu chưa, thêm vào backend API Gateway config.

### ❌ Build fails với "Module not found"

**Fix:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### ❌ Tailwind classes không apply

**Fix:** Restart dev server. Tailwind cần scan lại files.

### ❌ Port 3000 đã được dùng

**Fix:** Chạy ở port khác:
```bash
npm run dev -- -p 3001
```

---

## 📜 Scripts có sẵn

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build cho production
npm run start        # Chạy production build
npm run lint         # Chạy ESLint
npm run type-check   # TypeScript type check
```

---

## 🚀 Deploy lên Vercel (Khuyến nghị)

1. Push code lên GitHub (đã làm ✅)
2. Truy cập https://vercel.com
3. Import repo `h004888/pcms-frontend`
4. Set environment variable: `NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1`
5. Deploy!

Vercel sẽ tự động:
- Build Next.js app
- Generate preview URLs cho mỗi PR
- Tự động deploy khi push main

---

## 🤝 Liên kết

- **Frontend repo:** https://github.com/h004888/pcms-frontend
- **Backend repo:** https://github.com/h004888/pcms
- **SRS Document:** [SRS_PhamacyChainManagementSystem_v1.0.0.md](../SRS_PhamacyChainManagementSystem_v1.0.0.md)

---

## 📝 Next Steps

- [ ] Implement Excel/PDF export trong Reports
- [ ] Add WebSocket cho real-time notifications
- [ ] Mobile responsive improvements
- [ ] Add charts (Chart.js / Recharts) trong Reports
- [ ] Implement i18n với next-intl
- [ ] Add Storybook cho component documentation
- [ ] E2E tests với Playwright

---

> **Lưu ý:** Frontend này kết nối với backend Spring Boot microservices. Đảm bảo backend đang chạy trước khi start frontend.

> **© 2026 PCMS** · Phiên bản 1.0.0
