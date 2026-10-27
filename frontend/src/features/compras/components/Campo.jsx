import { Box, Typography } from '@mui/material'

/**
 * Campo de formulario: etiqueta arriba (overline), el control debajo y una ayuda opcional.
 * Uso:  <Campo label="Proveedor" ayuda="Opcional"><Select .../></Campo>
 */
export function Campo({ label, ayuda, children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="overline" component="div">
        {label}
      </Typography>
      {children}
      {ayuda && (
        <Typography variant="caption" sx={{ color: 'text.dim' }}>
          {ayuda}
        </Typography>
      )}
    </Box>
  )
}
