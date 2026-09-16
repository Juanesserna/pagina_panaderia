import { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { Categories } from '../components/Categories'
import { Products } from '../components/Products'
import { CartDrawer } from '../components/CartDrawer'
import { Nosotros } from '../components/Nosotros'
import { Testimonios } from '../components/Testimonios'
import { Proceso } from '../components/Proceso'
import { CTAEspecial } from '../components/CTAEspecial'
import { Footer } from '../components/Footer'
import { LoginModal } from '@features/auth/components/LoginModal'

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('alhorno-dark')
    if (saved === 'true') setIsDark(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('alhorno-dark', String(isDark))
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...item, qty: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const totalCount = cartItems.reduce((acc, i) => acc + i.qty, 0)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#1A0D07' : '#FAF5EE' }}>
      <Navbar
        cartCount={totalCount}
        onCartOpen={() => setCartOpen(true)}
        onLoginOpen={() => setLoginOpen(true)}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
      />

      <Hero isDark={isDark} />
      <TrustBar />
      <Categories isDark={isDark} />
      <Products isDark={isDark} onAddToCart={addToCart} />
      <Nosotros isDark={isDark} />
      <Testimonios />
      <Proceso isDark={isDark} />
      <CTAEspecial />
      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        isDark={isDark}
      />

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} isDark={isDark} />

      {/* Barra móvil de carrito */}
      {totalCount > 0 && !cartOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#5B3023',
            px: 3,
            py: 2,
            zIndex: 90,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(250,245,238,0.75)' }}>
            {totalCount} {totalCount === 1 ? 'producto' : 'productos'} en tu pedido
          </Typography>
          <Button
            onClick={() => setCartOpen(true)}
            sx={{ bgcolor: '#C08552', color: '#FAF5EE', px: 2.5, py: 1.1, fontSize: 12, '&:hover': { bgcolor: '#a8723f' } }}
          >
            Ver pedido
          </Button>
        </Box>
      )}
    </Box>
  )
}
