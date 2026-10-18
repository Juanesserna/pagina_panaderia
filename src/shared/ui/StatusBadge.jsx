import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

/* Paleta por defecto: colores del tema (respeta modo claro/oscuro). */
const themeColor = {
  success: 'success.main',
  danger: 'error.main',
  warning: 'warning.main',
  accent: 'primary.main',
  info: 'info.main',
  process: 'primary.main',
}

const themeBg = {
  success: 'rgba(110,139,61,0.12)',
  danger: 'rgba(192,57,43,0.12)',
  warning: 'rgba(242,169,60,0.12)',
  accent: 'rgba(192,133,82,0.12)',
  info: 'rgba(46,125,140,0.12)',
  process: 'rgba(192,133,82,0.12)',
}

/* Paleta fija (la que usaba el módulo de Ventas), con su variante oscura. */
const fixedColor = {
  success: '#658237',
  process: '#F53926',
  warning: '#F4A93C',
  danger: '#c53022',
  accent: '#1976D2',
  info: '#0288D1',
}

const fixedBg = {
  success: '#E9EFE0',
  process: '#F4E4DA',
  warning: '#FBE6C4',
  danger: '#FBF0EF',
  accent: 'rgba(25, 118, 210, 0.12)',
  info: 'rgba(2, 136, 209, 0.12)',
}

const fixedColorDark = {
  success: '#A3D115',
  process: '#e40d0d',
  warning: '#F29126',
  danger: '#F53926',
  accent: '#1976D2',
  info: '#0288D1',
}

const fixedBgDark = {
  success: '#34372A',
  process: '#3D271B',
  warning: '#48321C',
  danger: '#3D271B',
  accent: 'rgba(25, 118, 210, 0.12)',
  info: 'rgba(2, 136, 209, 0.12)',
}

/**
 * Pastilla de estado (ej: Completado, Pendiente, Retrasado).
 * variant: 'success' | 'accent' | 'warning' | 'danger' | 'info' | 'process'
 * dot: si true, muestra el puntito de color a la izquierda.
 * size: 'sm' (11px, por defecto) | 'md' (12px)
 * colors: 'theme' (por defecto, usa la paleta del tema) | 'fixed' (paleta fija con modo oscuro, usada por Ventas)
 */
export function StatusBadge({ variant = 'accent', dot = false, size = 'sm', colors = 'theme', children }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  let color
  let bg
  if (colors === 'fixed') {
    color = (isDark ? fixedColorDark : fixedColor)[variant] ?? fixedColor.accent
    bg = (isDark ? fixedBgDark : fixedBg)[variant] ?? fixedBg.accent
  } else {
    color = themeColor[variant] ?? themeColor.accent
    bg = themeBg[variant] ?? themeBg.accent
  }

  const isMd = size === 'md'

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: isMd ? 1.25 : 1.1,
        py: 0.4,
        borderRadius: 5,
        bgcolor: bg,
        color,
        fontSize: isMd ? 12 : 11,
        fontWeight: 600,
      }}
    >
      {dot && (
        <Box
          component="span"
          sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
        />
      )}
      {children}
    </Box>
  )
}
