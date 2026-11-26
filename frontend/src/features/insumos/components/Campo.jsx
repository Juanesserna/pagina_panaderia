import { Box, Typography } from '@mui/material'

// Etiqueta (overline) + control. Lo usan el formulario y el panel de filtros.
// TODO: si otros módulos lo necesitan, proponer FormField en shared/ui con PR aparte.
//
// error: mensaje de validación en tiempo real. Si viene con texto, el campo se
//        marca en rojo (etiqueta, borde) y el mensaje se muestra debajo.
//        El color sale del tema (error.main); el Input/Select compartidos no se tocan.
// onBlur: se dispara cuando el foco sale del campo (para marcarlo como "tocado").
export function Campo({ label, required = false, error = '', onBlur, children, sx }) {
  const hayError = Boolean(error)
  return (
    <Box onBlur={onBlur} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography variant="overline" component="div" sx={hayError ? { color: 'error.main' } : undefined}>
        {label}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <Box
        sx={
          hayError
            ? { '&& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'error.main' } }
            : undefined
        }
      >
        {children}
      </Box>
      {hayError && (
        <Typography variant="caption" role="alert" sx={{ color: 'error.main' }}>
          {error}
        </Typography>
      )}
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
