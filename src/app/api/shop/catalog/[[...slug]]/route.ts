// =====================================================
// BFF route: /api/shop/catalog/[[...slug]]/route.ts
// Wraps B2B /api/medicines endpoints + serves mock data
// Returns: categories tree, product list, product detail
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import {
	CATEGORIES,
	getProductBySlug,
	getProductsByCategory,
	searchProducts,
	getBestsellers,
} from "@/data/shop/catalog";
import type { ProductListResponse } from "@/types/shop/catalog";

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 60;

type RouteParams = { params: { slug?: string[] } };
type SearchParams = {
	q: string | null;
	page: number;
	pageSize: number;
	sort?: string;
};

function parseSearchParams(request: NextRequest): SearchParams {
	const sp = request.nextUrl.searchParams;
	return {
		q: sp.get("q"),
		page: Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1),
		pageSize: Math.min(
			MAX_PAGE_SIZE,
			Math.max(
				1,
				parseInt(sp.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10) ||
					DEFAULT_PAGE_SIZE,
			),
		),
		sort: sp.get("sort") ?? undefined,
	};
}

function handleRoot(sp: SearchParams) {
	if (sp.q) {
		return NextResponse.json({
			...searchProducts(sp.q, { page: sp.page, pageSize: sp.pageSize }),
			page: sp.page,
			pageSize: sp.pageSize,
		});
	}
	return NextResponse.json({
		categories: CATEGORIES,
		bestsellers: getBestsellers(8),
	});
}

function handleCategoryList(sp: SearchParams) {
	if (sp.q) {
		const result = searchProducts(sp.q, {
			page: sp.page,
			pageSize: sp.pageSize,
		});
		return NextResponse.json({
			...result,
			page: sp.page,
			pageSize: sp.pageSize,
		});
	}
	return NextResponse.json({ categories: CATEGORIES });
}

function handleBestsellers(request: NextRequest) {
	const limit =
		parseInt(request.nextUrl.searchParams.get("limit") ?? "8", 10) || 8;
	return NextResponse.json({ products: getBestsellers(limit) });
}

function handleCategory(categorySlug: string | undefined, sp: SearchParams) {
	if (!categorySlug) {
		return NextResponse.json(
			{ error: "Missing category slug" },
			{ status: 400 },
		);
	}
	const result = getProductsByCategory(categorySlug, {
		search: sp.q ?? undefined,
		sort: sp.sort,
		page: sp.page,
		pageSize: sp.pageSize,
	});
	const response: ProductListResponse = {
		products: result.products,
		total: result.total,
		page: sp.page,
		pageSize: sp.pageSize,
		facets: result.facets,
	};
	return NextResponse.json(response);
}

function handleProduct(slug: string | undefined) {
	if (!slug) {
		return NextResponse.json(
			{ error: "Missing product slug" },
			{ status: 400 },
		);
	}
	const product = getProductBySlug(slug);
	if (!product) {
		return NextResponse.json({ error: "Product not found" }, { status: 404 });
	}
	return NextResponse.json({ product });
}

export function GET(request: NextRequest, { params }: RouteParams) {
	const segments = params.slug ?? [];
	const sp = parseSearchParams(request);

	// Root: /api/shop/catalog
	if (segments.length === 0) {
		return handleRoot(sp);
	}

	const [first, ...rest] = segments;

	switch (first) {
		case "categories":
			return handleCategoryList(sp);
		case "bestsellers":
			return handleBestsellers(request);
		case "category":
		case "subcategory":
			return handleCategory(rest[0], sp);
		case "product":
			return handleProduct(rest[0]);
		default:
			// Fallback: try as a direct product slug
			const directProduct = getProductBySlug(first);
			if (directProduct) {
				return NextResponse.json({ product: directProduct });
			}
			return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
}
