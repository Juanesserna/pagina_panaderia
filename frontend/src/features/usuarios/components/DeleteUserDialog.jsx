import { useEffect, useRef, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material'

import {
  UserMinus,
  UserCheck,
  ShieldAlert,
  Info,
} from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import StatusChip from './StatusChip'

export default function DeleteUserDialog({
  open,
  usuario,
  esUnicoGerente,
  onClose,
  onInhabilitar,
}) {
  const [loadingAction, setLoadingAction] = useState(false)
  const [errorText, setErrorText] = useState('')
  const ejecutando = useRef(false)

  const estaActivo = usuario?.estado === 'Activo'

  const gerenteProtegido =
    Boolean(usuario) &&
    estaActivo &&
    esUnicoGerente(usuario)

  const rolNoDisponible =
    Boolean(usuario) &&
    !estaActivo &&
    usuario.estadoRol !== 'Activo'

  const bloqueado = gerenteProtegido || rolNoDisponible

  const nombre =
    usuario?.nombre?.trim() ||
    usuario?.email?.trim() ||
    `Usuario #${usuario?.id}`

  const accion = estaActivo ? 'Desactivar' : 'Activar'
  const color = bloqueado || estaActivo ? 'warning' : 'success'

  const Icono = bloqueado
    ? ShieldAlert
    : estaActivo
      ? UserMinus
      : UserCheck

  useEffect(() => {
    if (open) setErrorText('')
  }, [open, usuario?.id])

  function handleClose() {
    if (ejecutando.current) return

    setErrorText('')
    onClose?.()
  }

  async function confirmarCambio() {
    if (ejecutando.current || bloqueado || !usuario) return

    ejecutando.current = true
    setLoadingAction(true)
    setErrorText('')

    try {
      const resultado = await onInhabilitar(usuario.id)

      if (resultado === false) {
        setErrorText(
          'No se pudo completar la operación. Inténtalo nuevamente.'
        )
      }
    } catch (error) {
      setErrorText(
        error.message || 'Ocurrió un error inesperado.'
      )
    } finally {
      ejecutando.current = false
      setLoadingAction(false)
    }
  }

  if (!usuario) return null

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, py: 2 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center' }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2,
              bgcolor: 'action.hover',
              color: `${color}.main`,
            }}
          >
            <Icono size={23} />
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: 17, fontWeight: 700 }}
            >
              {bloqueado
                ? 'Acción no permitida'
                : `¿${accion} usuario?`}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: 'text.secondary',
              }}
            >
              Confirmación de cambio de estado
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, pb: 2 }}>
        <Stack spacing={2}>
          {/* Resumen de la cuenta seleccionada */}
          <Stack
            direction="row"
            spacing={1.2}
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <UserAvatar name={nombre} size={42} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {nombre}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                  overflowWrap: 'anywhere',
                }}
              >
                {usuario.email}
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                }}
              >
                {usuario.rol || 'Sin rol asignado'}
              </Typography>
            </Box>

            <StatusChip estado={usuario.estado} />
          </Stack>

          {bloqueado ? (
            <Alert severity="warning">
              {gerenteProtegido
                ? 'Debe existir al menos un Gerente activo en el sistema.'
                : 'No puedes activar esta cuenta mientras su rol esté inactivo o no esté disponible.'}
            </Alert>
          ) : (
            <>
              <Typography sx={{ fontSize: 14 }}>
                {estaActivo
                  ? 'Al desactivar esta cuenta, el usuario dejará de tener acceso al sistema.'
                  : 'Al activar esta cuenta, el usuario recuperará el acceso según los privilegios de su rol.'}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'flex-start',
                  color: 'text.secondary',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <Info size={16} />
                </Box>

                <Typography
                  sx={{ fontSize: 12, lineHeight: 1.5 }}
                >
                  {estaActivo
                    ? 'Sus datos y registros se conservarán. Podrás volver a activar la cuenta posteriormente.'
                    : 'Se conservarán sus datos, perfil asociado y registros existentes.'}
                </Typography>
              </Stack>
            </>
          )}

          {errorText && (
            <Alert severity="error">
              {errorText}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          pb: 2,
          gap: 0.5,
          flexWrap: 'wrap',
        }}
      >
        {bloqueado ? (
          <Button
            onClick={handleClose}
            variant="contained"
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
            >
              Cancelar
            </Button>

            <Button
              onClick={confirmarCambio}
              disabled={loadingAction}
              variant="contained"
              color={color}
              startIcon={
                loadingAction
                  ? <CircularProgress size={16} color="inherit" />
                  : undefined
              }
            >
              {loadingAction
                ? 'Procesando...'
                : errorText
                  ? 'Reintentar'
                  : `${accion} cuenta`}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
