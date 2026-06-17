// =====================================================
// BFF route: /api/shop/catalog/[[...slug]]/route.ts
// Wraps B2B /api/medicines endpoints + serves mock data
// Returns: categories tree, product list, product detail
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  CATEGORIES,
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  getBestsellers,
  type ProductListResponse,
} from '@/data/shop/catalog';

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const segments = params.slug ?? [];
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10))
  );
  const sort = searchParams.get('sort') ?? undefined;

  // === Route: /api/shop/catalog (no segments) ===
  if (segments.length === 0) {
    // Search
    if (q) {
      const result = searchProducts(q, { page, pageSize });
      return NextResponse.json({
        ...result,
        page,
        pageSize,
      });
    }
    // Top categories + bestsellers (for SHOP-HOME)
    return NextResponse.json({
      categories: CATEGORIES,
      bestsellers: getBestsellers(8),
    });
  }

  const [first, ...rest] = segments;

  // === Route: /api/shop/catalog/categories ===
  if (first === 'categories') {
    return NextResponse.json({ categories: CATEGORIES });
  }

  // === Route: /api/shop/catalog/bestsellers ===
  if (first === 'bestsellers') {
    const limit = parseInt(searchParams.get('limit') ?? '8', 10);
    return NextResponse.json({ products: getBestsellers(limit) });
  }

  // === Route: /api/shop/catalog/category/[slug] or /subcategory/[slug] ===
  if (first === 'category' || first === 'subcategory') {
    const categorySlug = rest[0];
    if (!categorySlug) {
      return NextResponse.json({ error: 'Missing category slug' }, { status: 400 });
    }
    const result = getProductsByCategory(categorySlug, {
      search: q ?? undefined,
      sort,
      page,
      pageSize,
    });
    const response: ProductListResponse = {
      products: result.products,
      total: result.total,
      page,
      pageSize,
      facets: result.facets,
    };
    return NextResponse.json(response);
  }

  // === Route: /api/shop/catalog/product/[slug] ===
  if (first === 'product') {
    const slug = rest[0];
    if (!slug) {
      return NextResponse.json({ error: 'Missing product slug' }, { status: 400 });
    }
    const product = getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  // Fallback: try as a direct product slug
  const directProduct = getProductBySlug(first);
  if (directProduct) {
    return NextResponse.json({ product: directProduct });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
