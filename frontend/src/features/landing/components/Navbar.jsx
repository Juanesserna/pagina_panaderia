// src/features/landing/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Stack, Typography, IconButton, Button, Badge, Drawer,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider,
} from '@mui/material'
import {
  IconShoppingCart, IconMenu2, IconX, IconSun, IconMoon,
  IconUserCircle, IconUser, IconPackage,
} from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { getColors, fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta
import logoImg from '@assets/img/logo_claro.png'

const links = [
  { label: 'Catálogo', to: ROUTES.CATALOGO },
  { label: 'Nosotros', to: { pathname: ROUTES.LANDING, hash: '#nosotros' } },
  { label: 'Pedidos', to: { pathname: ROUTES.LANDING, hash: '#proceso' } },
  { label: 'Contacto', to: { pathname: ROUTES.LANDING, hash: '#footer' } },
]

export function Navbar({ cartCount, onCartOpen, isDark, onToggleDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileAnchor, setProfileAnchor] = useState(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const c = getColors(isDark)
  const solid = scrolled || pathname !== ROUTES.LANDING

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (l) => typeof l.to === 'string' && pathname === l.to
  const iconColor = isDark ? c.accent : '#5B3023'

  const profileMenuOpen = Boolean(profileAnchor)
  const handleProfileClick = (e) => setProfileAnchor(e.currentTarget)
  const handleProfileClose = () => setProfileAnchor(null)
  const goTo = (route) => {
    handleProfileClose()
    navigate(route)
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 64,
        justifyContent: 'center',
        bgcolor: solid ? (isDark ? 'rgba(26,13,7,0.92)' : 'rgba(250,245,238,0.92)') : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? '1px solid rgba(192,133,82,0.15)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 3, justifyContent: 'space-between' }}>
        {/* Logo → inicio */}
        <Box component={RouterLink} to={ROUTES.LANDING} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
              component={RouterLink}
              to={l.to}
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: isActive(l) ? c.accent : isDark ? 'rgba(243,233,220,0.75)' : 'rgba(46,24,16,0.7)',
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
          <IconButton onClick={onToggleDark} aria-label="Cambiar modo oscuro" sx={{ color: iconColor }}>
            {isDark ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
          </IconButton>

          <IconButton onClick={onCartOpen} aria-label="Carrito" sx={{ color: iconColor }}>
            <Badge
              badgeContent={cartCount}
              invisible={cartCount === 0}
              sx={{ '& .MuiBadge-badge': { bgcolor: c.accent, color: '#FAF5EE' } }}
            >
              <IconShoppingCart size={20} stroke={1.5} />
            </Badge>
          </IconButton>

          {/* Icono de perfil + menú desplegable */}
          <IconButton
            onClick={handleProfileClick}
            aria-label="Cuenta"
            aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={profileMenuOpen ? 'true' : undefined}
            sx={{
              color: iconColor,
              p: 1,
              '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.12)' : 'rgba(91,48,35,0.06)' },
            }}
          >
            <IconUserCircle size={20} stroke={1.5} />
          </IconButton>

          <Menu
            id="profile-menu"
            anchorEl={profileAnchor}
            open={profileMenuOpen}
            onClose={handleProfileClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1.5,
                  minWidth: 190,
                  borderRadius: '12px',
                  bgcolor: isDark ? '#2A160B' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(192,133,82,0.2)' : 'rgba(91,48,35,0.1)',
                  boxShadow: isDark
                    ? '0 8px 24px rgba(0,0,0,0.35)'
                    : '0 8px 24px rgba(91,48,35,0.12)',
                  py: 0.5,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => goTo(ROUTES.PROFILE)}
              sx={{
                py: 1.1,
                px: 2,
                gap: 1.25,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.1)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <IconUser size={17} stroke={1.5} color={iconColor} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Mi perfil
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => goTo(ROUTES.MIS_PEDIDOS)}
              sx={{
                py: 1.1,
                px: 2,
                gap: 1.25,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.1)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <IconPackage size={17} stroke={1.5} color={iconColor} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Mis pedidos
              </Typography>
            </MenuItem>

            <Divider sx={{ my: 0.5, borderColor: isDark ? 'rgba(192,133,82,0.15)' : 'rgba(91,48,35,0.08)' }} />

            <MenuItem
              onClick={() => goTo(ROUTES.LOGIN)}
              sx={{
                py: 1.1,
                px: 2,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.1)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13.5, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Cerrar sesión
              </Typography>
            </MenuItem>
          </Menu>

          <Button
            component={RouterLink}
            to={ROUTES.LOGIN}
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
            Iniciar sesión
          </Button>

          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            sx={{ display: { xs: 'flex', md: 'none' }, color: iconColor }}
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
            aria-label="Cerrar menú"
            sx={{ position: 'absolute', top: 12, right: 12, color: iconColor }}
          >
            <IconX size={22} stroke={1.5} />
          </IconButton>
          {links.map((l) => (
            <Typography
              key={l.label}
              component={RouterLink}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              sx={{
                display: 'block',
                py: 1.5,
                fontFamily: fonts.sans,
                fontSize: 15,
                color: isActive(l) ? c.accent : isDark ? '#F3E9DC' : '#2E1810',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(192,133,82,0.1)',
              }}
            >
              {l.label}
            </Typography>
          ))}
          <Button
            component={RouterLink}
            to={ROUTES.LOGIN}
            fullWidth
            onClick={() => setMobileOpen(false)}
            sx={{ mt: 2, bgcolor: '#5B3023', color: '#FAF5EE', py: 1.5, '&:hover': { bgcolor: '#4a2519' } }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  )
}