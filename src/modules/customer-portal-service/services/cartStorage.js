import { addCartItem, updateCartItem, removeCartItem, getBackendCart, clearBackendCart } from '../api/shopApi'

const CART_KEY = 'pcms_cart'

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('pcms-cart-changed'))
}

function writeCartSilent(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

function toFrontendItem(backendItem) {
  return {
    medicineId: backendItem.medicineId,
    backendId: backendItem.id,
    name: backendItem.medicineName,
    price: backendItem.unitPrice,
    qty: backendItem.qty,
    imageUrl: backendItem.imageUrl || '',
    prescriptionRequired: false,
  }
}

export function getCart() {
  return readCart()
}

export function addToCart(item) {
  const cart = readCart()
  const existing = cart.find((i) => i.medicineId === item.medicineId)

  if (existing) {
    existing.qty = Math.min(existing.qty + (item.qty || 1), 99)
  } else {
    cart.push({
      medicineId: item.medicineId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || '',
      qty: item.qty || 1,
      prescriptionRequired: item.prescriptionRequired || false,
    })
  }

  writeCart(cart)

  addCartItem({ medicineId: item.medicineId, qty: existing ? existing.qty : (item.qty || 1) }).catch(() => {})
}

export function updateQty(medicineId, delta) {
  const cart = readCart()
  const item = cart.find((i) => i.medicineId === medicineId)
  if (!item) return

  const newQty = item.qty + delta
  if (newQty < 1) {
    return removeItem(medicineId)
  }

  item.qty = Math.min(newQty, 99)
  writeCart(cart)

  if (item.backendId) {
    updateCartItem(item.backendId, { qty: item.qty }).catch(() => {})
  } else {
    addCartItem({ medicineId: item.medicineId, qty: item.qty }).catch(() => {})
  }
}

export function removeItem(medicineId) {
  const cart = readCart()
  const item = cart.find((i) => i.medicineId === medicineId)

  const newCart = cart.filter((i) => i.medicineId !== medicineId)
  writeCart(newCart)

  if (item && item.backendId) {
    removeCartItem(item.backendId).catch(() => {})
  }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new CustomEvent('pcms-cart-changed'))
  clearBackendCart().catch(() => {})
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + item.qty, 0)
}

export function getCartTotal() {
  return readCart().reduce((sum, item) => sum + item.price * item.qty, 0)
}

export async function syncFromBackend() {
  try {
    const backendCart = await getBackendCart()
    if (backendCart && backendCart.items) {
      const frontendItems = backendCart.items.map(toFrontendItem)
      writeCartSilent(frontendItems)
      window.dispatchEvent(new CustomEvent('pcms-cart-changed'))
    }
  } catch {
    // silent fail
  }
}
