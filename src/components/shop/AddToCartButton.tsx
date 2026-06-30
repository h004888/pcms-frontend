'use client';

// =====================================================
// AddToCartButton — PDP button client wrapper
// PDP là Server Component, cần tách 'use client' để gọi useCart
// =====================================================

import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/shop/cart-context';

interface Props {
  medicineId: string;
  medicineName: string;
  unit: string;
  prescriptionRequired: boolean;
}

export function AddToCartButton({
  medicineId,
  medicineName,
  unit,
  prescriptionRequired,
}: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleClick = async () => {
    try {
      await addItem(
        {
          id: medicineId,
          name: medicineName,
          unit,
          price: 0,
          sku: '',
          slug: '',
          thumbnail: '',
          brand: '',
          country: '',
          prescriptionRequired,
          stockStatus: 'in_stock',
        },
        1
      );
      toast.success(
        prescriptionRequired
          ? `Đã thêm vào giỏ (thuốc kê đơn)`
          : 'Đã thêm vào giỏ'
      );
    } catch {
      toast.error('Không thể thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(
        {
          id: medicineId,
          name: medicineName,
          unit,
          price: 0,
          sku: '',
          slug: '',
          thumbnail: '',
          brand: '',
          country: '',
          prescriptionRequired,
          stockStatus: 'in_stock',
        },
        1
      );
      router.push('/checkout');
    } catch {
      toast.error('Không thể mua ngay');
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
        Thêm vào giỏ
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="inline-flex items-center px-5 h-11 border border-ink-200 text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        Mua ngay
      </button>
    </div>
  );
}
