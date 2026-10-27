import { alpha } from '@mui/material/styles'

// Estilo común de las tarjetas del detalle de producto
export const tarjetaSx = (theme) => ({
  borderRadius: 3,
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
})

// Contenedor del icono que acompaña al título de una tarjeta
export const iconoSx = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 1,
  flexShrink: 0,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
})

// Cuadrícula de dos columnas para los campos
export const gridCamposSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  rowGap: 2.5,
  columnGap: 3,
}