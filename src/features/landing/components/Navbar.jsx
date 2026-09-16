import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Box, Stack, Typography, IconButton, Button, Badge, Drawer } from '@mui/material'
import {
  IconShoppingCart,
  IconMenu2,
  IconX,
  IconSun,
  IconMoon,
  IconUserCircle,
} from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { getColors, fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.png'

const links = [
  { label: 'Carta', href: '#carta' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Pedidos', href: '#proceso' },
  { label: 'Contacto', href: '#footer' },
]

export function Navbar({ cartCount, onCartOpen, onLoginOpen, isDark, onToggleDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const c = getColors(isDark)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 64,
        justifyContent: 'center',
        bgcolor: scrolled ? (isDark ? 'rgba(26,13,7,0.92)' : 'rgba(250,245,238,0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(192,133,82,0.15)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 3, justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box component="a" href="#" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ImageWithFallback
            src={logoImg}
            alt="Al Horno — Panadería artesanal"
            style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: '50%' }}
          />
        </Box>

        {/* Links de escritorio */}
        <Stack direction="row" spacing={4.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          {links.map((l) => (
            <Typography
              key={l.label}
              component="a"
              href={l.href}
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: isDark ? 'rgba(243,233,220,0.75)' : 'rgba(46,24,16,0.7)',
                textDecoration: 'none',
                '&:hover': { color: c.accent },
              }}
            >
              {l.label}
            </Typography>
          ))}
        </Stack>

        {/* Acciones */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton onClick={onToggleDark} aria-label="Cambiar modo oscuro" sx={{ color: isDark ? c.accent : '#5B3023' }}>
            {isDark ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
          </IconButton>

          <IconButton onClick={onLoginOpen} aria-label="Iniciar sesión" sx={{ color: isDark ? c.accent : '#5B3023' }}>
            <IconUserCircle size={20} stroke={1.5} />
          </IconButton>

          <IconButton onClick={onCartOpen} aria-label="Carrito" sx={{ color: isDark ? c.accent : '#5B3023' }}>
            <Badge
              badgeContent={cartCount}
              invisible={cartCount === 0}
              sx={{ '& .MuiBadge-badge': { bgcolor: c.accent, color: '#FAF5EE' } }}
            >
              <IconShoppingCart size={20} stroke={1.5} />
            </Badge>
          </IconButton>

          <Button
            href="#carta"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              bgcolor: '#5B3023',
              color: '#FAF5EE',
              px: 2.5,
              py: 1,
              fontSize: 13,
              '&:hover': { bgcolor: '#4a2519' },
            }}
          >
            Pedir ahora
          </Button>

          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, color: isDark ? c.accent : '#5B3023' }}
          >
            <IconMenu2 size={22} stroke={1.5} />
          </IconButton>
        </Stack>
      </Toolbar>

      {/* Menú móvil */}
      <Drawer anchor="top" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', pt: 8, pb: 3, px: 3 }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ position: 'absolute', top: 12, right: 12, color: isDark ? c.accent : '#5B3023' }}
          >
            <IconX size={22} stroke={1.5} />
          </IconButton>
          {links.map((l) => (
            <Typography
              key={l.label}
              component="a"
              href={l.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                display: 'block',
                py: 1.5,
                fontFamily: fonts.sans,
                fontSize: 15,
                color: isDark ? '#F3E9DC' : '#2E1810',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(192,133,82,0.1)',
              }}
            >
              {l.label}
            </Typography>
          ))}
          <Button
            href="#carta"
            fullWidth
            onClick={() => setMobileOpen(false)}
            sx={{ mt: 2, bgcolor: '#5B3023', color: '#FAF5EE', py: 1.5, '&:hover': { bgcolor: '#4a2519' } }}
          >
            Pedir ahora
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  )
}
