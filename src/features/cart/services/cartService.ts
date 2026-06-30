// =====================================================
// PCMS - Cart Service (customer-portal-service)
// 7 endpoints: get, add, update, remove, clear, preview, confirm
// Auth: gateway forwards X-User-Id from JWT (apiClient interceptor handles Bearer)
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  AddCartItemRequest,
  Cart,
  CartItem,
  CheckoutConfirm,
  CheckoutConfirmRequest,
  CheckoutPreview,
  CheckoutPreviewRequest,
  UpdateCartItemRequest,
  VoucherResult,
} from '../types';

// Backend returns CartResponse with BigDecimal; we map to plain numbers.
function toCart(raw: any): Cart {
  return {
    id: raw.id,
    customerId: raw.customerId,
    items: (raw.items ?? []).map((it: any): CartItem => ({
      id: it.id,
      medicineId: it.medicineId,
      medicineName: it.medicineName,
      imageUrl: it.imageUrl ?? undefined,
      qty: it.qty,
      unitPrice: Number(it.unitPrice ?? 0),
      subtotal: Number(it.subtotal ?? 0),
      discount: Number(it.discount ?? 0),
    })),
    subtotal: Number(raw.subtotal ?? 0),
    discount: Number(raw.discount ?? 0),
    total: Number(raw.total ?? 0),
    voucherCode: raw.voucherCode ?? undefined,
    status: raw.status ?? '',
    updatedAt: raw.updatedAt ?? '',
  };
}

export async function fetchCart(): Promise<Cart> {
  const res = await apiClient.get<any>(API_ENDPOINTS.CART);
  return toCart(res.data);
}

export async function addCartItem(payload: AddCartItemRequest): Promise<Cart> {
  const res = await apiClient.post<any>(API_ENDPOINTS.CART_ITEMS, payload);
  return toCart(res.data);
}

export async function updateCartItem(
  itemId: string,
  payload: UpdateCartItemRequest
): Promise<Cart> {
  const res = await apiClient.put<any>(
    API_ENDPOINTS.CART_ITEM_DETAIL(itemId),
    payload
  );
  return toCart(res.data);
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const res = await apiClient.delete<any>(
    API_ENDPOINTS.CART_ITEM_DETAIL(itemId)
  );
  return toCart(res.data);
}

export async function clearCart(): Promise<Cart> {
  const res = await apiClient.delete<any>(API_ENDPOINTS.CART);
  return toCart(res.data);
}

export async function applyVoucher(code: string): Promise<VoucherResult> {
  const res = await apiClient.post<any>(
    API_ENDPOINTS.VOUCHERS_APPLY,
    { voucherCode: code }
  );
  const raw = res.data ?? {};
  return {
    valid: Boolean(raw.valid),
    discount: Number(raw.discount ?? 0),
    newTotal: Number(raw.newTotal ?? 0),
    reason: raw.reason ?? undefined,
  };
}

export async function checkoutPreview(
  payload: CheckoutPreviewRequest
): Promise<CheckoutPreview> {
  const res = await apiClient.post<any>(
    API_ENDPOINTS.CART_CHECKOUT_PREVIEW,
    payload
  );
  const raw = res.data ?? {};
  return {
    subtotal: Number(raw.subtotal ?? 0),
    discount: Number(raw.discount ?? 0),
    shipping: Number(raw.shipping ?? 0),
    total: Number(raw.total ?? 0),
    voucherCode: raw.voucherCode ?? undefined,
  };
}

export async function checkoutConfirm(
  payload: CheckoutConfirmRequest
): Promise<CheckoutConfirm> {
  const res = await apiClient.post<any>(
    API_ENDPOINTS.CART_CHECKOUT_CONFIRM,
    payload
  );
  const raw = res.data ?? {};
  return {
    orderId: raw.orderId ?? '',
    orderNumber: raw.orderNumber ?? '',
    total: Number(raw.total ?? 0),
    status: raw.status ?? '',
  };
}
