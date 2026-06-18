// =====================================================
// ProductGallery — Ảnh PDP với thumbnail strip
// =====================================================

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder-products/product.svg'];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-white border border-ink-200 rounded-lg overflow-hidden">
        <Image
          src={safeImages[active]}
          alt={`${alt} - ảnh ${active + 1}`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((a) => (a - 1 + safeImages.length) % safeImages.length)}
              aria-label="Ảnh trước"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <ChevronLeft className="w-5 h-5 text-ink-700" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % safeImages.length)}
              aria-label="Ảnh sau"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <ChevronRight className="w-5 h-5 text-ink-700" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              aria-current={active === idx ? 'true' : undefined}
              className={clsx(
                'relative aspect-square bg-white border-2 rounded-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                active === idx ? 'border-accent-600' : 'border-ink-200 hover:border-ink-300'
              )}
            >
              <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
