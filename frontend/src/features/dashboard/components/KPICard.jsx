import { Box, Typography } from '@mui/material'

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
 * Tarjeta de KPI para la parte superior de cada módulo del panel
 * (ej: "Órdenes completadas", "Retrasadas", "Ventas del día", etc).
 */
export function KPICard({ title, value, icon, variant = 'accent' }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.0,
        p: 2.2,
        paddingTop:0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',height: 50, }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: variantBg[variant],
              color: variantColor[variant],
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>{value}</Typography>
    </Box>
  )
}