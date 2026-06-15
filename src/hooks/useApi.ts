// =====================================================
// PCMS - useApi hook for simplified data fetching
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient, { getErrorMessage } from '@/lib/api';
import { PageResponse } from '@/types';

interface UseApiListResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  size: number;
  refetch: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
}

/**
 * Hook to fetch paginated list from API
 */
export function useApiList<T = unknown>(
  endpoint: string,
  initialPage: number = 0,
  initialSize: number = 20,
  params: Record<string, unknown> = {}
): UseApiListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    searchParams.set('size', String(size));
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        searchParams.set(k, String(v));
      }
    });

    apiClient
      .get<PageResponse<T>>(`${endpoint}?${searchParams.toString()}`)
      .then((res) => {
        if (cancelled) return;
        setData(res.data.data || []);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, page, size, reloadKey, JSON.stringify(params)]);

  return { data, loading, error, total, totalPages, page, size, refetch, setPage, setSize };
}

interface UseApiDetailResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch single resource by ID
 */
export function useApiDetail<T = unknown>(endpoint: string | null): UseApiDetailResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!endpoint) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient
      .get<T>(endpoint)
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [endpoint, reloadKey]);

  return { data, loading, error, refetch };
}
