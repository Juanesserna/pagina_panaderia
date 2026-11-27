// src/features/landing/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Stack, Typography, IconButton, Button, Badge, Drawer,
  Menu, MenuItem, Divider,
} from '@mui/material'
import {
  IconShoppingCart, IconMenu2, IconX, IconSun, IconMoon,
  IconUserCircle, IconUser, IconPackage,
} from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta
import logoImg from '@assets/img/logo_claro.webp'

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
  const solid = scrolled || pathname !== ROUTES.LANDING

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (l) => typeof l.to === 'string' && pathname === l.to
  const transparentTop = !solid
  const iconColor = transparentTop ? '#F3E9DC' : isDark ? '#C08552' : '#5B3023'
  const menuIconColor = isDark ? '#C08552' : '#5B3023'

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
        height: 68,
        borderRadius: 0,
        justifyContent: 'center',
        bgcolor: solid ? (isDark ? 'rgba(26,13,7,0.9)' : 'rgba(250,245,238,0.9)') : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? '1px solid rgba(192,133,82,0.22)' : '1px solid transparent',
        transition: 'background-color 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
        boxShadow: 'none',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 3, justifyContent: 'space-between' }}>
        {/* Logo → inicio */}
        <Box
          component={RouterLink}
          to={ROUTES.LANDING}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            borderRadius: '50%',
            p: '2px',
            border: transparentTop ? '1px solid rgba(243,233,220,0.35)' : '1px solid rgba(192,133,82,0.35)',
            transition: 'border-color 0.25s ease',
            '&:hover': { borderColor: '#C08552' },
            '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '3px' },
          }}
        >
          <ImageWithFallback
            src={logoImg}
            alt="Al Horno — Panadería artesanal"
            style={{ height: 42, width: 42, objectFit: 'contain', borderRadius: '50%', display: 'block' }}
          />
        </Box>

        {/* Links de escritorio */}
        <Stack direction="row" spacing={5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          {links.map((l) => (
            <Typography
              key={l.label}
              component={RouterLink}
              to={l.to}
              sx={{
                position: 'relative',
                py: 0.6,
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive(l)
                  ? '#C08552'
                  : transparentTop
                    ? 'rgba(243,233,220,0.9)'
                    : isDark
                      ? 'rgba(243,233,220,0.82)'
                      : 'rgba(46,24,16,0.78)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '1px',
                  bgcolor: '#C08552',
                  transform: isActive(l) ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                },
                '&:hover': {
                  color: '#C08552',
                  '&::after': { transform: 'scaleX(1)' },
                },
                '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '4px', borderRadius: '2px' },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  '&::after': { transition: 'none' },
                },
              }}
            >
              {l.label}
            </Typography>
          ))}
        </Stack>

        {/* Acciones */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
          <IconButton
            onClick={onToggleDark}
            aria-label="Cambiar modo oscuro"
            sx={{
              color: iconColor,
              borderRadius: '50%',
              transition: 'background-color 0.25s ease, color 0.25s ease',
              '&:hover': {
                color: '#C08552',
                bgcolor: transparentTop || isDark ? 'rgba(192,133,82,0.14)' : 'rgba(91,48,35,0.06)',
              },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            {isDark ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
          </IconButton>

          <IconButton
            onClick={onCartOpen}
            aria-label="Carrito"
            sx={{
              color: iconColor,
              borderRadius: '50%',
              transition: 'background-color 0.25s ease, color 0.25s ease',
              '&:hover': {
                color: '#C08552',
                bgcolor: transparentTop || isDark ? 'rgba(192,133,82,0.14)' : 'rgba(91,48,35,0.06)',
              },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            <Badge
              badgeContent={cartCount}
              invisible={cartCount === 0}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#C08552',
                  color: '#FAF5EE',
                  fontFamily: fonts.sans,
                  fontSize: 10,
                  fontWeight: 500,
                },
              }}
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
              borderRadius: '50%',
              p: 1,
              transition: 'background-color 0.25s ease, color 0.25s ease',
              '&:hover': {
                color: '#C08552',
                bgcolor: transparentTop || isDark ? 'rgba(192,133,82,0.14)' : 'rgba(91,48,35,0.06)',
              },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
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
                  minWidth: 196,
                  borderRadius: '2px',
                  bgcolor: isDark ? '#2E1810' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(192,133,82,0.25)' : 'rgba(192,133,82,0.22)',
                  boxShadow: '0 12px 32px rgba(46,24,16,0.14)',
                  py: 0.5,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => goTo(ROUTES.PROFILE)}
              sx={{
                py: 1.2,
                px: 2,
                gap: 1.25,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.12)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <IconUser size={17} stroke={1.5} color={menuIconColor} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Mi perfil
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => goTo(ROUTES.MIS_PEDIDOS)}
              sx={{
                py: 1.2,
                px: 2,
                gap: 1.25,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.12)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <IconPackage size={17} stroke={1.5} color={menuIconColor} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Mis pedidos
              </Typography>
            </MenuItem>

            <Divider sx={{ my: 0.5, borderColor: 'rgba(192,133,82,0.18)' }} />

            <MenuItem
              onClick={() => goTo(ROUTES.LOGIN)}
              sx={{
                py: 1.2,
                px: 2,
                '&:hover': { bgcolor: isDark ? 'rgba(192,133,82,0.12)' : 'rgba(91,48,35,0.05)' },
              }}
            >
              <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 400, color: isDark ? '#F3E9DC' : '#2E1810' }}>
                Cerrar sesión
              </Typography>
            </MenuItem>
          </Menu>

          <Button
            component={RouterLink}
            to={ROUTES.LOGIN}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              ml: 1,
              bgcolor: '#5B3023',
              color: '#FAF5EE',
              border: transparentTop ? '1px solid rgba(192,133,82,0.45)' : '1px solid transparent',
              borderRadius: '999px',
              px: 3,
              py: 1,
              fontFamily: fonts.sans,
              fontSize: 11.5,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'background-color 0.25s ease, border-color 0.25s ease',
              '&:hover': { bgcolor: '#4a2519', borderColor: '#C08552' },
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            Iniciar sesión
          </Button>

          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: iconColor,
              borderRadius: '50%',
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
          >
            <IconMenu2 size={22} stroke={1.5} />
          </IconButton>
        </Stack>
      </Toolbar>

      {/* Menú móvil */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <Box sx={{ bgcolor: isDark ? '#1A0D07' : '#FAF5EE', pt: 8, pb: 3.5, px: 3, borderBottom: '1px solid rgba(192,133,82,0.22)' }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            sx={{
              position: 'absolute',
              top: 14,
              right: 16,
              color: menuIconColor,
              borderRadius: '50%',
              '&:focus-visible': { outline: '2px solid #C08552', outlineOffset: '2px' },
            }}
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
                py: 1.6,
                fontFamily: fonts.sans,
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive(l) ? '#C08552' : isDark ? '#F3E9DC' : '#2E1810',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(192,133,82,0.14)',
                transition: 'color 0.25s ease',
                '&:hover': { color: '#C08552' },
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
            sx={{
              mt: 2.5,
              bgcolor: '#5B3023',
              color: '#FAF5EE',
              borderRadius: '999px',
              py: 1.5,
              fontFamily: fonts.sans,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              '&:hover': { bgcolor: '#4a2519' },
            }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  )
}