// =====================================================
// PCMS Home data hooks (server-friendly via fetch)
//
// Robust against 3 common backend list-wrapper shapes:
//   1. Plain array:        [ {...}, {...} ]
//   2. PageResponse:      { data: [...], page, size, total }
//   3. Page wrapper:       { content: [...] }   (category-service)
//   4. Items wrapper:      { items: [...] }
// =====================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface FetchOptions extends RequestInit {
  bearerToken?: string;
}

class ApiError extends Error {
  status: number;
  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

async function apiFetch(path: string, opts: FetchOptions = {}): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (opts.bearerToken) headers.Authorization = `Bearer ${opts.bearerToken}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    cache: opts.cache ?? 'no-store',
  });
  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  }
  return (await res.json()) as unknown;
}

// Try call: returns null on any failure (404/500/timeout) - silent fail.
async function tryApi<T = unknown>(path: string, opts: FetchOptions = {}): Promise<T | null> {
  try {
    return (await apiFetch(path, opts)) as T;
  } catch {
    return null;
  }
}

/**
 * Defensive wrapper: backend may return list in 4 shapes.
 * Try each wrapper, fall back to empty array.
 */
function asArray<T>(x: unknown): T[] {
  if (Array.isArray(x)) return x as T[];
  if (x && typeof x === 'object') {
    const obj = x as Record<string, unknown>;
    for (const key of ['data', 'content', 'items', 'results']) {
      const v = obj[key];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}

// ---- Section loaders ----

export async function getHeroBannersServerSide() {
  const data = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return data?.heroBanners ?? [];
}

export async function getCategoriesServerSide(size = 12) {
  const list = await tryApi(`/categories?size=${size}`);
  return asArray<import('@/types/home').Category>(list);
}

export async function getActiveFlashSalesServerSide() {
  // Could be FlashSale[] or { data: FlashSale[] } or { items: [...] }
  const data = await tryApi('/ecom-ops/flash-sales/active');
  const items = asArray<import('@/types/home').FlashSale>(data);
  if (items.length > 0) return items;
  // Maybe wrapped in { data: [...] } returning nested FlashSale with .items inside
  if (data && typeof data === 'object' && (data as any).data) {
    return asArray<import('@/types/home').FlashSale>((data as any).data);
  }
  return [];
}

export async function getVideosServerSide() {
  // Try flat endpoint first
  const flat = await tryApi('/videos');
  const flatItems = asArray<import('@/types/home').VideoTeaser>(flat);
  if (flatItems.length > 0) return flatItems;
  // Fallback: shop/home.videosTeaser
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return home?.videosTeaser ?? [];
}

export async function getLatestHealthArticleServerSide() {
  const list = await tryApi('/health-articles?status=PUBLISHED');
  const items = asArray<import('@/types/home').HealthArticle>(list);
  if (items.length === 0) return null;
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  )[0];
}

export async function getDiseasesServerSide() {
  const data = await tryApi('/diseases');
  return asArray<import('@/types/home').Disease>(data);
}

export async function getBrandsServerSide() {
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return home?.brands ?? [];
}

export async function getBestSellersServerSide() {
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return home?.bestSellers ?? [];
}

export async function getHealthQuizTeaserServerSide() {
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return home?.healthQuizTeaser ?? { available: false, url: '' };
}

export async function getSubPromosServerSide() {
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return (home as any)?.subPromos ?? [];
}

export async function getQuickLinksServerSide() {
  const home = await tryApi<import('@/types/home').HomePageResponse>('/shop/home');
  return home?.quickLinks ?? [];
}
