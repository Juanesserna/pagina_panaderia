import { Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

/* LEGADO: paleta fija que usaba Ventas (con variante oscura). Son colores escritos a mano:
   se eliminan cuando diseño decida usar los colores del tema en todos los módulos. */
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
 * colors: 'theme' (por defecto, usa la paleta del tema) | 'fixed' (LEGADO: paleta fija de Ventas)
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
    // Colores del tema: el fondo es el mismo color al 12% de opacidad
    const { palette } = theme
    const byVariant = {
      success: palette.success.main,
      danger: palette.error.main,
      warning: palette.warning.main,
      accent: palette.primary.main,
      info: palette.info.main,
      process: palette.primary.main,
    }
    color = byVariant[variant] ?? byVariant.accent
    bg = alpha(color, 0.12)
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
        typography: isMd ? 'body2' : 'caption',
        fontWeight: 'fontWeightSemiBold',
        color,
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
