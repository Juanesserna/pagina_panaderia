import { Box, Typography } from '@mui/material'

// Etiqueta (overline) + control. Lo usan el formulario y el panel de filtros.
// TODO: si otros módulos lo necesitan, proponer FormField en shared/ui con PR aparte.
export function Campo({ label, required = false, children, sx }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography variant="overline" component="div">
        {label}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      {children}
    </Box>
  )
}

// Etiqueta + valor de solo lectura (vista de detalle).
export function CampoInfo({ label, value, sx }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography variant="overline" component="div">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary' }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}
