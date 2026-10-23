import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconTrash } from '@tabler/icons-react'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVisualVariant } from '../constants/insumos.constants'
import { formatoCodigo } from '../utils/insumosHelpers'

export function EliminarInsumoDialog({ open, insumo, onClose, onConfirmar }) {
  return (
    <Modal open={open} onClose={onClose} title="Eliminar insumo" size="sm" showDivider>
      {insumo && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.5, py: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                mb: 1.5,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (t) => alpha(t.palette.error.main, 0.12),
                color: 'error.main',
              }}
            >
              <IconTrash size={26} />
            </Box>
            <Typography variant="subtitle1">¿Está seguro de eliminar este insumo?</Typography>
            <Typography variant="caption">Esta acción no se puede deshacer.</Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: 'primary.main' }}>
              {insumo.nombre} ({formatoCodigo(insumo.id)})
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirmar}>
              Confirmar eliminación
            </Button>
          </Stack>
        </Box>
      )}
    </Modal>
  )
}

export function CambiarEstadoInsumoDialog({ open, insumo, onClose, onCambiar }) {
  if (!insumo) return null
  const actual = insumo.estado ? 'Activo' : 'Inactivo'
  const nuevo = insumo.estado ? 'Inactivo' : 'Activo'

  return (
    <Modal open={open} onClose={onClose} title="Cambiar estado" size="sm" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1">
          Está a punto de cambiar el estado de <b>{insumo.nombre}</b> de {actual} a {nuevo}. ¿Desea continuar?
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
          <StatusBadge variant={estadoVisualVariant[actual]}>{actual}</StatusBadge>
          <Typography variant="caption">→</Typography>
          <StatusBadge variant={estadoVisualVariant[nuevo]}>{nuevo}</StatusBadge>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => onCambiar(!insumo.estado)}>
            Aceptar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
