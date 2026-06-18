// =====================================================
// useCatalog hooks — fetch data from BFF endpoints
// Uses native fetch + revalidate for SSR-friendly caching
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import type {
  Category,
  ProductSummary,
  ProductDetail,
  ProductListResponse,
  SearchResponse,
} from '@/types/shop/catalog';
import type { ProductSort } from '@/types/shop/catalog';

const BASE = '/api/shop/catalog';

interface CatalogHomeData {
  categories: Category[];
  bestsellers: ProductSummary[];
}

/** Fetch catalog home (categories + bestsellers) */
export function useCatalogHome() {
  const [data, setData] = useState<CatalogHomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch(`${BASE}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, isLoading };
}

/** Fetch products by category */
export function useCategoryProducts(
  categorySlug: string | null,
  options: { search?: string; sort?: ProductSort; page?: number; pageSize?: number } = {}
) {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (options.search) params.set('q', options.search);
    if (options.sort) params.set('sort', options.sort);
    if (options.page) params.set('page', String(options.page));
    if (options.pageSize) params.set('pageSize', String(options.pageSize));

    fetch(`${BASE}/category/${encodeURIComponent(categorySlug)}?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, options.search, options.sort, options.page, options.pageSize]);

  return { data, error, isLoading };
}

/** Fetch single product detail */
export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    fetch(`${BASE}/product/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!cancelled) {
          setProduct(d.product);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, error, isLoading };
}

/** Search products (debounced) */
export function useProductSearch(query: string, page = 1) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    const params = new URLSearchParams({ q: query, page: String(page) });
    fetch(`${BASE}?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  return { data, error, isLoading };
}
