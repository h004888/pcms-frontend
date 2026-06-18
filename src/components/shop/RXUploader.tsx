// =====================================================
// RXUploader — Upload đơn thuốc với AI OCR mock
// Drag-and-drop + click-to-select
// AI mock scan 2s rồi hiển thị bảng kết quả
// =====================================================

'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, FileText, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface AIResultMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface AIResult {
  medicines: AIResultMedicine[];
}

const MOCK_RESULT: AIResult = {
  medicines: [
    { name: 'Paracetamol 500mg', dosage: '1 viên', frequency: '3 lần/ngày', duration: '5 ngày' },
    { name: 'Amoxicillin 500mg', dosage: '1 viên', frequency: '2 lần/ngày', duration: '7 ngày' },
  ],
};

export function RXUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh (PNG, JPG)');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn — tối đa 5 MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onSelect(f);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSelect(f);
  };

  const onScan = () => {
    setScanning(true);
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setScanning(false);
      toast.success('Đã đọc xong đơn thuốc');
    }, 2000);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {!file && (
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
          className="p-8 border-2 border-dashed border-ink-300 rounded-lg text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Upload className="w-10 h-10 mx-auto text-ink-400" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-ink-900">
            Kéo thả ảnh đơn thuốc vào đây
          </p>
          <p className="mt-1 text-xs text-ink-500">
            hoặc click để chọn file (PNG, JPG, tối đa 5 MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileInput}
            className="hidden"
            aria-label="Chọn ảnh đơn thuốc"
          />
        </div>
      )}

      {file && preview && (
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <div className="flex items-start gap-3">
            <div className="relative w-32 h-32 bg-ink-50 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={preview}
                alt="Xem trước đơn thuốc"
                fill
                className="object-contain"
                sizes="128px"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-ink-500 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium text-ink-900 truncate">{file.name}</p>
              </div>
              <p className="text-xs text-ink-500 mt-1 font-mono">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onScan}
                  disabled={scanning}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 h-8 text-sm font-semibold rounded-md text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                    scanning ? 'bg-ink-400 cursor-wait' : 'bg-accent-600 hover:bg-accent-700'
                  )}
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      AI đang đọc...
                    </>
                  ) : (
                    'AI đọc đơn thuốc'
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={scanning}
                  className="inline-flex items-center gap-1.5 px-3 h-8 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  Chọn lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="p-4 bg-success-50 border border-success-200 rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-success-700" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-success-900">
              AI đã nhận diện {result.medicines.length} thuốc
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-success-700 uppercase">
                <tr>
                  <th className="text-left py-1.5 font-semibold">Tên thuốc</th>
                  <th className="text-left py-1.5 font-semibold">Liều</th>
                  <th className="text-left py-1.5 font-semibold">Tần suất</th>
                  <th className="text-left py-1.5 font-semibold">Thời gian</th>
                </tr>
              </thead>
              <tbody className="text-success-900">
                {result.medicines.map((m, i) => (
                  <tr key={i} className="border-t border-success-200">
                    <td className="py-2 font-medium">{m.name}</td>
                    <td className="py-2 font-mono">{m.dosage}</td>
                    <td className="py-2">{m.frequency}</td>
                    <td className="py-2">{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="mt-4 w-full h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            Gửi dược sĩ duyệt → Giao tận nơi
          </button>
          <p className="mt-2 text-xs text-success-700 text-center">
            Dược sĩ sẽ xác nhận trong vòng 30 phút
          </p>
        </div>
      )}
    </div>
  );
}
