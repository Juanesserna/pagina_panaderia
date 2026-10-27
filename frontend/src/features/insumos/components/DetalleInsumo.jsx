import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVisualVariant } from '../constants/insumos.constants'
import { formatoCodigo, formatoMoneda, nombreCategoria, unidadAbrev, getEstadoVisual } from '../utils/insumosHelpers'
import { CampoInfo } from './Campo'
import { LotesCard } from './LotesCard'

const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

/**
 * Detalle de insumo como modal flotante sobre la lista
 * (mismo <Modal> de @shared/ui que el formulario).
 */
export function DetalleInsumo({ open, insumo, onEditar, onCerrar }) {
  if (!insumo) return null
  const estadoVisual = getEstadoVisual(insumo)
  const unidad = unidadAbrev(insumo.idUnidadMedida)

  return (
    <Modal open={open} onClose={onCerrar} title={insumo.nombre} size="lg" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Estado</Typography>
          <StatusBadge variant={estadoVisualVariant[estadoVisual]}>{estadoVisual}</StatusBadge>
        </Stack>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Información general</Typography>
          <Box sx={gridSx}>
            <CampoInfo label="Código" value={formatoCodigo(insumo.id)} />
            <CampoInfo label="Categoría" value={nombreCategoria(insumo.idCategoria)} />
            <CampoInfo label="Nombre" value={insumo.nombre} sx={anchoCompletoSx} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Inventario</Typography>
          <Box sx={gridSx}>
            <CampoInfo label="Unidad de medida" value={unidad} />
            <CampoInfo label="Stock actual" value={`${insumo.stockActual} ${unidad}`} />
            <CampoInfo label="Stock mínimo" value={`${insumo.stockMinimo} ${unidad}`} />
            <CampoInfo label="Costo promedio" value={`${formatoMoneda(insumo.costoPromedio)} / ${unidad}`} />
          </Box>
        </Box>

        <LotesCard lotes={insumo.lotes} unidad={unidad} />

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="ghost" size="sm" onClick={onCerrar}>
            Cerrar
          </Button>
          <Button variant="primary" size="sm" onClick={onEditar}>
            Editar insumo
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
