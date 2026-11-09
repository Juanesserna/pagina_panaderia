import { useEffect, useState } from 'react'

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

export default function DeleteUserDialog({
  open,
  usuario,
  esUnicoGerente,
  onClose,
  onInhabilitar,
}) {
  const [loadingAction, setLoadingAction] = useState(false)
  const [errorText, setErrorText] = useState('')

  const estaActivo = usuario?.estado === 'Activo'
  const bloqueado =
    Boolean(usuario) && estaActivo && esUnicoGerente(usuario)

  const nombreUsuario =
    usuario?.nombre?.trim() || `Usuario #${usuario?.id}`

  useEffect(() => {
    if (open) {
      setErrorText('')
      setLoadingAction(false)
    }
  }, [open, usuario?.id])

  const handleClose = (event, reason) => {
    if (
      loadingAction ||
      reason === 'backdropClick' ||
      reason === 'escapeKeyDown'
    ) {
      return
    }

    setErrorText('')
    onClose?.()
  }

  const run = async () => {
    if (loadingAction || bloqueado || !usuario) return

    setLoadingAction(true)
    setErrorText('')

    try {
      const resultado = await onInhabilitar(usuario.id)

      if (resultado === false) {
        setErrorText(
          'No se pudo completar el cambio de estado. Puedes intentarlo nuevamente.'
        )
        return
      }

      setErrorText('')
      onClose?.()
    } catch (error) {
      setErrorText(
        error.message || 'Ocurrió un error inesperado.'
      )
    } finally {
      setLoadingAction(false)
    }
  }

  if (!usuario) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {bloqueado
          ? 'Acción no permitida'
          : estaActivo
            ? 'Inhabilitar usuario'
            : 'Reactivar usuario'}
      </DialogTitle>

      <DialogContent>
        {bloqueado ? (
          <Alert
            severity="warning"
            icon={<WarningAmberRoundedIcon />}
          >
            <strong>{nombreUsuario}</strong> es el único Gerente activo
            del sistema. No se puede inhabilitar porque debe existir
            al menos un Gerente activo.
          </Alert>
        ) : (
          <Box sx={{ color: 'text.secondary' }}>
            <Typography sx={{ fontSize: 14, mb: 1 }}>
              {estaActivo ? (
                <>
                  ¿Deseas inhabilitar la cuenta de{' '}
                  <strong>{nombreUsuario}</strong>?
                </>
              ) : (
                <>
                  ¿Deseas reactivar la cuenta de{' '}
                  <strong>{nombreUsuario}</strong>?
                </>
              )}
            </Typography>

            <Typography sx={{ fontSize: 13 }}>
              {estaActivo
                ? 'El usuario perderá el acceso al sistema, pero su cuenta y sus registros se conservarán. Podrá reactivarse posteriormente.'
                : 'El usuario recuperará el acceso al sistema según los privilegios de su rol asignado.'}
            </Typography>
          </Box>
        )}

        {errorText && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorText}
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {bloqueado ? (
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ bgcolor: BRAND.orange }}
          >
            Entendido
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={loadingAction}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: 'divider' }}
            >
              Cancelar
            </Button>

            <Button
              onClick={run}
              disabled={loadingAction}
              variant="outlined"
              color={estaActivo ? 'warning' : 'success'}
            >
              {loadingAction
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