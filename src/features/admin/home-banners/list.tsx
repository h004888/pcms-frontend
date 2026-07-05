'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listAdminBanners, deleteAdminBanner } from '@/lib/api/home';
import type { HomeBannerAdmin } from '@/types/home';

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-slate-100 text-slate-600',
  SCHEDULED: 'bg-amber-100 text-amber-700',
  DELETED: 'bg-red-100 text-red-700',
};

export function AdminHomeBannersList() {
  const [banners, setBanners] = useState<HomeBannerAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listAdminBanners({ size: 50 });
      setBanners(res.content ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Lỗi tải danh sách banner');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Xóa banner này?')) return;
    try {
      await deleteAdminBanner(id);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Lỗi xóa');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Quản lý Home Banners</h1>
        <Link
          href="/admin/home-banners/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          + Tạo banner
        </Link>
      </div>

      {err && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{err}</div>}
      {loading ? (
        <div className="text-slate-500">Đang tải...</div>
      ) : banners.length === 0 ? (
        <div className="text-slate-500">Chưa có banner nào.</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Tiêu đề</th>
                <th className="text-left p-3">Ảnh</th>
                <th className="text-left p-3">Trạng thái</th>
                <th className="text-left p-3">Thứ tự</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id} className="border-t border-slate-200">
                  <td className="p-3">
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-xs text-slate-500">{b.linkUrl}</div>
                  </td>
                  <td className="p-3">
                    <img src={b.imageUrl} alt={b.title} className="w-32 h-16 object-cover rounded" />
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_BADGE[b.status] ?? 'bg-slate-100'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">{b.sortOrder}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/home-banners/${b.id}`}
                      className="text-blue-600 hover:underline text-xs font-semibold"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600 hover:underline text-xs font-semibold"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
