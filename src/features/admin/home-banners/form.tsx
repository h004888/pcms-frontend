'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminBanner, updateAdminBanner, uploadAdminBannerImage } from '@/lib/api/home';

interface FormValues {
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'DELETED';
}

const EMPTY: FormValues = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
  status: 'ACTIVE',
};

interface Props {
  initial?: Partial<FormValues> & { id?: string };
}

export function AdminHomeBannerForm({ initial }: Props) {
  const router = useRouter();
  const [v, setV] = useState<FormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setErr(null);
    try {
      const res = await uploadAdminBannerImage(f);
      setV((cur) => ({ ...cur, imageUrl: res.url }));
    } catch (e: any) {
      setErr(e?.message ?? 'Lỗi upload ảnh');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      if (initial?.id) {
        await updateAdminBanner(initial.id, v);
      } else {
        await createAdminBanner(v);
      }
      router.push('/admin/home-banners');
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? 'Lỗi lưu banner');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-2xl font-extrabold">
        {initial?.id ? 'Sửa banner' : 'Tạo banner'}
      </h1>

      {err && <div className="bg-red-50 text-red-700 p-3 rounded">{err}</div>}

      <div>
        <label className="block text-sm font-semibold mb-1">Tiêu đề *</label>
        <input
          type="text"
          value={v.title}
          onChange={(e) => setV({ ...v, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">URL hình ảnh *</label>
        <div className="flex gap-2 items-start">
          <input
            type="text"
            value={v.imageUrl}
            onChange={(e) => setV({ ...v, imageUrl: e.target.value })}
            required
            placeholder="/api/v1/static/home-banners/xxx.jpg HOẶC URL ngoài"
            className="flex-1 px-3 py-2 border border-slate-300 rounded"
          />
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 transition px-3 py-2 rounded text-sm font-semibold">
            {uploading ? 'Đang upload...' : 'Upload'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
        {v.imageUrl && (
          <img src={v.imageUrl} alt="Preview" className="mt-2 max-h-32 rounded" />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Link đích (URL khi click)</label>
        <input
          type="text"
          value={v.linkUrl}
          onChange={(e) => setV({ ...v, linkUrl: e.target.value })}
          placeholder="/thuoc HOẶC https://..."
          className="w-full px-3 py-2 border border-slate-300 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Thứ tự</label>
          <input
            type="number"
            value={v.sortOrder}
            onChange={(e) => setV({ ...v, sortOrder: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Trạng thái</label>
          <select
            value={v.status}
            onChange={(e) => setV({ ...v, status: e.target.value as FormValues['status'] })}
            className="w-full px-3 py-2 border border-slate-300 rounded"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SCHEDULED">SCHEDULED</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded font-semibold"
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/home-banners')}
          className="bg-slate-100 hover:bg-slate-200 px-5 py-2 rounded"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
