import { Box, Stack, Typography, Alert, useTheme } from '@mui/material'
import { useState } from 'react'
import { alpha } from '@mui/material/styles'
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react'
import { Button, Input, Modal } from '@shared/ui'

// Segunda confirmación (HU-091): escribir el nombre del producto. Mecanismo pendiente de confirmar con el equipo.
const normalizarNombre = (texto) => (texto || '').trim().toLowerCase()

export default function EliminarProductoModal({
  open,
  onClose,
  onConfirm,
  nombreProducto,
}) {
  const theme = useTheme()
  const errorColor = theme.palette.error.main

  const [confirmacion, setConfirmacion] = useState('')
  const [eliminando, setEliminando] = useState(false)
  const [errorServidor, setErrorServidor] = useState(null)

  const coincide =
    normalizarNombre(confirmacion) === normalizarNombre(nombreProducto) &&
    normalizarNombre(nombreProducto) !== ''

  const handleConfirmar = async () => {
    if (!coincide || eliminando) return
    setEliminando(true)
    setErrorServidor(null)
    try {
      await onConfirm()
    } catch (err) {
      setErrorServidor(err?.message || 'No se pudo eliminar el producto')
      setEliminando(false)
    }
  }

  return (
    <Modal open={open} onClose={eliminando ? undefined : onClose} title="Eliminar producto" size="sm" showDivider>
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

        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          ¿Eliminar producto?
        </Typography>

        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Estás a punto de eliminar{' '}
          <Typography component="span" variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
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
          <Typography variant="body1" sx={{ color: errorColor }}>
            Este producto será eliminado permanentemente del sistema.
          </Typography>
        </Box>

        <Typography variant="body2">Para confirmar, escribe el nombre del producto:</Typography>
        <Input
          fullWidth
          placeholder={nombreProducto}
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          disabled={eliminando}
        />
        {errorServidor && <Alert severity="error">{errorServidor}</Alert>}
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 2 }}>
        <Button type="button" variant="secondary" onClick={onClose} disabled={eliminando}>
          Cancelar
        </Button>
        <Button type="button" variant="danger" onClick={handleConfirmar} disabled={!coincide || eliminando}>
          {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
        </Button>
      </Stack>
    </Modal>
  )
}
