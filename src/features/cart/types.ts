// =====================================================
// PCMS - Cart Feature Types (customer-portal-service)
// Wire to CartResponse / CartItemResponse / ApplyVoucherResponse
// =====================================================

export interface CartItem {
  id: string;
  medicineId: string;
  medicineName: string;
  imageUrl?: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  voucherCode?: string;
  status: string;
  updatedAt: string;
}

export interface AddCartItemRequest {
  medicineId: string;
  qty: number;
}

export interface UpdateCartItemRequest {
  qty: number;
}

export interface VoucherResult {
  valid: boolean;
  discount: number;
  newTotal: number;
  reason?: string;
}

export interface CheckoutPreviewRequest {
  shippingMethod?: string;
  paymentMethod?: string;
  voucherCode?: string;
}

export interface CheckoutPreview {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  voucherCode?: string;
}

export interface CheckoutConfirmRequest {
  shippingMethod: string;
  paymentMethod: string;
  voucherCode?: string;
  address: {
    name: string;
    phone: string;
    line: string;
    province: string;
  };
}

export interface CheckoutConfirm {
  orderId: string;
  orderNumber: string;
  total: number;
  status: string;
}
