import { Stack, Typography } from '@mui/material'
import { Button, Modal } from '@shared/ui'

export default function EliminarCategoriaDialog({ open, onClose, onConfirm, nombreCategoria }) {
  return (
    <Modal open={open} onClose={onClose} title="Eliminar categoría" size="sm" showDivider>
      <Stack spacing={2.5}>
        <Typography variant="body1">
          ¿Seguro que deseas eliminar "{nombreCategoria}"? Esta acción no se puede deshacer.
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Eliminar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}