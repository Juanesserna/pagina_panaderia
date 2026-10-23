import { Box, Typography } from '@mui/material'
import { Select } from '@shared/ui'

// Campo de filtro: etiqueta en mayúsculas encima de un selector.
// "minWidth" es opcional y fija el ancho mínimo de la columna.
export default function CampoFiltro({ etiqueta, opciones, value, onChange, minWidth }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth }}>
      <Typography component="label" variant="overline" color="text.secondary">
        {etiqueta}
      </Typography>
      <Select options={opciones} value={value} onChange={onChange} />
    </Box>
  )
}
