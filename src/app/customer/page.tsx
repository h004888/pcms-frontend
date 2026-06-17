// =====================================================
// /customer — SHOP-HOME alias
// Redirect về / (vì SHOP-HOME thật ở /(shop)/page.tsx)
// Lý do: B2C screens đặt trong /customer/* folder thật để tránh
// route conflict với /(dashboard)/*, nhưng SHOP-HOME ở /(shop)/page.tsx.
// Giữ SHOP-HOME ở / để user landing tự nhiên nhất.
// =====================================================

import { redirect } from 'next/navigation';

export default function CustomerIndexPage() {
  redirect('/');
}