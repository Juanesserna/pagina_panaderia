import { Box, Stack, Typography, IconButton } from '@mui/material'
import { IconArrowLeft, IconPencil } from '@tabler/icons-react'
import { Button } from '@features/produccion/components/Button'
import { StatusBadge } from '@features/produccion/components/StatusBadge'
import { CampoInfo, dimLabelSx } from './Campo'
import { LotesCard } from './LotesCard'
import {
  formatoCodigo,
  formatoMoneda,
  nombreCategoria,
  unidadAbrev,
  getEstadoVisual,
  estadoVisualVariant,
} from '../utils/insumosHelpers'

const panelSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  borderRadius: 2.5,
  p: 2.5,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
}

export function DetalleInsumo({ insumo, onEditar, onVolver }) {
  const estadoVisual = getEstadoVisual(insumo)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={onVolver} sx={{ color: 'text.secondary' }}>
            <IconArrowLeft size={18} />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>{insumo.nombre}</Typography>
            <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: 'text.dim' }}>
              {formatoCodigo(insumo.id)}
            </Typography>
          </Box>
        </Stack>
        <Button variant="primary" size="sm" leftIcon={<IconPencil size={13} />} onClick={onEditar}>
          Editar
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Información general</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <CampoInfo label="Código" value={formatoCodigo(insumo.id)} />
              <CampoInfo label="Nombre" value={insumo.nombre} />
              <CampoInfo label="Categoría" value={nombreCategoria(insumo.idCategoria)} />
              <CampoInfo label="Descripción" value={insumo.descripcion} />
            </Box>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Inventario</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              <CampoInfo label="Unidad de medida" value={unidadAbrev(insumo.idUnidadMedida)} />
              <CampoInfo label="Stock actual" value={insumo.stockActual} />
              <CampoInfo label="Stock mínimo" value={insumo.stockMinimo} />
            </Box>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Costos</Typography>
            <CampoInfo
              label="Costo promedio"
              value={`${formatoMoneda(insumo.costoPromedio)} / ${unidadAbrev(insumo.idUnidadMedida)}`}
            />
          </Box>

          <LotesCard lotes={insumo.lotes} unidad={unidadAbrev(insumo.idUnidadMedida)} />
        </Box>

        <Box sx={panelSx}>
          <Typography sx={dimLabelSx}>Estado</Typography>
          <Box>
            <StatusBadge variant={estadoVisualVariant[estadoVisual]} dot>
              {estadoVisual}
            </StatusBadge>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
