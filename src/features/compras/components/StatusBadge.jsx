import { Box } from '@mui/material'

const variantColor = {
  success: 'success.main',
  danger: 'error.main',
  warning: 'warning.main',
  accent: 'primary.main',
  info: 'info.main',
}

const variantBg = {
  success: 'rgba(110,139,61,0.12)',
  danger: 'rgba(192,57,43,0.12)',
  warning: 'rgba(242,169,60,0.12)',
  accent: 'rgba(192,133,82,0.12)',
  info: 'rgba(46,125,140,0.12)',
}

/**
 * Pastilla de estado (ej: Completado, Pendiente, Retrasado).
 * variant: 'success' | 'accent' | 'warning' | 'danger' | 'info'
 * dot: si true, muestra el puntito de color a la izquierda.
 */
export function StatusBadge({ variant = 'accent', dot = false, children }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.1,
        py: 0.4,
        borderRadius: 5,
        bgcolor: variantBg[variant],
        color: variantColor[variant],
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {dot && (
        <Box
          component="span"
          sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: variantColor[variant], flexShrink: 0 }}
        />
      )}
      {children}
    </Box>
  )
}