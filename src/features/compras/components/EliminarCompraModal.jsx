import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'

export function EliminarCompraModal({ open, compraId, onClose, onConfirmar }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar eliminación" size="sm" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          ¿Estás seguro de que deseas eliminar la orden{' '}
          <Typography component="span" variant="mono" sx={{ color: 'text.primary' }}>
            {compraId}
          </Typography>
          ? Esta acción no se puede deshacer.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirmar}>
            Eliminar permanentemente
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
