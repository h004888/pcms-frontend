// =====================================================
// PCMS - Search View (UC10)
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Input, Button, Alert, Card } from '@/components/ui';
import { Search, Pill } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Medicine } from '@/types';
import { formatVND } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

export function SearchView() {
  const router = useRouter();
  const { state } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      apiClient.get<Medicine[]>(`/search?q=${encodeURIComponent(query)}`)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Tìm kiếm thuốc</h1>
        <p className="text-sm text-ink-500 mt-1">UC10 - Tìm kiếm với autocomplete · FR10.1-FR10.4</p>
      </div>

      <div className="mb-6 max-w-2xl">
        <Input
          placeholder="Gõ tên thuốc hoặc SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        {state.user?.role === 'CUSTOMER' && (
          <Alert variant="info" className="mt-3">
            💡 Khách hàng có thể đặt mua trực tiếp từ đây
          </Alert>
        )}
      </div>

      {loading && <p className="text-sm text-ink-500">Đang tìm...</p>}

      {!loading && query && results.length === 0 && (
        <Alert variant="warning" title="Không tìm thấy">Không có kết quả cho &ldquo;{query}&rdquo; (MSG27)</Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-ink-50 rounded-lg">
                <Pill className="w-6 h-6 text-ink-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink-900">{m.name}</h3>
                <p className="text-xs text-ink-500 mt-0.5">SKU: {m.sku}</p>
                {m.prescriptionRequired && <span className="text-xs text-red-600">⚕️ Thuốc kê đơn</span>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-accent-700">{formatVND(m.price)}</span>
                  {state.user?.role !== 'CUSTOMER' && (
                    <Button size="sm" onClick={() => router.push(`/orders/new?medicineId=${m.id}`)}>
                      Đặt mua
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
