// =====================================================
// ProductInfo — Tên, giá, qty, add to cart cho PDP
// Dùng useCart() để add
// =====================================================

'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Package, ShieldCheck, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/shop/cart-context';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import type { ProductSummary } from '@/types/shop/catalog';

interface Props {
  product: ProductSummary;
}

const STOCK_LABELS: Record<
  ProductSummary['stockStatus'],
  { label: string; class: string }
> = {
  in_stock: { label: 'Còn hàng', class: 'text-success-700 bg-success-50' },
  low_stock: { label: 'Sắp hết', class: 'text-warning-700 bg-warning-50' },
  out_of_stock: { label: 'Hết hàng', class: 'text-danger-700 bg-danger-50' },
};

export function ProductInfo({ product }: Props) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const stock = STOCK_LABELS[product.stockStatus];
  const isPrescription = product.prescriptionRequired;
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(
      isPrescription
        ? `Đã thêm ${qty} ${product.unit} (thuốc kê đơn) vào giỏ`
        : `Đã thêm ${qty} ${product.unit} vào giỏ hàng`
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-ink-500">
          {product.brand} · {product.country}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900 text-balance">
          {product.name}
        </h1>
        {isPrescription && (
          <p className="mt-2 text-xs text-warning-700 font-medium">
            ⚕️ Thuốc kê đơn — cần đơn từ bác sĩ
          </p>
        )}
      </div>

      {/* Price */}
      <div className="p-4 bg-ink-50 rounded-md">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discountPercent={product.discountPercent}
          unit={product.unit}
          variant="default"
        />
        <p className="mt-2 text-xs text-ink-500">Đã bao gồm VAT</p>
      </div>

      {/* Stock */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-xs font-semibold ${stock.class}`}
        >
          <span className="w-1.5 h-1.5 bg-current rounded-full" aria-hidden="true" />
          {stock.label}
        </span>
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-ink-200 rounded-md">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Giảm số lượng"
            className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded-l-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-14 h-10 text-center text-sm font-medium text-ink-900 font-mono border-x border-ink-200 focus:outline-none"
            aria-label="Số lượng"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Tăng số lượng"
            className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="flex-1 h-10 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          {isOutOfStock
            ? 'Hết hàng'
            : isPrescription
              ? 'Đặt theo toa'
              : 'Thêm vào giỏ'}
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-ink-200">
        {[
          { icon: ShieldCheck, label: 'Chính hãng' },
          { icon: Package, label: 'Giao tận nơi' },
          { icon: FileText, label: 'Đổi trả 30 ngày' },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className="flex flex-col items-center gap-1 text-center"
            >
              <Icon className="w-5 h-5 text-accent-600" aria-hidden="true" />
              <span className="text-xs text-ink-600 text-balance">{badge.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
