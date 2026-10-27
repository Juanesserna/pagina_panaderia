import {
  Box,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'
// Botón y modal estándar del panel
import { Button, Modal } from '@shared/ui'

export default function EliminarProductoModal({
  open,
  onClose,
  onConfirm,
  nombreProducto,
}) {
  const theme = useTheme()
  const errorColor = theme.palette.error.main

  return (
    <Modal open={open} onClose={onClose} title="Eliminar producto" size="sm" showDivider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            px: 3,
            pt: 3,
            pb: 3,
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: alpha(errorColor, 0.12),
            }}
          >
            <IconTrash size={26} color={errorColor} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            ¿Eliminar producto?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Estás a punto de eliminar{' '}
            <Typography
              component="span"
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              {nombreProducto}
            </Typography>
            . Esta acción no se puede deshacer.
          </Typography>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(errorColor, 0.08),
              border: 1,
              borderColor: alpha(errorColor, 0.25),
              color: errorColor,
            }}
          >
            <IconAlertTriangle size={18} color={errorColor} />
            <Typography
              variant="body1"
              sx={{
                color: errorColor,
              }}
            >
              Este producto será eliminado permanentemente del sistema.
            </Typography>
          </Box>
        </Box>
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 2 }}>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm}>
          Sí, eliminar
        </Button>
      </Stack>
    </Modal>
  )
}