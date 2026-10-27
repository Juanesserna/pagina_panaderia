// src/features/landing/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'alhorno-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* noop */ }
  }, [items])

  const value = useMemo(() => {
    const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
    return {
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item) => {
        setItems((prev) => {
          const found = prev.find((i) => i.id === item.id)
          return found
            ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
            : [...prev, { ...item, qty: 1 }]
        })
        setIsOpen(true)
      },
      removeItem,
      updateQty: (id, qty) =>
        qty <= 0
          ? removeItem(id)
          : setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i))),
      clear: () => setItems([]),
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.price * i.qty, 0),
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}