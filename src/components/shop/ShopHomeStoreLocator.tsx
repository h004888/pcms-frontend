// =====================================================
// ShopHomeStoreLocator — Danh sách nhà thuốc (compact)
// API: GET /store/locator → top 3 stores
// =====================================================

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { fetchStores } from '@/features/stores';

export const revalidate = 300;

export async function ShopHomeStoreLocator() {
  let stores: { name: string; address: string }[] = [];
  try {
    const res = await fetchStores();
    stores = (res.stores ?? []).slice(0, 3).map((s) => ({ name: s.name, address: s.address }));
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-ink-900">Nhà thuốc gần bạn</h3>
        <Link href="/he-thong-cua-hang"
          className="text-xs font-medium text-accent-700 hover:text-accent-800 transition-colors">
          Xem tất cả →
        </Link>
      </div>
      <div className="space-y-2">
        {stores.length > 0 ? stores.map((s) => (
          <div key={s.name} className="flex items-start gap-2.5 p-2.5 bg-white border border-ink-200 rounded-md">
            <MapPin className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-900 leading-snug">{s.name}</p>
              <p className="text-[10px] text-ink-500 truncate mt-0.5">{s.address}</p>
            </div>
          </div>
        )) : (
          <p className="text-xs text-ink-500 py-4 text-center">Chưa có dữ liệu nhà thuốc</p>
        )}
      </div>
    </div>
  );
}
