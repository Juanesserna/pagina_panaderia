import { Box, Typography } from '@mui/material'

// Etiqueta + control, con el mismo tono "dim" que usa Producción.
export const dimLabelSx = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'text.dim',
}

export function Campo({ label, required = false, children, sx }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}>
      <Typography sx={dimLabelSx}>
        {label}
        {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
      </Typography>
      {children}
    </Box>
  )
}

export function CampoInfo({ label, value }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, borderRadius: 1.5, p: 1.5, bgcolor: 'background.alt' }}>
      <Typography sx={dimLabelSx}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>{value || '—'}</Typography>
    </Box>
  )
}
