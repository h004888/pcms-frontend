// =====================================================
// VerifyOriginScanner — Quét QR / mã vạch thuốc (real API)
// /api/v1/verify-origin/scan
// =====================================================

'use client';

import { useState } from 'react';
import { Loader2, ScanLine, ShieldCheck, ShieldAlert, Check } from 'lucide-react';
import { scanVerifyOrigin } from '@/features/verify-origin';
import type { VerifyOriginResult } from '@/features/verify-origin';
import toast from 'react-hot-toast';

export function VerifyOriginScanner() {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'BARCODE' | 'QR'>('QR');
  const [result, setResult] = useState<VerifyOriginResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã cần kiểm tra');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await scanVerifyOrigin({ code: code.trim(), type });
      setResult(res);
      if (res.authentic) {
        toast.success('Thuốc chính hãng!');
      } else {
        toast.error('Không thể xác minh — cẩn thận!');
      }
    } catch {
      toast.error('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-5 bg-white border border-ink-200 rounded-md">
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
        <ScanLine className="w-4 h-4" aria-hidden="true" />
        Tra cứu nguồn gốc thuốc
      </h2>

      <form onSubmit={handleScan} className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('QR')}
            aria-pressed={type === 'QR'}
            className={`flex-1 h-10 text-sm font-medium rounded-md border ${
              type === 'QR'
                ? 'bg-accent-600 text-white border-accent-600'
                : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300'
            }`}
          >
            QR Code
          </button>
          <button
            type="button"
            onClick={() => setType('BARCODE')}
            aria-pressed={type === 'BARCODE'}
            className={`flex-1 h-10 text-sm font-medium rounded-md border ${
              type === 'BARCODE'
                ? 'bg-accent-600 text-white border-accent-600'
                : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300'
            }`}
          >
            Mã vạch
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={
              type === 'QR' ? 'Nhập mã QR...' : 'Nhập mã vạch EAN-13...'
            }
            className="flex-1 h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 h-10 inline-flex items-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors disabled:bg-ink-300"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ScanLine className="w-4 h-4" aria-hidden="true" />
            )}
            Tra cứu
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 border rounded-md ${
            result.authentic
              ? 'bg-success-50 border-success-200'
              : 'bg-danger-50 border-danger-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.authentic ? (
              <ShieldCheck className="w-5 h-5 text-success-600" aria-hidden="true" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-danger-600" aria-hidden="true" />
            )}
            <p
              className={`text-sm font-semibold ${
                result.authentic ? 'text-success-900' : 'text-danger-900'
              }`}
            >
              {result.authentic
                ? 'Sản phẩm chính hãng'
                : 'Không thể xác minh sản phẩm'}
            </p>
          </div>
          <dl className="mt-3 space-y-1 text-xs">
            {result.medicineName && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Tên thuốc:</dt>
                <dd className="font-medium text-ink-900 text-right">
                  {result.medicineName}
                </dd>
              </div>
            )}
            {result.manufacturer && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Hãng SX:</dt>
                <dd className="font-mono text-ink-700">{result.manufacturer}</dd>
              </div>
            )}
            {result.batchNo && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Số lô:</dt>
                <dd className="font-mono text-ink-700">{result.batchNo}</dd>
              </div>
            )}
            {result.registrationNo && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">SĐK:</dt>
                <dd className="font-mono text-ink-700">{result.registrationNo}</dd>
              </div>
            )}
            {result.expiresAt && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">HSD:</dt>
                <dd className="font-mono text-ink-700">
                  {new Date(result.expiresAt).toLocaleDateString('vi-VN')}
                </dd>
              </div>
            )}
            {result.origin && (
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Xuất xứ:</dt>
                <dd className="text-ink-700">{result.origin}</dd>
              </div>
            )}
          </dl>
          {result.message && (
            <p className="mt-3 text-xs text-ink-600">{result.message}</p>
          )}
        </div>
      )}
    </section>
  );
}