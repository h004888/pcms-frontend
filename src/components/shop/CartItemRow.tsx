// =====================================================
// CartItemRow — single line item trong cart
// Dùng useCart() từ context
// =====================================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatVND, getProductHref } from '@/lib/shop/format';
import type { CartItem } from '@/lib/shop/cart';
import { useCart } from '@/lib/shop/cart-context';

interface Props {
  item: CartItem;
  /** Show remove button. Default true. */
  showRemove?: boolean;
}

export function CartItemRow({ item, showRemove = true }: Props) {
  const { updateItem, removeItem } = useCart();
  // CartItem có slug + categorySlug + subcategorySlug — pass trực tiếp
  const href = getProductHref(item);

  return (
    <div className="flex gap-3 p-4 bg-white border border-ink-200 rounded-md">
      <Link href={href} className="flex-shrink-0" aria-label={`Xem ${item.name}`}>
        <div className="relative w-20 h-20 bg-ink-50 rounded-md overflow-hidden">
          <Image
            src={item.thumbnail}
            alt={item.name}
            fill
            className="object-contain p-1"
            sizes="80px"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={href}
          className="text-sm font-medium text-ink-900 hover:text-accent-700 line-clamp-2 text-balance"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-ink-500">{item.unit}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-accent-700 font-mono">
            {formatVND(item.price)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {showRemove && (
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Xóa ${item.name}`}
            className="p-1 text-ink-400 hover:text-danger-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        <div className="flex items-center border border-ink-200 rounded-md">
          <button
            type="button"
            onClick={() => updateItem(item.productId, item.qty - 1)}
            aria-label="Giảm số lượng"
            className="w-7 h-7 flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded-l-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <Minus className="w-3 h-3" aria-hidden="true" />
          </button>
          <span
            className="w-8 text-center text-sm font-medium text-ink-900 font-mono"
            aria-label={`Số lượng hiện tại ${item.qty}`}
          >
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => updateItem(item.productId, item.qty + 1)}
            aria-label="Tăng số lượng"
            className="w-7 h-7 flex items-center justify-center text-ink-700 hover:bg-ink-50 rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <Plus className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
