import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'

export default function EliminarOrdenModal({ ordenId, onClose, onConfirm }) {
  return (
    <Modal open={!!ordenId} onClose={onClose} title="Eliminar orden" size="sm" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          ¿Seguro que deseas eliminar la orden{' '}
          <Typography variant="mono" component="span" sx={{ color: 'text.primary' }}>
            {ordenId}
          </Typography>
          ? Esta acción no se puede deshacer.
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Eliminar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
