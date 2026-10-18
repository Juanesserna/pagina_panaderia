import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

// variante → clave de la paleta del tema
const paletteKey = {
  success: 'success',
  danger: 'error',
  warning: 'warning',
  accent: 'primary',
  info: 'info',
}

/**
 * Tarjeta de KPI para la parte superior de cada módulo del panel
 * (ej: "Órdenes completadas", "Retrasadas", "Ventas del día", etc).
 * variant: 'accent' | 'success' | 'warning' | 'danger' | 'info'
 */
export function KPICard({ title, value, icon, variant = 'accent' }) {
  const key = paletteKey[variant] ?? paletteKey.accent
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.0,
        p: 2.2,
        paddingTop: 0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 50 }}>
        <Typography variant="overline">{title}</Typography>
        {icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (t) => alpha(t.palette[key].main, 0.12),
              color: `${key}.main`,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      <Typography variant="metric" component="div" sx={{ color: 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}
