import { Typography } from '@mui/material'

// Etiqueta tenue de los modales de detalle (no forma parte del panel de filtros).
export default function DimLabel({ children, sx }) {
  return (
    <Typography variant="overline" component="div" sx={{ color: 'text.dim', ...sx }}>
      {children}
    </Typography>
  )
}
