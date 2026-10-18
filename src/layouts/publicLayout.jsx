// src/layouts/PublicLayout.jsx
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar } from '@features/landing/components/Navbar'
import { Footer } from '@features/landing/components/Footer'
import { CartDrawer } from '@features/landing/components/CartDrawer'
import { CartProvider, useCart } from '@features/landing/context/CartContext'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta

function PublicShell() {
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const cart = useCart()
  const [isDark, setIsDark] = useState(() => localStorage.getItem('alhorno-dark') === 'true')

  useEffect(() => {
    localStorage.setItem('alhorno-dark', String(isDark))
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Scroll a #ancla al navegar entre páginas; arriba en cualquier otro cambio de ruta
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50)
    return () => clearTimeout(t)
  }, [pathname, hash])

  const handleCheckout = () => {
    cart.closeCart()
    navigate(ROUTES.CHECKOUT)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#1A0D07' : '#FAF5EE' }}>
      <Navbar
        cartCount={cart.count}
        onCartOpen={cart.openCart}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
      />

      <Outlet context={{ isDark }} />

      <Footer />

      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.items}
        onRemove={cart.removeItem}
        onUpdateQty={cart.updateQty}
        onCheckout={handleCheckout}
        isDark={isDark}
      />
    </Box>
  )
}

export default function PublicLayout() {
  return (
    <CartProvider>
      <PublicShell />
    </CartProvider>
  )
}