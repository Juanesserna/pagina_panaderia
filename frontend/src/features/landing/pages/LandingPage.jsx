// src/features/landing/pages/LandingPage.jsx
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { Categories } from '../components/Categories'
import { Products } from '../components/Products'
import { Nosotros } from '../components/Nosotros'
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
          sx={{
            border: '1px solid #C08552',
            borderRadius: '2px',
            color: '#C08552',
            px: 4.5,
            py: 1.5,
            fontFamily: fonts.sans,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            '&:hover': { bgcolor: '#C08552', color: '#FAF5EE' },
            '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '3px' },
          }}
        >
          Ver catálogo completo
        </Button>
      </Box>
      <Nosotros isDark={isDark} />
      <Proceso isDark={isDark} />
      <CTAEspecial />

      {/* Barra móvil de carrito */}
      {count > 0 && !isOpen && (
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed', bottom: 0, left: 0, right: 0,
            bgcolor: '#5B3023',
            borderTop: '1px solid rgba(192,133,82,0.38)',
            boxShadow: '0 -8px 24px rgba(46,24,16,0.2)',
            px: 3, py: 1.75, zIndex: 90,
            alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 400, color: 'rgba(250,245,238,0.85)' }}>
            {count} {count === 1 ? 'producto' : 'productos'} en tu pedido
          </Typography>
          <Button
            onClick={openCart}
            sx={{
              bgcolor: '#C08552',
              color: '#FAF5EE',
              borderRadius: '2px',
              px: 2.5,
              py: 1,
              fontFamily: fonts.sans,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'background-color 0.25s ease',
              '&:hover': { bgcolor: '#a8723f' },
              '&:focus-visible': { outline: '2px solid #FAF5EE', outlineOffset: '2px' },
            }}
          >
            Ver pedido
          </Button>
        </Box>
      )}
    </>
  )
}