'use client';

// =====================================================
// /he-thong-cua-hang — STORE-LOCATOR
// Tích hợp với branch-service backend API
// =====================================================

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { EmptyState } from '@/components/ui/Feedback';

interface BranchDTO {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status?: string;
}

export default function HeThongCuaHangPage() {
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient
      .get('/branches?size=100')
      .then((res) => {
        if (cancelled) return;
        const body = res.data;
        const items: BranchDTO[] = Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : [];
        setBranches(items.filter((b) => (b.status ?? 'ACTIVE') === 'ACTIVE'));
      })
      .catch(() => {
        if (!cancelled) setBranches([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Hệ thống nhà thuốc' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900">Hệ thống nhà thuốc</h1>
          <p className="mt-1 text-sm text-ink-600">
            Tra cứu nhà thuốc PCMS gần bạn trên toàn quốc — dữ liệu trực tiếp từ hệ thống.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-3">
          Tất cả chi nhánh
          <span className="ml-2 text-sm font-normal text-ink-500">({branches.length})</span>
        </h2>

        {loading ? (
          <p className="text-sm text-ink-500 py-8 text-center">Đang tải...</p>
        ) : branches.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Chưa có chi nhánh nào"
            description="Hệ thống chưa có chi nhánh nào trong cơ sở dữ liệu."
          />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <li
                key={b.id}
                className="bg-white border border-ink-200 rounded-md p-4 hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-ink-50 rounded-md">
                    <MapPin className="w-5 h-5 text-accent-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-ink-500">{b.code}</p>
                    <h3 className="font-semibold text-ink-900 mt-0.5">{b.name}</h3>
                    {b.address && (
                      <p className="text-sm text-ink-600 mt-1.5 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-ink-400 flex-shrink-0" />
                        <span>{b.address}</span>
                      </p>
                    )}
                    {b.phone && (
                      <p className="text-sm text-ink-600 mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-ink-400" />
                        <a href={`tel:${b.phone}`} className="hover:text-accent-700">
                          {b.phone}
                        </a>
                      </p>
                    )}
                    <p className="text-xs text-success-700 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Mở cửa
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-ink-100 flex justify-end">
                  <Link
                    href={`/he-thong-cua-hang/${b.id}`}
                    className="text-sm text-accent-700 hover:text-accent-900 flex items-center gap-1"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
