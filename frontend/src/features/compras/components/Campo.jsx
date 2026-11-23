import { Box, Typography } from '@mui/material'

/**
 * Campo de formulario: etiqueta arriba (overline), el control debajo y una ayuda opcional.
 * Uso:  <Campo label="Proveedor" ayuda="Opcional"><Select .../></Campo>
 */
export function Campo({ label, ayuda, children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0, width: '100%' }}>
      <Typography variant="overline" component="div" sx={{ lineHeight: 1.35, minWidth: 0, overflowWrap: 'break-word' }}>
        {label}
      </Typography>
      <Box sx={{ minWidth: 0, width: '100%', '& > *': { minWidth: 0, maxWidth: '100%' } }}>{children}</Box>
      {ayuda && (
        <Typography variant="caption" sx={{ color: 'text.dim', lineHeight: 1.35, minWidth: 0, overflowWrap: 'break-word' }}>
          {ayuda}
        </Typography>
      )}
    </Box>
  )
}
