import { useState, useEffect, useCallback } from 'react'
import { getCart, addToCart as addItem, updateQty as changeQty, removeItem as deleteItem, clearCart as emptyCart, getCartCount, getCartTotal } from '../services/cartStorage'

export function useCart() {
  const [cart, setCart] = useState(() => getCart())
  const [cartCount, setCartCount] = useState(() => getCartCount())
  const [cartTotal, setCartTotal] = useState(() => getCartTotal())

  const refresh = useCallback(() => {
    setCart(getCart())
    setCartCount(getCartCount())
    setCartTotal(getCartTotal())
  }, [])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('pcms-cart-changed', handler)
    return () => window.removeEventListener('pcms-cart-changed', handler)
  }, [refresh])

  const addToCart = useCallback((item) => {
    addItem(item)
  }, [])

  const updateQty = useCallback((medicineId, delta) => {
    changeQty(medicineId, delta)
  }, [])

  const removeItem = useCallback((medicineId) => {
    deleteItem(medicineId)
  }, [])

  const clearCart = useCallback(() => {
    emptyCart()
  }, [])

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    isLoading: false,
  }
}
