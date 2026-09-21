import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { BRAND } from '@shared/utils/colors'

export default function DeleteUserDialog({ open, usuario, esUnicoGerente, onClose, onInhabilitar }) {
  const [loadingAction, setLoadingAction] = useState(null)
  const [errorText, setErrorText] = useState('')

  if (!usuario) return null

  const bloqueado = esUnicoGerente(usuario)
  const estaActivo = usuario.estado === 'Activo'

  const handleClose = () => {
    if (loadingAction) return
    setErrorText('')
    onClose()
  }

  const run = async (action, fn) => {
    setLoadingAction(action)
    setErrorText('')
    try {
      await fn(usuario.id)
      setLoadingAction(null)
      onClose()
    } catch (err) {
      setLoadingAction(null)
      setErrorText(err.message || 'Ocurrió un error inesperado.')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {bloqueado ? 'Acción no permitida' : 'Eliminar / Inhabilitar usuario'}
      </DialogTitle>
      <DialogContent>
        {bloqueado ? (
          <Alert severity="warning" icon={<WarningAmberRoundedIcon />}>
            <strong>{usuario.nombre}</strong> es el único Gerente del sistema. No se puede
            eliminar ni inhabilitar porque el sistema debe tener al menos un Gerente activo.
          </Alert>
        ) : (
          <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
            <Typography sx={{ fontSize: 14, mb: 1 }}>
              ¿Qué deseas hacer con <strong>{usuario.nombre}</strong>?
            </Typography>
            <Typography sx={{ fontSize: 13 }}>
              • <strong>Inhabilitar</strong>: el usuario no podrá acceder al sistema, pero se
              conserva y puede reactivarse luego.
              <br />• <strong>Eliminar permanentemente</strong>: el usuario se borra del sistema y
              no puede deshacerse.
            </Typography>
          </Box>
        )}

        {errorText && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorText}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        {bloqueado ? (
          <Button onClick={handleClose} variant="contained" sx={{ bgcolor: BRAND.orange }}>
            Entendido
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={Boolean(loadingAction)}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: 'divider' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => run('inhabilitar', onInhabilitar)}
              disabled={Boolean(loadingAction)}
              variant="outlined"
              color="warning"
            >
              {loadingAction === 'inhabilitar'
                ? 'Procesando...'
                : errorText
                ? 'Reintentar'
                : estaActivo
                ? 'Inhabilitar'
                : 'Reactivar'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}