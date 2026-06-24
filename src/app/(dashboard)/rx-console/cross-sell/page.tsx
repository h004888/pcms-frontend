// =====================================================
// /rx-console/cross-sell — RX-CROSS-SELL (real API)
// AI đề xuất sản phẩm — /api/v1/rx/cross-sell
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Package, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import { aiCrossSell } from '@/features/rx-console';
import type { CrossSellProduct } from '@/features/rx-console';
import toast from 'react-hot-toast';

const SAMPLE_MEDICINES = ['paracetamol', 'amoxicillin', 'ibuprofen'];

export default function CrossSellPage() {
  const [customerId, setCustomerId] = useState('');
  const [medicines, setMedicines] = useState(SAMPLE_MEDICINES.join(', '));
  const [products, setProducts] = useState<CrossSellProduct[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId.trim()) {
      toast.error('Vui lòng nhập mã khách hàng');
      return;
    }
    const medicineList = medicines
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    setLoading(true);
    try {
      const res = await aiCrossSell({
        customerId: customerId.trim(),
        currentMedicines: medicineList,
      });
      setProducts(res.products);
    } catch {
      toast.error('Không thể lấy đề xuất');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Cross-sell' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Đề xuất sản phẩm</h1>
          <p className="text-sm text-ink-600 mt-1">
            Sản phẩm liên quan cho đơn hàng hiện tại
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white border border-ink-200 rounded-md space-y-3"
        >
          <div>
            <label className="text-sm font-semibold text-ink-900">Mã khách hàng</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="VD: cust-uuid-123"
              className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">
              Thuốc hiện tại (phân cách dấu phẩy)
            </label>
            <input
              type="text"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              placeholder="paracetamol, amoxicillin"
              className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Lấy đề xuất AI
          </button>
        </form>

        {products.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-600" aria-hidden="true" />
              Đề xuất cho khách
            </h2>
            <div className="space-y-2">
              {products.map((p, idx) => (
                <article
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
                >
                  <span className="w-7 h-7 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900">{p.name}</p>
                    {p.reason && (
                      <p className="text-xs text-ink-500">{p.reason}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-accent-700 font-mono">
                      {formatVND(p.price)}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-ink-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}