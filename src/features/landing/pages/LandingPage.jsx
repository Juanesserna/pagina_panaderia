// src/features/landing/pages/LandingPage.jsx
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { Categories } from '../components/Categories'
import { Products } from '../components/Products'
import { Nosotros } from '../components/Nosotros'
import { Testimonios } from '../components/Testimonios'
import { Proceso } from '../components/Proceso'
import { CTAEspecial } from '../components/CTAEspecial'
import { useCart } from '../context/CartContext'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta

export default function LandingPage() {
  const { isDark } = useOutletContext()
  const { addItem, count, isOpen, openCart } = useCart()

  return (
    <>
      <Hero isDark={isDark} />
      <TrustBar />
      <Categories isDark={isDark} />
      <Products isDark={isDark} onAddToCart={addItem} limit={3} />
      <Box sx={{ bgcolor: isDark ? '#150a03' : '#F7F0E6', textAlign: 'center', pb: { xs: 8, md: 12 } }}>
        <Button
          component={RouterLink}
          to={ROUTES.CATALOGO}
          sx={{ border: '1px solid #C08552', color: '#C08552', px: 3.5, py: 1.4, fontSize: 13, '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' } }}
        >
          Ver catálogo completo
        </Button>
      </Box>
      <Nosotros isDark={isDark} />
      <Testimonios />
      <Proceso isDark={isDark} />
      <CTAEspecial />

      {/* Barra móvil de carrito */}
      {count > 0 && !isOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed', bottom: 0, left: 0, right: 0,
            bgcolor: '#5B3023', px: 3, py: 2, zIndex: 90,
            alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: 'rgba(250,245,238,0.75)' }}>
            {count} {count === 1 ? 'producto' : 'productos'} en tu pedido
          </Typography>
          <Button
            onClick={openCart}
            sx={{ bgcolor: '#C08552', color: '#FAF5EE', px: 2.5, py: 1.1, fontSize: 12, '&:hover': { bgcolor: '#a8723f' } }}
          >
            Ver pedido
          </Button>
        </Box>
      )}
    </>
  )
}