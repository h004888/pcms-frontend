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
}

export function removeItem(medicineId) {
  const cart = readCart().filter((i) => i.medicineId !== medicineId)
  writeCart(cart)
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new CustomEvent('pcms-cart-changed'))
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + item.qty, 0)
}

export function getCartTotal() {
  return readCart().reduce((sum, item) => sum + item.price * item.qty, 0)
}
