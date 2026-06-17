// =====================================================
// /reviews/new/[productSlug] — SHOP-REVIEW create (polished)
// Interactive rating + photo upload preview + submit
// =====================================================

'use client';

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PRODUCTS } from '@/data/shop/catalog';
import { Star, Save, Camera, X, ImageIcon, Upload } from 'lucide-react';
import clsx from 'clsx';

interface PageProps {
  params: { productSlug: string };
}

export default function NewReviewPage({ params }: PageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.productSlug);
  if (!product) notFound();

  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [errors, setErrors] = useState<{ rating?: string; title?: string; body?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs khi unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh (JPG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn — tối đa 5 MB');
      return;
    }
    if (photos.length >= 5) {
      toast.error('Tối đa 5 ảnh');
      return;
    }
    setPhotos((prev) => [...prev, { file, url: URL.createObjectURL(file) }]);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(addPhoto);
    e.target.value = ''; // reset để chọn lại cùng file
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    Array.from(files).forEach(addPhoto);
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      const removed = prev[idx];
      URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (rating === 0) e.rating = 'Vui lòng chọn số sao';
    if (!title.trim()) e.title = 'Vui lòng nhập tiêu đề';
    else if (title.trim().length < 5) e.title = 'Tiêu đề quá ngắn (tối thiểu 5 ký tự)';
    if (!body.trim()) e.body = 'Vui lòng chia sẻ chi tiết đánh giá';
    else if (body.trim().length < 20) e.body = 'Đánh giá quá ngắn (tối thiểu 20 ký tự)';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.error('Vui lòng hoàn thiện các trường bắt buộc');
      return;
    }
    setSubmitting(true);
    // Mock API call
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Đã gửi đánh giá — cảm ơn bạn!');
    setSubmitting(false);
    router.push('/reviews');
  };

  const displayRating = hoverRating || rating;
  const ratingLabel = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'][displayRating] || 'Chạm để chọn';

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Đánh giá', href: '/reviews' }, { label: 'Mới' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Viết đánh giá</h1>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mx-auto max-w-2xl px-4 py-6 space-y-5"
      >
        {/* Product */}
        <div className="p-4 bg-white border border-ink-200 rounded-md flex items-center gap-3">
          <div className="w-14 h-14 bg-ink-50 rounded-md flex-shrink-0 overflow-hidden">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{product.name}</p>
            <p className="text-xs text-ink-500 font-mono">{product.brand} · {product.country}</p>
          </div>
        </div>

        {/* Rating */}
        <fieldset>
          <legend className="text-sm font-semibold text-ink-900 mb-2">
            Đánh giá của bạn *
          </legend>
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label="Chọn số sao"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} sao`}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onClick={() => {
                  setRating(star);
                  if (errors.rating) setErrors((e) => ({ ...e, rating: undefined }));
                }}
                className="p-1 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
              >
                <Star
                  className={clsx(
                    'w-10 h-10 transition-colors',
                    star <= displayRating
                      ? 'text-warning-500 fill-warning-500'
                      : 'text-ink-200'
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-ink-700">{ratingLabel}</span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <X className="w-3 h-3" aria-hidden="true" />
              {errors.rating}
            </p>
          )}
        </fieldset>

        {/* Title */}
        <div>
          <label htmlFor="title" className="text-sm font-semibold text-ink-900 block mb-1">
            Tiêu đề ngắn *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
            }}
            placeholder="VD: Hạ sốt nhanh, dễ uống"
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <X className="w-3 h-3" aria-hidden="true" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="text-sm font-semibold text-ink-900 block mb-1">
            Chi tiết đánh giá *{' '}
            <span className="font-normal text-ink-500">({body.length} ký tự)</span>
          </label>
          <textarea
            id="body"
            rows={5}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body) setErrors((er) => ({ ...er, body: undefined }));
            }}
            placeholder="Chia sẻ trải nghiệm của bạn: hiệu quả, cách dùng, lưu ý..."
            className={clsx(inputClass(!!errors.body), 'font-sans')}
          />
          {errors.body && (
            <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <X className="w-3 h-3" aria-hidden="true" />
              {errors.body}
            </p>
          )}
        </div>

        {/* Photos */}
        <div>
          <p className="text-sm font-semibold text-ink-900 mb-1">
            Ảnh đính kèm{' '}
            <span className="font-normal text-ink-500">(tuỳ chọn, tối đa 5 ảnh)</span>
          </p>
          {photos.length < 5 && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className="p-6 border-2 border-dashed border-ink-300 rounded-md text-center hover:border-accent-500 hover:bg-accent-50/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 transition-colors"
            >
              <Camera className="w-8 h-8 mx-auto text-ink-400" aria-hidden="true" />
              <p className="mt-2 text-sm text-ink-700 font-medium">
                Kéo thả ảnh hoặc click để chọn
              </p>
              <p className="mt-1 text-xs text-ink-500">JPG, PNG · tối đa 5 MB mỗi ảnh</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileInput}
                className="hidden"
                aria-label="Chọn ảnh"
              />
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {photos.map((p, idx) => (
                <div
                  key={p.url}
                  className="relative aspect-square bg-ink-50 rounded-md overflow-hidden border border-ink-200 group"
                >
                  <img
                    src={p.url}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    aria-label={`Xóa ảnh ${idx + 1}`}
                    className="absolute top-1 right-1 w-6 h-6 bg-danger-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <div className="absolute bottom-1 left-1 px-1.5 h-5 bg-black/60 text-white text-[10px] rounded font-mono flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5" aria-hidden="true" />
                    {(p.file.size / 1024).toFixed(0)}KB
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2 border-t border-ink-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 h-11 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Upload className="w-4 h-4 animate-pulse" aria-hidden="true" />
                Đang gửi...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" aria-hidden="true" />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200',
  ].join(' ');
}