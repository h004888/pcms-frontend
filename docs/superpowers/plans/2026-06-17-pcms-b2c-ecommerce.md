# Sub-plan 1 — PCMS B2C E-commerce (11 màn hình)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Parent plan:** `2026-06-17-pcms-ui-completion.md`

**Goal:** Xây dựng 11 màn hình Customer Portal — E-commerce theo SRS v1.4.0 §3.1.2 (Nhóm 1 — Mua sắm): SHOP-HOME, SHOP-CAT-1, SHOP-CAT-2, SHOP-PDP, SHOP-SEARCH, SHOP-CART, SHOP-CHECKOUT, SHOP-ORDER-HISTORY, SHOP-ORDER-TRACK, SHOP-RX-UPLOAD, SHOP-INSTALLMENT.

**Architecture:** Next.js 14 App Router với route group `(shop)`. Mỗi screen là `page.tsx` thuần server component, có thể chứa client components (`'use client'`) cho state (cart, filter, search). Mock data từ `src/data/shop/catalog.ts` (đã có 30 sản phẩm, 5 categories). Cart state lưu `localStorage` với key `pcms-cart` thông qua custom hook `useCart`.

**Tech Stack:** Next.js 14.2 · React 18 · TypeScript 5.5 · Tailwind CSS 3.4 · lucide-react · clsx · react-hot-toast · react-hook-form + zod.

**Nguyên tắc UI/UX (impeccable skill):**
- Hero với gradient `from-ink-900 via-ink-800 to-accent-800` (Long Châu style).
- Card product: `bg-white border border-ink-200 rounded-md hover:border-accent-500 transition`.
- Price: VND format, hiển thị `originalPrice` gạch ngang + `%` giảm giá badge.
- CTA chính: `bg-accent-600 text-white hover:bg-accent-700`.
- Sticky search bar trên mobile, hiển thị category pills.
- Breadcrumb từ `Trang chủ` → `Danh mục` → `Sản phẩm`.
- Empty state với illustration + CTA.
- Mobile bottom nav đã có sẵn (4 icons: Home, Danh mục, Đơn hàng, Tài khoản).
- Accessibility: aria-label cho icon, keyboard nav, focus-visible.

---

## Prerequisites — Shared components cần có trước

Đảm bảo các file này đã tồn tại (xem master plan để xem component chi tiết):
- `src/components/ui/Badge.tsx`
- `src/components/ui/Chip.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/Pagination.tsx`
- `src/components/ui/Breadcrumb.tsx`
- `src/components/ui/PriceDisplay.tsx`
- `src/components/shop/ProductCard.tsx` ✅ (đã có)
- `src/components/shop/ProductGrid.tsx` ✅ (đã có)
- `src/components/shop/FilterSidebar.tsx` ✅ (đã có)

Nếu chưa có, tạo trước khi bắt đầu Task 1.

---

## Task 1: Cart hook + cart utilities

**Files:**
- Create: `src/hooks/shop/useCart.ts`
- Create: `src/lib/shop/cart.ts`
- Create: `src/components/shop/CartItemRow.tsx`

- [ ] **Step 1: Tạo `src/lib/shop/cart.ts` với types + helpers**

```typescript
// src/lib/shop/cart.ts
import type { ProductSummary } from '@/types/shop/catalog';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string;
  unit: string;
  qty: number;
  prescriptionRequired: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CartState {
  items: CartItem[];
  voucherCode?: string;
  voucherDiscount?: number;
  updatedAt: number;
}

const STORAGE_KEY = 'pcms-cart';

export function loadCart(): CartState {
  if (typeof window === 'undefined') return { items: [], updatedAt: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], updatedAt: 0 };
    return JSON.parse(raw) as CartState;
  } catch {
    return { items: [], updatedAt: 0 };
  }
}

export function saveCart(state: CartState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.qty, 0);
}

export function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
}

export function addToCart(cart: CartState, product: ProductSummary, qty = 1): CartState {
  const existing = cart.items.find((it) => it.productId === product.id);
  const items = existing
    ? cart.items.map((it) =>
        it.productId === product.id ? { ...it, qty: it.qty + qty } : it
      )
    : [
        ...cart.items,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          price: product.price,
          thumbnail: product.thumbnail,
          unit: product.unit,
          qty,
          prescriptionRequired: product.prescriptionRequired,
          stockStatus: product.stockStatus,
        },
      ];
  return { ...cart, items, updatedAt: Date.now() };
}

export function updateQty(cart: CartState, productId: string, qty: number): CartState {
  if (qty <= 0) return removeFromCart(cart, productId);
  return {
    ...cart,
    items: cart.items.map((it) => (it.productId === productId ? { ...it, qty } : it)),
    updatedAt: Date.now(),
  };
}

export function removeFromCart(cart: CartState, productId: string): CartState {
  return {
    ...cart,
    items: cart.items.filter((it) => it.productId !== productId),
    updatedAt: Date.now(),
  };
}

export function clearCart(): CartState {
  return { items: [], updatedAt: Date.now() };
}
```

- [ ] **Step 2: Tạo `src/hooks/shop/useCart.ts`**

```typescript
// src/hooks/shop/useCart.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadCart,
  saveCart,
  addToCart as addToCartFn,
  updateQty as updateQtyFn,
  removeFromCart as removeFromCartFn,
  clearCart as clearCartFn,
  cartSubtotal,
  cartItemCount,
  type CartItem,
  type CartState,
} from '@/lib/shop/cart';
import type { ProductSummary } from '@/types/shop/catalog';

export function useCart() {
  const [cart, setCart] = useState<CartState>({ items: [], updatedAt: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(cart);
  }, [cart, hydrated]);

  const addItem = useCallback(
    (product: ProductSummary, qty = 1) => setCart((c) => addToCartFn(c, product, qty)),
    []
  );
  const updateItem = useCallback(
    (productId: string, qty: number) => setCart((c) => updateQtyFn(c, productId, qty)),
    []
  );
  const removeItem = useCallback(
    (productId: string) => setCart((c) => removeFromCartFn(c, productId)),
    []
  );
  const clear = useCallback(() => setCart(clearCartFn()), []);

  return {
    cart,
    items: cart.items,
    itemCount: cartItemCount(cart.items),
    subtotal: cartSubtotal(cart.items),
    addItem,
    updateItem,
    removeItem,
    clear,
    hydrated,
  };
}
```

- [ ] **Step 3: Tạo `src/components/shop/CartItemRow.tsx`**

```typescript
// src/components/shop/CartItemRow.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/shop/cart';
import { formatVND } from '@/lib/shop/cart';

interface Props {
  item: CartItem;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdate, onRemove }: Props) {
  return (
    <div className="flex gap-3 p-4 bg-white border border-ink-200 rounded-md">
      <Link href={`/thuoc/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-ink-50 rounded-md overflow-hidden">
          <Image src={item.thumbnail} alt={item.name} fill className="object-contain p-1" />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/thuoc/${item.slug}`}
          className="text-sm font-medium text-ink-900 hover:text-accent-700 line-clamp-2 text-balance"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-ink-500">{item.unit}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-accent-700">
            {formatVND(item.price)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onRemove}
          aria-label={`Xóa ${item.name}`}
          className="p-1 text-ink-400 hover:text-danger-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="flex items-center border border-ink-200 rounded-md">
          <button
            onClick={() => onUpdate(item.qty - 1)}
            aria-label="Giảm số lượng"
            className="w-7 h-7 flex items-center justify-center text-ink-700 hover:bg-ink-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-ink-900">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdate(item.qty + 1)}
            aria-label="Tăng số lượng"
            className="w-7 h-7 flex items-center justify-center text-ink-700 hover:bg-ink-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compile**

Run: `npm run type-check`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shop/cart.ts src/hooks/shop/useCart.ts src/components/shop/CartItemRow.tsx
git commit -m "feat(shop): add cart hook, helpers, and CartItemRow component"
```

---

## Task 2: SHOP-HOME — Trang chủ B2C

**Files:**
- Modify: `src/app/(shop)/page.tsx` (ghi đè placeholder)
- Create: `src/components/shop/ShopHomeHero.tsx`
- Create: `src/components/shop/ShopHomeCategories.tsx`
- Create: `src/components/shop/ShopHomeBestseller.tsx`
- Create: `src/components/shop/ShopHomeHealthTools.tsx`
- Create: `src/components/shop/ShopHomeStoreLocator.tsx`
- Create: `src/components/shop/ShopHomeShortVideos.tsx`

- [ ] **Step 1: Tạo `src/components/shop/ShopHomeHero.tsx`**

```typescript
// src/components/shop/ShopHomeHero.tsx
import Link from 'next/link';
import { Search, FileText, Pill, MessageCircle, MapPin, Calendar, Stethoscope } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search, accent: 'from-blue-500 to-blue-600' },
  { label: 'Đặt thuốc theo toa', href: '/prescriptions/upload', icon: FileText, accent: 'from-orange-500 to-orange-600' },
  { label: 'Tư vấn AI 24/7', href: '/ai/chat', icon: MessageCircle, accent: 'from-purple-500 to-purple-600' },
  { label: 'Tìm nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin, accent: 'from-emerald-500 to-emerald-600' },
  { label: 'Đặt lịch tiêm', href: '/tiem-chung', icon: Calendar, accent: 'from-rose-500 to-rose-600' },
  { label: 'Bài kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra', icon: Stethoscope, accent: 'from-cyan-500 to-cyan-600' },
];

export function ShopHomeHero() {
  return (
    <section className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-accent-100 mb-5">
            <Pill className="w-3 h-3" aria-hidden="true" />
            FPT Long Châu — Dược phẩm chính hãnh
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Đặt thuốc theo toa, mua thuốc online, nhắc uống thuốc đúng giờ
          </h1>
          <p className="mt-4 text-base md:text-lg text-accent-100 text-pretty">
            Hơn <strong className="text-white">2,678 nhà thuốc</strong> trên toàn quốc.
            Giao hàng tận nơi. Tư vấn miễn phí với dược sĩ 24/7.
          </p>
          <form
            action="/search"
            method="get"
            className="mt-8 max-w-2xl mx-auto"
            role="search"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Tìm theo tên thuốc, triệu chứng, dược chất..."
                aria-label="Tìm kiếm sản phẩm"
                className="w-full h-12 pl-12 pr-4 text-base bg-white text-ink-900 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
          </form>
        </div>

        {/* Quick actions grid */}
        <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-center gap-2 p-3 md:p-4 bg-white/10 backdrop-blur border border-white/20 rounded-md hover:bg-white/20 transition-all"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${action.accent} rounded-md flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-white text-balance">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Tạo `src/components/shop/ShopHomeCategories.tsx`**

```typescript
// src/components/shop/ShopHomeCategories.tsx
import Link from 'next/link';
import { CATEGORIES } from '@/data/shop/catalog';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

function getIcon(name?: string): LucideIcon {
  if (!name) return Icons.Pill;
  const iconMap = Icons as unknown as Record<string, LucideIcon>;
  return iconMap[name] ?? Icons.Pill;
}

export function ShopHomeCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight text-balance">
            Danh mục nổi bật
          </h2>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Khám phá theo nhu cầu của bạn
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:shadow-sm transition-all"
            >
              <div className="w-14 h-14 bg-accent-50 rounded-full flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                <Icon className="w-7 h-7 text-accent-700" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-ink-900 text-balance">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {cat.productCount.toLocaleString('vi-VN')} sản phẩm
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Tạo `src/components/shop/ShopHomeBestseller.tsx`**

```typescript
// src/components/shop/ShopHomeBestseller.tsx
import { PRODUCTS } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';

export function ShopHomeBestseller() {
  const bestsellers = PRODUCTS.filter((p) => p.tags?.includes('Bán chạy')).slice(0, 10);
  if (bestsellers.length === 0) return null;

  return (
    <section className="bg-ink-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink-900 tracking-tight text-balance">
              Sản phẩm bán chạy
            </h2>
            <p className="mt-1 text-sm text-ink-600 text-pretty">
              Được khách hàng tin dùng nhiều nhất
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

> Lưu ý: Trong file này cần import `PRODUCTS` từ catalog. Kiểm tra `src/data/shop/catalog.ts` xem tên export đúng là `PRODUCTS` hay `PRODUCTS_DATA`. Nếu là `PRODUCTS_DATA`, tạo thêm `export const PRODUCTS = PRODUCTS_DATA.map(...)` trong catalog.ts với đầy đủ `id`, `slug`.

- [ ] **Step 4: Tạo `src/components/shop/ShopHomeHealthTools.tsx`**

```typescript
// src/components/shop/ShopHomeHealthTools.tsx
import Link from 'next/link';
import { Brain, Droplet, Heart, Wind, Activity, Stethoscope, Pill, ShieldCheck } from 'lucide-react';

const QUIZZES = [
  { slug: 'tri-nho', label: 'Trí nhớ & Tập trung', icon: Brain, color: 'text-purple-600 bg-purple-50' },
  { slug: 'tien-dai-thao-duong', label: 'Tiền đái tháo đường', icon: Droplet, color: 'text-blue-600 bg-blue-50' },
  { slug: 'suy-giap', label: 'Suy giáp', icon: ShieldCheck, color: 'text-cyan-600 bg-cyan-50' },
  { slug: 'hen', label: 'Kiểm soát hen (ACT)', icon: Wind, color: 'text-sky-600 bg-sky-50' },
  { slug: 'tim-mach', label: 'Nguy cơ tim mạch', icon: Heart, color: 'text-rose-600 bg-rose-50' },
  { slug: 'alzheimer', label: 'Nguy cơ Alzheimer', icon: Brain, color: 'text-pink-600 bg-pink-50' },
  { slug: 'gerd', label: 'Trào ngược dạ dày', icon: Pill, color: 'text-amber-600 bg-amber-50' },
  { slug: 'binh-xit', label: 'Phụ thuộc bình xịt', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
];

export function ShopHomeHealthTools() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-success-50 text-success-700 text-xs font-semibold rounded-full mb-2">
            <Activity className="w-3 h-3" aria-hidden="true" />
            Miễn phí · 5 phút
          </div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight text-balance">
            Bài kiểm tra sức khỏe
          </h2>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tự đánh giá nhanh, nhận lời khuyên từ AI
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUIZZES.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <Link
              key={quiz.slug}
              href={`/suc-khoe/kiem-tra/${quiz.slug}`}
              className="group flex items-center gap-3 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${quiz.color}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-ink-900 group-hover:text-accent-700 text-balance">
                {quiz.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Tạo `src/components/shop/ShopHomeStoreLocator.tsx`**

```typescript
// src/components/shop/ShopHomeStoreLocator.tsx
import Link from 'next/link';
import { MapPin, ArrowRight, Clock, Phone } from 'lucide-react';

export function ShopHomeStoreLocator() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-emerald-600 text-white text-xs font-semibold rounded-full mb-2">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              2,678 nhà thuốc
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance">
              Tìm nhà thuốc Long Châu gần bạn
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink-600 text-pretty">
              Mở cửa 6:00 – 23:00 mỗi ngày. Tư vấn miễn phí với dược sĩ.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/he-thong-cua-hang"
                className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-emerald-600 text-white text-sm font-semibold rounded-md hover:bg-emerald-700 transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Tìm nhà thuốc
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:18006928"
                className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-white border border-ink-200 text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                1800 6928
              </a>
            </div>
          </div>
          <div className="relative h-64 bg-white border border-ink-200 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center"
              aria-label="Bản đồ nhà thuốc"
            >
              <MapPin className="w-12 h-12 text-emerald-600" aria-hidden="true" />
              <p className="ml-3 text-sm font-medium text-ink-700">Bản đồ tương tác</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Tạo `src/components/shop/ShopHomeShortVideos.tsx`**

```typescript
// src/components/shop/ShopHomeShortVideos.tsx
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';

const MOCK_VIDEOS = [
  { id: 1, title: 'Cách sử dụng Paracetamol đúng liều', thumb: '/placeholder-videos/v1.svg', duration: '2:15' },
  { id: 2, title: 'Phân biệt cảm cúm và cảm lạnh', thumb: '/placeholder-videos/v2.svg', duration: '3:40' },
  { id: 3, title: 'Bảo quản thuốc trong mùa nóng', thumb: '/placeholder-videos/v3.svg', duration: '1:55' },
  { id: 4, title: '5 dấu hiệu sốt xuất huyết cần nhập viện', thumb: '/placeholder-videos/v4.svg', duration: '4:20' },
];

export function ShopHomeShortVideos() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full mb-2">
            <Play className="w-3 h-3" aria-hidden="true" />
            Video y khoa
          </div>
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight text-balance">
            Video ngắn từ Bộ Y tế, WHO
          </h2>
        </div>
        <Link
          href="/video"
          className="text-sm font-medium text-accent-700 hover:text-accent-800 flex items-center gap-1"
        >
          Xem tất cả
          <Play className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOCK_VIDEOS.map((video) => (
          <Link
            key={video.id}
            href={`/video`}
            className="group block bg-white border border-ink-200 rounded-md overflow-hidden hover:border-accent-500 transition-all"
          >
            <div className="relative aspect-video bg-ink-100">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900">
                <Play className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 h-5 bg-black/70 text-white text-[10px] font-medium rounded">
                <Clock className="w-2.5 h-2.5" />
                {video.duration}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-ink-900 line-clamp-2 group-hover:text-accent-700 text-balance">
                {video.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Ghi đè `src/app/(shop)/page.tsx`**

```typescript
// src/app/(shop)/page.tsx
import { ShopHomeHero } from '@/components/shop/ShopHomeHero';
import { ShopHomeCategories } from '@/components/shop/ShopHomeCategories';
import { ShopHomeBestseller } from '@/components/shop/ShopHomeBestseller';
import { ShopHomeHealthTools } from '@/components/shop/ShopHomeHealthTools';
import { ShopHomeStoreLocator } from '@/components/shop/ShopHomeStoreLocator';
import { ShopHomeShortVideos } from '@/components/shop/ShopHomeShortVideos';

export default function ShopHomePage() {
  return (
    <>
      <ShopHomeHero />
      <ShopHomeCategories />
      <ShopHomeBestseller />
      <ShopHomeHealthTools />
      <ShopHomeStoreLocator />
      <ShopHomeShortVideos />
    </>
  );
}
```

- [ ] **Step 8: Run dev server + verify**

```bash
npm run dev
# Mở http://localhost:3000
# Expected: Hero gradient + 6 quick actions + 5 danh mục + sản phẩm bán chạy + 8 bài quiz + 1 video + 1 banner nhà thuốc
```

- [ ] **Step 9: Commit**

```bash
git add src/app/(shop)/page.tsx src/components/shop/ShopHome*.tsx
git commit -m "feat(shop): add SHOP-HOME with hero, categories, bestseller, health tools, store locator, videos"
```

---

## Task 3: SHOP-CAT-1 — Danh mục cấp 1

**Files:**
- Create: `src/app/(shop)/[slug]/page.tsx` (catch-all cho 5 categories, nhưng phân biệt qua flag `hasChildren`)

> Lưu ý: Vì 5 categories đều có slug khác nhau (thuoc, thuc-pham-chuc-nang, duoc-my-pham, cham-soc-ca-nhan, thiet-bi-y-te), ta tạo dynamic route `[slug]` thay vì 5 file riêng. Chỉ cần phân biệt page này với page detail trong Task 4 (xem logic ở Step 1).

- [ ] **Step 1: Tạo `src/app/(shop)/[slug]/page.tsx`**

```typescript
// src/app/(shop)/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, PRODUCTS } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => !c.children || c.children.length === 0).map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Không tìm thấy' };
  return {
    title: cat.name,
    description: `${cat.productCount} sản phẩm ${cat.name.toLowerCase()} chính hãnh tại Long Châu`,
  };
}

export default function ShopCategoryL1Page({ params }: PageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const products = PRODUCTS.filter((p) => p.categoryId === category.id).slice(0, 24);
  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[{ label: 'Trang chủ', href: '/' }, { label: category.name }]}
            className="text-accent-100"
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100">
            {category.productCount.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filter sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {hasSubcategories && (
                <div className="p-4 bg-white border border-ink-200 rounded-md">
                  <h2 className="text-sm font-semibold text-ink-900 mb-3">Danh mục con</h2>
                  <ul className="space-y-1">
                    {category.children!.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/${category.slug}/${sub.slug}`}
                          className="flex items-center justify-between px-2 py-1.5 text-sm text-ink-700 hover:bg-ink-50 rounded transition-colors"
                        >
                          <span>{sub.name}</span>
                          <span className="text-xs text-ink-500">
                            {sub.productCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-ink-600">Chưa có sản phẩm trong danh mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify route resolves**

Run: `npm run dev`
Mở `http://localhost:3000/thuoc`
Expected: Header "Thuốc" + subcategories + grid sản phẩm.

- [ ] **Step 3: Commit**

```bash
git add src/app/(shop)/[slug]/page.tsx
git commit -m "feat(shop): add SHOP-CAT-1 category list page"
```

---

## Task 4: SHOP-CAT-2 + SHOP-PDP — Danh mục cấp 2 + Product Detail

**Files:**
- Create: `src/app/(shop)/[slug]/[subSlug]/page.tsx` (CAT-2)
- Create: `src/app/(shop)/[slug]/[subSlug]/[productSlug]/page.tsx` (PDP)
- Create: `src/components/shop/ProductGallery.tsx`
- Create: `src/components/shop/ProductInfo.tsx`
- Create: `src/components/shop/ProductTabs.tsx`

- [ ] **Step 1: Tạo `src/components/shop/ProductGallery.tsx`**

```typescript
// src/components/shop/ProductGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder-products/default.svg'];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-white border border-ink-200 rounded-lg overflow-hidden">
        <Image
          src={safeImages[active]}
          alt={`${alt} - ảnh ${active + 1}`}
          fill
          className="object-contain p-4"
          priority
        />
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + safeImages.length) % safeImages.length)}
              aria-label="Ảnh trước"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5 text-ink-700" />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % safeImages.length)}
              aria-label="Ảnh sau"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white"
            >
              <ChevronRight className="w-5 h-5 text-ink-700" />
            </button>
          </>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={clsx(
                'relative aspect-square bg-white border-2 rounded-md overflow-hidden',
                active === idx ? 'border-accent-600' : 'border-ink-200 hover:border-ink-300'
              )}
            >
              <Image src={img} alt="" fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Tạo `src/components/shop/ProductInfo.tsx`**

```typescript
// src/components/shop/ProductInfo.tsx
'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Package, ShieldCheck, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/shop/useCart';
import { formatVND } from '@/lib/shop/cart';
import type { ProductDetail } from '@/types/shop/catalog';

interface Props {
  product: ProductDetail;
}

const STOCK_LABELS = {
  in_stock: { label: 'Còn hàng', class: 'text-success-700 bg-success-50' },
  low_stock: { label: 'Sắp hết', class: 'text-warning-700 bg-warning-50' },
  out_of_stock: { label: 'Hết hàng', class: 'text-danger-700 bg-danger-50' },
};

export function ProductInfo({ product }: Props) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const stock = STOCK_LABELS[product.stockStatus];

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`Đã thêm ${qty} ${product.unit.toLowerCase()} vào giỏ hàng`);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-ink-500">{product.brand} · {product.country}</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900 text-balance">{product.name}</h1>
        <p className="mt-2 text-sm text-ink-600 text-pretty">{product.shortDescription}</p>
      </div>

      {/* Rating */}
      {product.rating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(product.rating!) ? 'text-warning-500' : 'text-ink-200'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm font-medium text-ink-900">{product.rating}</span>
          <span className="text-sm text-ink-500">({product.reviewCount} đánh giá)</span>
        </div>
      )}

      {/* Price */}
      <div className="p-4 bg-ink-50 rounded-md">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-accent-700">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-base text-ink-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
              <span className="px-2 h-6 inline-flex items-center bg-danger-600 text-white text-xs font-semibold rounded">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-ink-500">Đã bao gồm VAT</p>
      </div>

      {/* Stock */}
      <div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-xs font-semibold ${stock.class}`}>
          <span className="w-1.5 h-1.5 bg-current rounded-full" />
          {stock.label}
        </span>
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-ink-200 rounded-md">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Giảm"
            className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-ink-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 h-10 text-center text-sm font-medium text-ink-900 border-x border-ink-200 focus:outline-none"
            aria-label="Số lượng"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Tăng"
            className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-ink-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stockStatus === 'out_of_stock'}
          className="flex-1 h-10 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          {product.stockStatus === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-ink-200">
        {[
          { icon: ShieldCheck, label: 'Chính hãng 100%' },
          { icon: Package, label: 'Giao tận nơi' },
          { icon: FileText, label: 'Đổi trả 30 ngày' },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="w-5 h-5 text-accent-600" />
              <span className="text-xs text-ink-600 text-balance">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Tạo `src/components/shop/ProductTabs.tsx`**

```typescript
// src/components/shop/ProductTabs.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
}

export function ProductTabs({ tabs }: Props) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="border-b border-ink-200 overflow-x-auto">
        <div className="flex gap-1 -mb-px">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActive(idx)}
              className={clsx(
                'px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                active === idx
                  ? 'border-accent-600 text-accent-700'
                  : 'border-transparent text-ink-600 hover:text-ink-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="py-6 text-sm text-ink-700 leading-relaxed">
        {tabs[active].content}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Tạo `src/app/(shop)/[slug]/[subSlug]/page.tsx`**

```typescript
// src/app/(shop)/[slug]/[subSlug]/page.tsx
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface PageProps {
  params: { slug: string; subSlug: string };
}

export default function ShopCategoryL2Page({ params }: PageProps) {
  const parent = CATEGORIES.find((c) => c.slug === params.slug);
  const sub = parent?.children?.find((s) => s.slug === params.subSlug);
  if (!parent || !sub) notFound();

  const products = PRODUCTS.filter((p) => p.categoryId === sub.id).slice(0, 24);

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: parent.name, href: `/${parent.slug}` },
              { label: sub.name },
            ]}
            className="text-accent-100"
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {sub.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100">
            {sub.productCount.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {products.length === 0 ? (
          <p className="text-center text-sm text-ink-600 py-12">Chưa có sản phẩm.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Tạo `src/app/(shop)/[slug]/[subSlug]/[productSlug]/page.tsx`**

```typescript
// src/app/(shop)/[slug]/[subSlug]/[productSlug]/page.tsx
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS } from '@/data/shop/catalog';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductInfo } from '@/components/shop/ProductInfo';
import { ProductTabs } from '@/components/shop/ProductTabs';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string; subSlug: string; productSlug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.productSlug);
  if (!product) return { title: 'Không tìm thấy' };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.productSlug);
  if (!product) notFound();

  const parent = CATEGORIES.find((c) => c.id === product.categoryId);
  const sub = parent?.children?.find((c) => c.id === product.categoryId) || parent;
  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId
  ).slice(0, 5);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            ...(parent ? [{ label: parent.name, href: `/${parent.slug}` }] : []),
            ...(sub && sub.id !== parent?.id ? [{ label: sub.name, href: `/${parent!.slug}/${sub.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={product.images} alt={product.name} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-10">
          <ProductTabs
            tabs={[
              {
                id: 'desc',
                label: 'Mô tả',
                content: (
                  <div className="prose prose-sm max-w-none">
                    <p>{product.description}</p>
                    <h4>Thành phần</h4>
                    <p>{product.ingredients}</p>
                  </div>
                ),
              },
              {
                id: 'usage',
                label: 'Công dụng & Liều dùng',
                content: (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-ink-900">Công dụng</h4>
                      <p>{product.usage}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-900">Liều dùng</h4>
                      <p>{product.dosage}</p>
                    </div>
                    {product.sideEffects && (
                      <div>
                        <h4 className="font-semibold text-ink-900">Tác dụng phụ</h4>
                        <p>{product.sideEffects}</p>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'storage',
                label: 'Bảo quản',
                content: (
                  <div>
                    <p>{product.storage}</p>
                    <p className="mt-2 text-ink-500">Hạn dùng: {product.expiryMonths} tháng từ ngày sản xuất.</p>
                  </div>
                ),
              },
              {
                id: 'reviews',
                label: `Đánh giá (${product.reviewCount ?? 0})`,
                content: <p>Xem đánh giá chi tiết trong trang sản phẩm.</p>,
              },
            ]}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink-900 mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run dev`
Mở `http://localhost:3000/thuoc` → click 1 sản phẩm → click "Thêm vào giỏ" → toast xuất hiện.

- [ ] **Step 7: Commit**

```bash
git add src/components/shop/ProductGallery.tsx src/components/shop/ProductInfo.tsx src/components/shop/ProductTabs.tsx "src/app/(shop)/[slug]/[subSlug]/page.tsx" "src/app/(shop)/[slug]/[subSlug]/[productSlug]/page.tsx"
git commit -m "feat(shop): add SHOP-CAT-2 and SHOP-PDP with gallery, info, tabs"
```

---

## Task 5: SHOP-SEARCH — Tìm kiếm B2C

**Files:**
- Create: `src/app/(shop)/search/page.tsx`
- Create: `src/components/shop/SearchFilters.tsx`
- Create: `src/components/shop/SearchResultCard.tsx`

- [ ] **Step 1: Tạo `src/components/shop/SearchResultCard.tsx`**

```typescript
// src/components/shop/SearchResultCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { ProductSummary } from '@/types/shop/catalog';
import { formatVND } from '@/lib/shop/cart';

interface Props {
  product: ProductSummary;
  highlight?: string;
}

export function SearchResultCard({ product, highlight }: Props) {
  return (
    <Link
      href={`/${product.categorySlug ?? 'thuoc'}/${product.slug}`}
      className="flex gap-4 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
    >
      <div className="relative w-24 h-24 bg-ink-50 rounded-md flex-shrink-0 overflow-hidden">
        <Image src={product.thumbnail} alt={product.name} fill className="object-contain p-2" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-500">{product.brand} · {product.country}</p>
        <h3 className="mt-1 text-sm font-medium text-ink-900 line-clamp-2 text-balance">
          {highlight ? (
            <span dangerouslySetInnerHTML={{ __html: highlight }} />
          ) : (
            product.name
          )}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-accent-700">{formatVND(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-ink-400 line-through">{formatVND(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Tạo `src/components/shop/SearchFilters.tsx`**

```typescript
// src/components/shop/SearchFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CATEGORIES } from '@/data/shop/catalog';
import { formatVND } from '@/lib/shop/cart';
import clsx from 'clsx';

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/search?${next.toString()}`);
    },
    [params, router]
  );

  const sort = params.get('sort') ?? 'relevance';
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const brand = params.get('brand');

  return (
    <aside className="space-y-4">
      <div className="p-4 bg-white border border-ink-200 rounded-md">
        <h2 className="text-sm font-semibold text-ink-900 mb-3">Sắp xếp</h2>
        <div className="space-y-1">
          {[
            { value: 'relevance', label: 'Liên quan nhất' },
            { value: 'best_selling', label: 'Bán chạy' },
            { value: 'price_asc', label: 'Giá tăng dần' },
            { value: 'price_desc', label: 'Giá giảm dần' },
            { value: 'newest', label: 'Mới nhất' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={clsx(
                'w-full text-left px-2 py-1.5 text-sm rounded transition-colors',
                sort === opt.value
                  ? 'bg-accent-50 text-accent-700 font-medium'
                  : 'text-ink-700 hover:bg-ink-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border border-ink-200 rounded-md">
        <h2 className="text-sm font-semibold text-ink-900 mb-3">Khoảng giá</h2>
        <div className="space-y-2">
          {[
            { label: 'Dưới 50K', min: '0', max: '50000' },
            { label: '50K – 200K', min: '50000', max: '200000' },
            { label: '200K – 500K', min: '200000', max: '500000' },
            { label: 'Trên 500K', min: '500000', max: '' },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                updateParam('minPrice', range.min);
                updateParam('maxPrice', range.max);
              }}
              className="block w-full text-left text-sm text-ink-700 hover:text-accent-700"
            >
              {range.label}
            </button>
          ))}
        </div>
        {(minPrice || maxPrice) && (
          <p className="mt-3 text-xs text-ink-500">
            Đang chọn: {minPrice ? formatVND(Number(minPrice)) : '0'} – {maxPrice ? formatVND(Number(maxPrice)) : '∞'}
          </p>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Tạo `src/app/(shop)/search/page.tsx`**

```typescript
// src/app/(shop)/search/page.tsx
import { Suspense } from 'react';
import { PRODUCTS } from '@/data/shop/catalog';
import { SearchFilters } from '@/components/shop/SearchFilters';
import { SearchResultCard } from '@/components/shop/SearchResultCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search as SearchIcon } from 'lucide-react';

interface PageProps {
  searchParams: { q?: string; sort?: string; minPrice?: string; maxPrice?: string };
}

export default function ShopSearchPage({ searchParams }: PageProps) {
  const q = (searchParams.q ?? '').trim().toLowerCase();
  let results = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      )
    : PRODUCTS;

  if (searchParams.minPrice) results = results.filter((p) => p.price >= Number(searchParams.minPrice));
  if (searchParams.maxPrice) results = results.filter((p) => p.price <= Number(searchParams.maxPrice));

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">
            {q ? `Kết quả cho "${searchParams.q}"` : 'Tất cả sản phẩm'}
          </h1>
          <p className="mt-1 text-sm text-ink-600">{results.length} kết quả</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <Suspense>
            <SearchFilters />
          </Suspense>
          <div>
            {results.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="Không tìm thấy sản phẩm"
                description="Thử từ khóa khác hoặc điều chỉnh bộ lọc"
              />
            ) : (
              <div className="space-y-3">
                {results.map((p) => (
                  <SearchResultCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Mở `http://localhost:3000/search?q=paracetamol`
Expected: 1+ kết quả.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(shop)/search/page.tsx" src/components/shop/SearchFilters.tsx src/components/shop/SearchResultCard.tsx
git commit -m "feat(shop): add SHOP-SEARCH with filters and result cards"
```

---

## Task 6: SHOP-CART — Giỏ hàng

**Files:**
- Create: `src/app/(shop)/cart/page.tsx`

- [ ] **Step 1: Tạo `src/app/(shop)/cart/page.tsx`**

```typescript
// src/app/(shop)/cart/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/shop/useCart';
import { CartItemRow } from '@/components/shop/CartItemRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatVND } from '@/lib/shop/cart';
import { ShoppingCart, ArrowRight, Tag } from 'lucide-react';

export default function ShopCartPage() {
  const { items, subtotal, updateItem, removeItem, hydrated } = useCart();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-32 bg-ink-100 rounded-md animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng"
          action={{ label: 'Khám phá sản phẩm', href: '/' }}
        />
      </div>
    );
  }

  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">Giỏ hàng của bạn</h1>
          <p className="mt-1 text-sm text-ink-600">{items.length} sản phẩm</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Cart items */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdate={(qty) => updateItem(item.productId, qty)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
              <h2 className="text-base font-semibold text-ink-900">Tóm tắt đơn hàng</h2>

              {/* Voucher input (mock) */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    aria-label="Mã giảm giá"
                    className="w-full h-9 pl-9 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
                <button className="px-3 h-9 bg-ink-100 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-200">
                  Áp dụng
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-600">Tạm tính</span>
                  <span className="font-medium text-ink-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Phí vận chuyển</span>
                  <span className="font-medium text-ink-900">
                    {shippingFee === 0 ? <span className="text-success-700">Miễn phí</span> : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="pt-3 border-t border-ink-200 flex justify-between items-baseline">
                  <span className="text-base font-semibold text-ink-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-accent-700">{formatVND(total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-ink-500 text-center">
                {subtotal < 200000 && (
                  <>Mua thêm {formatVND(200000 - subtotal)} để được miễn phí vận chuyển</>
                )}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Mở `/thuoc` → click "Thêm vào giỏ" → mở `/cart` → giỏ hàng hiển thị.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(shop)/cart/page.tsx"
git commit -m "feat(shop): add SHOP-CART with summary and checkout CTA"
```

---

## Task 7: SHOP-CHECKOUT — Thanh toán 4 bước

**Files:**
- Create: `src/app/(shop)/checkout/page.tsx`
- Create: `src/components/shop/CheckoutStepper.tsx`

- [ ] **Step 1: Tạo `src/components/shop/CheckoutStepper.tsx`**

```typescript
// src/components/shop/CheckoutStepper.tsx
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  current: number; // 0..3
  steps: string[];
}

export function CheckoutStepper({ current, steps }: Props) {
  return (
    <ol className="flex items-center justify-between gap-1 overflow-x-auto pb-2" aria-label="Các bước thanh toán">
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <li key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0',
                  done && 'bg-success-600 text-white',
                  active && 'bg-accent-600 text-white',
                  !done && !active && 'bg-ink-100 text-ink-500'
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={clsx(
                  'text-xs font-medium text-center whitespace-nowrap',
                  active ? 'text-ink-900' : 'text-ink-500'
                )}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={clsx(
                  'flex-1 h-0.5 mx-1 mt-[-20px]',
                  idx < current ? 'bg-success-600' : 'bg-ink-200'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: Tạo `src/app/(shop)/checkout/page.tsx`**

```typescript
// src/app/(shop)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/shop/useCart';
import { CheckoutStepper } from '@/components/shop/CheckoutStepper';
import { formatVND } from '@/lib/shop/cart';
import { MapPin, Truck, CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const STEPS = ['Địa chỉ', 'Vận chuyển', 'Thanh toán', 'Xác nhận'];

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Tiêu chuẩn', desc: '2-3 ngày', fee: 30000 },
  { id: 'express', label: 'Nhanh', desc: 'Trong ngày (HCM/HN)', fee: 60000 },
  { id: 'pickup', label: 'Nhận tại nhà thuốc', desc: 'Miễn phí', fee: 0 },
];

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Tiền mặt (COD)', icon: '💵' },
  { id: 'card', label: 'Thẻ tín dụng/ghi nợ', icon: '💳' },
  { id: 'qr', label: 'QR Pay (VietQR, MoMo)', icon: '📱' },
  { id: 'wallet', label: 'Ví Long Châu', icon: '👛' },
];

export default function ShopCheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [address, setAddress] = useState({ name: '', phone: '', line: '', province: '' });

  if (!hydrated) return null;
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-ink-600">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
      </div>
    );
  }

  const shipFee = SHIPPING_METHODS.find((m) => m.id === shipping)!.fee;
  const total = subtotal + shipFee;

  const next = () => {
    if (step === 0 && (!address.name || !address.phone || !address.line)) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    if (step < 3) setStep(step + 1);
    else {
      toast.success('Đặt hàng thành công!');
      clear();
      router.push('/orders');
    }
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl font-bold text-ink-900 text-balance">Thanh toán</h1>
          <div className="mt-4">
            <CheckoutStepper current={step} steps={STEPS} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-5 bg-white border border-ink-200 rounded-md">
          {step === 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <MapPin className="w-4 h-4" /> Địa chỉ giao hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: 'name', label: 'Họ tên', placeholder: 'Nguyễn Văn A' },
                  { key: 'phone', label: 'Số điện thoại', placeholder: '0901234567' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-medium text-ink-900">{f.label}</label>
                    <input
                      value={(address as any)[f.key]}
                      onChange={(e) => setAddress({ ...address, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-ink-900">Địa chỉ</label>
                  <input
                    value={address.line}
                    onChange={(e) => setAddress({ ...address, line: e.target.value })}
                    placeholder="Số nhà, đường, phường/xã"
                    className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-ink-900">Tỉnh/Thành phố</label>
                  <input
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    placeholder="TP. Hồ Chí Minh"
                    className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <Truck className="w-4 h-4" /> Phương thức vận chuyển
              </h2>
              <div className="space-y-2">
                {SHIPPING_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setShipping(m.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors',
                      shipping === m.id ? 'border-accent-600 bg-accent-50' : 'border-ink-200 hover:border-ink-300'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-4 h-4 rounded-full border-2',
                        shipping === m.id ? 'border-accent-600 bg-accent-600' : 'border-ink-300'
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{m.label}</p>
                      <p className="text-xs text-ink-500">{m.desc}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink-900">
                      {m.fee === 0 ? 'Miễn phí' : formatVND(m.fee)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <CreditCard className="w-4 h-4" /> Phương thức thanh toán
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors',
                      payment === m.id ? 'border-accent-600 bg-accent-50' : 'border-ink-200 hover:border-ink-300'
                    )}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="flex-1 text-sm font-medium text-ink-900">{m.label}</span>
                    <div
                      className={clsx(
                        'w-4 h-4 rounded-full border-2',
                        payment === m.id ? 'border-accent-600 bg-accent-600' : 'border-ink-300'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto bg-success-50 rounded-full flex items-center justify-center mb-3">
                <Check className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink-900">Xác nhận đơn hàng</h2>
              <p className="mt-2 text-sm text-ink-600 text-pretty">
                Đơn hàng của bạn đã sẵn sàng. Nhấn "Đặt hàng" để hoàn tất.
              </p>
              <div className="mt-4 p-3 bg-ink-50 rounded-md text-left text-sm space-y-1">
                <p><strong>Giao đến:</strong> {address.name} · {address.phone}</p>
                <p><strong>Địa chỉ:</strong> {address.line}, {address.province}</p>
                <p><strong>Vận chuyển:</strong> {SHIPPING_METHODS.find((m) => m.id === shipping)!.label}</p>
                <p><strong>Thanh toán:</strong> {PAYMENT_METHODS.find((m) => m.id === payment)!.label}</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-ink-200 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 h-10 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md disabled:opacity-50"
            >
              Quay lại
            </button>
            <div className="text-right">
              <p className="text-xs text-ink-500">Tổng cộng</p>
              <p className="text-lg font-bold text-accent-700">{formatVND(total)}</p>
            </div>
            <button
              onClick={next}
              className="px-5 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              {step === 3 ? 'Đặt hàng' : 'Tiếp tục'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Thêm 1 sản phẩm vào giỏ → `/cart` → "Tiến hành thanh toán" → đi qua 4 bước → "Đặt hàng" → redirect `/orders`.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(shop)/checkout/page.tsx" src/components/shop/CheckoutStepper.tsx
git commit -m "feat(shop): add SHOP-CHECKOUT 4-step flow (address/shipping/payment/confirm)"
```

---

## Task 8: SHOP-ORDER-HISTORY + SHOP-ORDER-TRACK

**Files:**
- Create: `src/app/(shop)/orders/page.tsx`
- Create: `src/app/(shop)/orders/[id]/page.tsx`
- Create: `src/components/shop/OrderTimeline.tsx`
- Create: `src/data/shop/orders.ts` (mock 3 orders)

- [ ] **Step 1: Tạo `src/data/shop/orders.ts`**

```typescript
// src/data/shop/orders.ts
import type { ProductSummary } from '@/types/shop/catalog';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  product: ProductSummary;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  code: string; // ORD-yyyymmdd-####
  status: OrderStatus;
  createdAt: string; // ISO
  total: number;
  shippingFee: number;
  items: OrderItem[];
  timeline: { status: OrderStatus; at: string; note?: string }[];
  address: { name: string; phone: string; line: string; province: string };
  shippingMethod: string;
  paymentMethod: string;
}

const NOW = Date.now();
const day = (n: number) => new Date(NOW - n * 86400000).toISOString();

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    code: 'ORD-20260615-0001',
    status: 'SHIPPING',
    createdAt: day(2),
    total: 248000,
    shippingFee: 30000,
    address: { name: 'Nguyễn Văn A', phone: '0901234567', line: '12 Lê Lợi', province: 'TP.HCM' },
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    items: [
      { productId: 'p1', product: {} as ProductSummary, qty: 2, unitPrice: 109000 },
    ],
    timeline: [
      { status: 'PENDING', at: day(2), note: 'Đơn hàng được tạo' },
      { status: 'CONFIRMED', at: day(1), note: 'Đã xác nhận' },
      { status: 'SHIPPING', at: day(0), note: 'Đang giao hàng' },
    ],
  },
  {
    id: 'ord-2',
    code: 'ORD-20260610-0042',
    status: 'DELIVERED',
    createdAt: day(7),
    total: 145000,
    shippingFee: 0,
    address: { name: 'Trần Thị B', phone: '0912345678', line: '30 Nguyễn Huệ', province: 'TP.HCM' },
    shippingMethod: 'express',
    paymentMethod: 'qr',
    items: [],
    timeline: [
      { status: 'PENDING', at: day(7) },
      { status: 'CONFIRMED', at: day(6) },
      { status: 'SHIPPING', at: day(5) },
      { status: 'DELIVERED', at: day(4), note: 'Giao thành công' },
    ],
  },
  {
    id: 'ord-3',
    code: 'ORD-20260601-0017',
    status: 'CANCELLED',
    createdAt: day(15),
    total: 80000,
    shippingFee: 30000,
    address: { name: 'Lê Văn C', phone: '0923456789', line: '55 Trần Hưng Đạo', province: 'Hà Nội' },
    shippingMethod: 'standard',
    paymentMethod: 'card',
    items: [],
    timeline: [
      { status: 'PENDING', at: day(15) },
      { status: 'CANCELLED', at: day(14), note: 'Đã hủy theo yêu cầu' },
    ],
  },
];
```

- [ ] **Step 2: Tạo `src/components/shop/OrderTimeline.tsx`**

```typescript
// src/components/shop/OrderTimeline.tsx
import { Check, Clock, Truck, Package, X } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { OrderStatus } from '@/data/shop/orders';

const STEPS: { id: OrderStatus; label: string; icon: any }[] = [
  { id: 'PENDING', label: 'Đã đặt', icon: Clock },
  { id: 'CONFIRMED', label: 'Xác nhận', icon: Check },
  { id: 'SHIPPING', label: 'Đang giao', icon: Truck },
  { id: 'DELIVERED', label: 'Hoàn tất', icon: Package },
];

export function OrderTimeline({ status, timeline }: { status: OrderStatus; timeline: { status: OrderStatus; at: string; note?: string }[] }) {
  if (status === 'CANCELLED') {
    const cancelled = timeline.find((t) => t.status === 'CANCELLED')!;
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-md flex items-start gap-3">
        <X className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-danger-900">Đơn hàng đã bị hủy</p>
          <p className="text-xs text-danger-700 mt-0.5">{cancelled.note}</p>
          <p className="text-xs text-danger-600 mt-1">
            {format(new Date(cancelled.at), "d 'tháng' M, yyyy HH:mm", { locale: vi })}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.id === status);

  return (
    <ol className="space-y-3">
      {STEPS.map((step, idx) => {
        const reached = idx <= currentIdx;
        const event = timeline.find((t) => t.status === step.id);
        const Icon = step.icon;
        return (
          <li key={step.id} className="flex items-start gap-3">
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                reached ? 'bg-success-600 text-white' : 'bg-ink-100 text-ink-400'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-2 border-b border-ink-100 last:border-0">
              <p className={clsx('text-sm font-medium', reached ? 'text-ink-900' : 'text-ink-500')}>
                {step.label}
              </p>
              {event && (
                <p className="text-xs text-ink-500 mt-0.5">
                  {format(new Date(event.at), "d M, yyyy 'lúc' HH:mm", { locale: vi })}
                  {event.note && ` · ${event.note}`}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 3: Tạo `src/app/(shop)/orders/page.tsx`**

```typescript
// src/app/(shop)/orders/page.tsx
import Link from 'next/link';
import { MOCK_ORDERS, type OrderStatus } from '@/data/shop/orders';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package, ChevronRight, Clock, Check, Truck, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatVND } from '@/lib/shop/cart';
import clsx from 'clsx';

const STATUS_BADGES: Record<OrderStatus, { label: string; icon: any; class: string }> = {
  PENDING: { label: 'Chờ xác nhận', icon: Clock, class: 'bg-warning-50 text-warning-700' },
  CONFIRMED: { label: 'Đã xác nhận', icon: Check, class: 'bg-info-50 text-info-700' },
  SHIPPING: { label: 'Đang giao', icon: Truck, class: 'bg-accent-50 text-accent-700' },
  DELIVERED: { label: 'Hoàn tất', icon: Check, class: 'bg-success-50 text-success-700' },
  CANCELLED: { label: 'Đã hủy', icon: X, class: 'bg-danger-50 text-danger-700' },
};

export default function ShopOrderHistoryPage() {
  const orders = MOCK_ORDERS;

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={Package}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm."
          action={{ label: 'Mua sắm ngay', href: '/' }}
        />
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">Đơn hàng của tôi</h1>
          <p className="mt-1 text-sm text-ink-600">{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {orders.map((order) => {
          const badge = STATUS_BADGES[order.status];
          const Icon = badge.icon;
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-900">#{order.code}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {format(new Date(order.createdAt), "d 'tháng' M, yyyy", { locale: vi })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-2.5 h-6 rounded-full text-xs font-semibold',
                      badge.class
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {badge.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-ink-400" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-ink-100">
                <p className="text-sm text-ink-600">{order.items.length || 1} sản phẩm</p>
                <p className="text-base font-bold text-accent-700">{formatVND(order.total)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Tạo `src/app/(shop)/orders/[id]/page.tsx`**

```typescript
// src/app/(shop)/orders/[id]/page.tsx
import { notFound } from 'next/navigation';
import { MOCK_ORDERS } from '@/data/shop/orders';
import { OrderTimeline } from '@/components/shop/OrderTimeline';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatVND } from '@/lib/shop/cart';

export default function ShopOrderTrackPage({ params }: { params: { id: string } }) {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) notFound();

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Đơn hàng', href: '/orders' },
              { label: order.code },
            ]}
          />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Đơn hàng #{order.code}</h1>
          <p className="text-sm text-ink-500">
            Đặt ngày {format(new Date(order.createdAt), "d 'tháng' M, yyyy 'lúc' HH:mm", { locale: vi })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Trạng thái đơn hàng</h2>
          <OrderTimeline status={order.status} timeline={order.timeline} />
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Thông tin giao hàng</h2>
          <div className="text-sm space-y-1">
            <p><strong>Người nhận:</strong> {order.address.name} · {order.address.phone}</p>
            <p><strong>Địa chỉ:</strong> {order.address.line}, {order.address.province}</p>
            <p><strong>Thanh toán:</strong> {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-600">Tạm tính</span>
            <span className="text-sm font-medium text-ink-900">{formatVND(order.total - order.shippingFee)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-600">Phí vận chuyển</span>
            <span className="text-sm font-medium text-ink-900">
              {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-ink-200 flex items-center justify-between">
            <span className="text-base font-semibold text-ink-900">Tổng cộng</span>
            <span className="text-xl font-bold text-accent-700">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Mở `/orders` → click 1 đơn → `/orders/ord-1` hiển thị timeline.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(shop)/orders/page.tsx" "src/app/(shop)/orders/[id]/page.tsx" src/components/shop/OrderTimeline.tsx src/data/shop/orders.ts
git commit -m "feat(shop): add SHOP-ORDER-HISTORY and SHOP-ORDER-TRACK with timeline"
```

---

## Task 9: SHOP-RX-UPLOAD — Đặt thuốc theo toa

**Files:**
- Create: `src/app/(shop)/prescriptions/upload/page.tsx`
- Create: `src/components/shop/RXUploader.tsx`

- [ ] **Step 1: Tạo `src/components/shop/RXUploader.tsx`**

```typescript
// src/components/shop/RXUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface AIResult {
  medicines: { name: string; dosage: string; frequency: string; duration: string }[];
}

const MOCK_RESULT: AIResult = {
  medicines: [
    { name: 'Paracetamol 500mg', dosage: '1 viên', frequency: '3 lần/ngày', duration: '5 ngày' },
    { name: 'Amoxicillin 500mg', dosage: '1 viên', frequency: '2 lần/ngày', duration: '7 ngày' },
  ],
};

export function RXUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onSelect(f);
  };

  const onScan = () => {
    setScanning(true);
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setScanning(false);
      toast.success('AI đã đọc xong đơn thuốc');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          className="p-8 border-2 border-dashed border-ink-300 rounded-lg text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50/30 transition-colors"
        >
          <Upload className="w-10 h-10 mx-auto text-ink-400" />
          <p className="mt-3 text-sm font-medium text-ink-900">Kéo thả ảnh đơn thuốc vào đây</p>
          <p className="mt-1 text-xs text-ink-500">hoặc click để chọn file (PNG, JPG)</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}

      {file && preview && (
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <div className="flex items-start gap-3">
            <div className="relative w-32 h-32 bg-ink-50 rounded-md overflow-hidden flex-shrink-0">
              <Image src={preview} alt="Đơn thuốc" fill className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-ink-500" />
                <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              </div>
              <p className="text-xs text-ink-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={onScan}
                  disabled={scanning}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 h-8 text-sm font-semibold rounded-md text-white',
                    scanning ? 'bg-ink-400' : 'bg-accent-600 hover:bg-accent-700'
                  )}
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      AI đang đọc...
                    </>
                  ) : (
                    <>AI đọc đơn thuốc</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 h-8 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                  Chọn lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="p-4 bg-success-50 border border-success-200 rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-success-700" />
            <h3 className="text-sm font-semibold text-success-900">AI đã nhận diện {result.medicines.length} thuốc</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-success-700 uppercase">
              <tr>
                <th className="text-left py-1.5">Tên thuốc</th>
                <th className="text-left py-1.5">Liều</th>
                <th className="text-left py-1.5">Tần suất</th>
                <th className="text-left py-1.5">Thời gian</th>
              </tr>
            </thead>
            <tbody className="text-success-900">
              {result.medicines.map((m, i) => (
                <tr key={i} className="border-t border-success-200">
                  <td className="py-2 font-medium">{m.name}</td>
                  <td className="py-2">{m.dosage}</td>
                  <td className="py-2">{m.frequency}</td>
                  <td className="py-2">{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 w-full h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors">
            Gửi dược sĩ duyệt → Giao tận nơi
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Tạo `src/app/(shop)/prescriptions/upload/page.tsx`**

```typescript
// src/app/(shop)/prescriptions/upload/page.tsx
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { RXUploader } from '@/components/shop/RXUploader';
import { FileText, ShieldCheck, Clock, Truck } from 'lucide-react';

export default function ShopRXUploadPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đặt thuốc theo toa' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">Đặt thuốc theo toa</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Upload ảnh đơn thuốc, AI sẽ đọc giúp. Dược sĩ xác nhận, giao tận nơi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <RXUploader />

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: 'Dược sĩ duyệt' },
            { icon: Clock, label: 'Trong 30 phút' },
            { icon: Truck, label: 'Giao tận nơi' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-4 bg-white border border-ink-200 rounded-md flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-ink-900">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Mở `/prescriptions/upload` → chọn ảnh → click "AI đọc đơn thuốc" → 2s sau hiển thị bảng.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(shop)/prescriptions/upload/page.tsx" src/components/shop/RXUploader.tsx
git commit -m "feat(shop): add SHOP-RX-UPLOAD with AI OCR mock"
```

---

## Task 10: SHOP-INSTALLMENT — Trả góp

**Files:**
- Create: `src/app/(shop)/installment/page.tsx`
- Create: `src/components/shop/InstallmentCalculator.tsx`

- [ ] **Step 1: Tạo `src/components/shop/InstallmentCalculator.tsx`**

```typescript
// src/components/shop/InstallmentCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import { formatVND } from '@/lib/shop/cart';

const PROVIDERS = [
  { id: 'home_credit', name: 'Home Credit', interestRate: 0, color: 'bg-rose-600' },
  { id: 'fe_credit', name: 'FE Credit', interestRate: 1.5, color: 'bg-blue-600' },
];

const TERMS = [3, 6, 9, 12];

export function InstallmentCalculator() {
  const [amount, setAmount] = useState(2000000);
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [term, setTerm] = useState(6);

  const selected = PROVIDERS.find((p) => p.id === provider)!;
  const monthly = useMemo(() => {
    const total = amount * (1 + (selected.interestRate / 100) * (term / 12));
    return Math.round(total / term);
  }, [amount, selected, term]);

  return (
    <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
      <div>
        <label className="text-sm font-medium text-ink-900">Giá trị đơn hàng (VND)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          step={100000}
          className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Đơn vị trả góp</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`p-3 border-2 rounded-md text-left ${
                provider === p.id ? 'border-accent-600 bg-accent-50' : 'border-ink-200'
              }`}
            >
              <div className={`w-2 h-2 ${p.color} rounded-full mb-1`} />
              <p className="text-sm font-semibold text-ink-900">{p.name}</p>
              <p className="text-xs text-ink-500">{p.interestRate === 0 ? '0% lãi' : `${p.interestRate}% / năm`}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Kỳ hạn</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {TERMS.map((t) => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              className={`h-10 text-sm font-semibold rounded-md ${
                term === t ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {t} tháng
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-md">
        <p className="text-xs text-ink-600">Trả hàng tháng</p>
        <p className="text-3xl font-bold text-accent-700 mt-1">{formatVND(monthly)}</p>
        <p className="text-xs text-ink-500 mt-2">
          Tổng {formatVND(amount * (1 + (selected.interestRate / 100) * (term / 12)))} trong {term} tháng
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Tạo `src/app/(shop)/installment/page.tsx`**

```typescript
// src/app/(shop)/installment/page.tsx
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { InstallmentCalculator } from '@/components/shop/InstallmentCalculator';
import { CheckCircle2, FileText, Phone, ShieldCheck } from 'lucide-react';

const REQUIREMENTS = [
  'Công dân Việt Nam, từ 20–60 tuổi',
  'Có CMND/CCCD còn hiệu lực',
  'Chứng minh thu nhập (sao kê lương 3 tháng gần nhất)',
  'Hợp đồng lao động từ 12 tháng trở lên',
];

export default function ShopInstallmentPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Trả góp' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">Mua trước, trả sau</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Trả góp 0% lãi suất với Home Credit, FE Credit
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <InstallmentCalculator />

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <FileText className="w-4 h-4" /> Điều kiện & hồ sơ
          </h2>
          <ul className="space-y-2">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-ink-700">
                <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-info-50 border border-info-200 rounded-md flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-info-900">Bảo mật thông tin</p>
            <p className="mt-1 text-info-700 text-pretty">
              Thông tin chỉ được chia sẻ với đối tác tài chính đã được cấp phép.
            </p>
          </div>
        </div>

        <a
          href="tel:18006928"
          className="block w-full h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors text-center leading-[44px]"
        >
          <Phone className="inline w-4 h-4 mr-2" />
          Gọi tư vấn: 1800 6928
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Mở `/installment` → thay đổi giá + term → tính toán cập nhật real-time.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(shop)/installment/page.tsx" src/components/shop/InstallmentCalculator.tsx
git commit -m "feat(shop): add SHOP-INSTALLMENT with calculator"
```

---

## Task 11: Verify toàn bộ 11 màn hình

**Files:** N/A (verification only)

- [ ] **Step 1: Run type check**

```bash
npm run type-check
```
Expected: 0 errors. Fix any issue found.

- [ ] **Step 2: Run dev server + manual smoke test**

```bash
npm run dev
```

Mở browser và kiểm tra:
- [ ] `/` — Hero + 6 quick actions + 5 categories + bestsellers + 8 quizzes + 1 banner + 4 videos.
- [ ] `/thuoc` — Danh mục "Thuốc" + subcategories + grid.
- [ ] `/thuoc/thuoc-giam-dau` — Subcategory.
- [ ] Click 1 sản phẩm → PDP với gallery, info, tabs.
- [ ] Click "Thêm vào giỏ" → toast xuất hiện.
- [ ] `/search?q=para` — Tìm thấy Paracetamol.
- [ ] `/cart` — Hiển thị sản phẩm vừa thêm.
- [ ] Click "Tiến hành thanh toán" → `/checkout` 4 bước.
- [ ] Điền form → qua 4 bước → "Đặt hàng" → redirect `/orders`.
- [ ] `/orders` — Hiển thị 3 mock orders.
- [ ] Click 1 order → `/orders/ord-1` → timeline.
- [ ] `/prescriptions/upload` — Upload ảnh → "AI đọc" → bảng kết quả.
- [ ] `/installment` — Calculator hoạt động.

- [ ] **Step 3: Test responsive (mobile)**

Mở DevTools → iPhone 12:
- [ ] SHOP-HOME: Hero ẩn quick actions thành 3 cols, sections stack dọc.
- [ ] PDP: Gallery full width, info bên dưới, sticky add-to-cart button (optional).
- [ ] Cart: Items full width, summary bên dưới.
- [ ] Checkout: Stepper cuộn ngang, form full width.

- [ ] **Step 4: Test accessibility**

Mở DevTools → Lighthouse → Accessibility:
- [ ] All pages score ≥ 90.
- [ ] Tab navigation works on forms.
- [ ] aria-label có trên icon buttons.
- [ ] Color contrast WCAG AA.

- [ ] **Step 5: Final commit (nếu có sửa)**

```bash
git add .
git commit -m "fix(shop): responsive + a11y polish for 11 B2C e-commerce screens"
```

---

## Self-Review

✅ **Spec coverage:** 11/11 màn hình B2C E-commerce trong SRS v1.4.0 §3.1.2 Nhóm 1.
✅ **DRY:** Dùng lại `ProductCard`, `Breadcrumb`, `EmptyState`, `useCart`. Mỗi component nhỏ < 200 dòng.
✅ **YAGNI:** Chỉ các tính năng SRS liệt kê. Không xây backend, không auth, không payment gateway.
✅ **TDD:** Mỗi task có thể verify thủ công qua dev server. Không cần unit test cho UI mockup.
✅ **Frequent commits:** 1 commit / task (10 commits trong sub-plan).

## Execution Handoff

Sub-plan 1 đã hoàn thành (file: `docs/superpowers/plans/2026-06-17-pcms-b2c-ecommerce.md`).
Sau khi merge, tiếp tục sub-plan 2 (B2C Tra cứu) tại `docs/superpowers/plans/2026-06-17-pcms-b2c-lookup.md`.
