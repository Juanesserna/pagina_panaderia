import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
} from '@mui/material'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useColorMode } from '../../app/providers/ThemeProvider'
import { ROUTES } from '../../app/router/routes'

// Título de página según la ruta activa (mismo texto que el ítem del Sidebar).
const TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.VENTAS]: 'Ventas',
  [ROUTES.PRODUCCION]: 'Producción',
  [ROUTES.INSUMOS]: 'Insumos',
  [ROUTES.COMPRAS]: 'Compras',
  [ROUTES.PROVEEDORES]: 'Proveedores',
  [ROUTES.CATEGORIAS]: 'Categorías',
  [ROUTES.PRODUCTOS]: 'Productos',
  [ROUTES.ROLES]: 'Roles',
  [ROUTES.USUARIOS]: 'Usuarios',
}

// TODO: reemplazar por el usuario real cuando exista auth conectado.
const usuarioMock = { nombre: 'Ana Martínez', rol: 'Administrador' }

export default function Header() {
  const theme = useTheme()
  const location = useLocation()
  const { mode, toggleColorMode } = useColorMode()

  const titulo = useMemo(() => TITLES[location.pathname] ?? '', [location.pathname])

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.alhorno.border}`,
        bgcolor: theme.alhorno.surface,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {titulo}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={toggleColorMode} title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
          {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
        </IconButton>

        <IconButton title="Notificaciones">
          <Badge color="error" variant="dot">
            <NotificationsNoneIcon fontSize="small" />
          </Badge>
        </IconButton>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ cursor: 'pointer', pl: 1, borderLeft: `1px solid ${theme.alhorno.border}` }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
            {usuarioMock.nombre
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
              {usuarioMock.nombre}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.alhorno.textMuted }}>
              {usuarioMock.rol}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon fontSize="small" sx={{ color: theme.alhorno.textMuted }} />
        </Stack>

        <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Mi perfil
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  )
}
