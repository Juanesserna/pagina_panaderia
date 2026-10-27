import { Box, Typography } from '@mui/material'
import { StatusBadge } from '@shared/ui'
import { varianteTipoCategoria } from './comunes/opcionesCategoria'

const textoConteo = (cantidad, singular) =>
  `${cantidad} ${singular}${cantidad !== 1 ? 's' : ''}`

export default function TipoBadge({ tipo, productosCount = 0, insumosCount = 0 }) {
  const partes = []
  if (productosCount > 0) partes.push(textoConteo(productosCount, 'producto'))
  if (insumosCount > 0) partes.push(textoConteo(insumosCount, 'insumo'))
  const conteo = partes.join(' · ')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25 }}>
      <StatusBadge variant={varianteTipoCategoria(tipo)} size="sm">
        {tipo}
      </StatusBadge>
      {conteo && (
        <Typography variant="caption" color="text.secondary">
          {conteo}
        </Typography>
      )}
    </Box>
  )
}