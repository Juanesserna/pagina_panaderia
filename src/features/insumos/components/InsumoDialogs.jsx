import { Box, Stack, Typography } from '@mui/material'
import { Modal } from '@features/produccion/components/Modal'
import { Button } from '@features/produccion/components/Button'
import { StatusBadge } from '@features/produccion/components/StatusBadge'
import { formatoCodigo, getEstadoVisual, estadoVisualVariant } from '../utils/insumosHelpers'

export function EliminarInsumoDialog({ open, insumo, onClose, onConfirmar }) {
  return (
    <Modal open={open} onClose={onClose} title="Eliminar insumo" size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
          ¿Seguro que deseas eliminar{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {insumo?.nombre}
          </Box>{' '}
          <Box component="span" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
            ({insumo ? formatoCodigo(insumo.id) : ''})
          </Box>
          ? Esta acción no se puede deshacer.
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirmar}>
            Eliminar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export function CambiarEstadoInsumoDialog({ open, insumo, onClose, onCambiar }) {
  if (!insumo) return null
  const ev = getEstadoVisual(insumo)

  return (
    <Modal open={open} onClose={onClose} title="Cambiar estado" size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ borderRadius: 1.5, px: 1.5, py: 1.25, bgcolor: 'background.alt' }}>
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Estado actual</Typography>
          <StatusBadge variant={estadoVisualVariant[ev]} dot>
            {ev}
          </StatusBadge>
        </Stack>
        <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
          Se cambiará <strong>{insumo.nombre}</strong> a {insumo.estado ? 'Inactivo' : 'Activo'}.
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => onCambiar(!insumo.estado)}>
            Cambiar a {insumo.estado ? 'Inactivo' : 'Activo'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
