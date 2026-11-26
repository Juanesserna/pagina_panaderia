import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Trash2, Shield, Lock } from 'lucide-react'
import {
  esRolSistema,
  esEliminable,
} from '../services/rolesService'

export default function DeleteRoleDialog({
  open,
  rol,
  onClose,
  onEliminar,
}) {
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const ejecutando = useRef(false)

  useEffect(() => {
    if (open) setErrorText('')
  }, [open, rol?.id])

  if (!rol) return null

  const predeterminado = esRolSistema(rol)
  const usuariosAsignados = rol.usuariosAsignados ?? 0
  const permitido = esEliminable(rol)

  const motivoBloqueo = predeterminado
    ? 'Los roles predeterminados del sistema no se pueden eliminar.'
    : usuariosAsignados > 0
      ? 'Este rol tiene usuarios asignados y no se puede eliminar.'
      : 'Este rol no cumple las condiciones para ser eliminado.'

  // Solo permite cerrar mediante el botón explícito.
  function handleCancel() {
    if (loading || ejecutando.current) return

    setErrorText('')
    onClose()
  }

  async function handleConfirm() {
    if (loading || ejecutando.current || !permitido) return

    ejecutando.current = true
    setLoading(true)
    setErrorText('')

    try {
      await onEliminar(rol.id)
      onClose()
    } catch (error) {
      setErrorText(
        error.message || 'No se pudo eliminar el rol.'
      )
    } finally {
      ejecutando.current = false
      setLoading(false)
    }
  }

  const Icono = permitido ? Trash2 : Lock

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="xs"
      fullWidth
      aria-labelledby="delete-role-title"
      aria-describedby="delete-role-description"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Encabezado */}
      <DialogTitle
        id="delete-role-title"
        sx={{ px: 3, pt: 3, pb: 1.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2,
              color: permitido
                ? 'error.main'
                : 'warning.main',
              bgcolor: theme =>
                alpha(
                  permitido
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
                  0.12
                ),
            }}
          >
            <Icono size={24} />
          </Box>

          <Box>
            <Typography fontWeight={700} fontSize={18}>
              {permitido
                ? '¿Deseas eliminar este rol?'
                : 'Eliminación no permitida'}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {permitido
                ? 'Esta acción es permanente.'
                : 'El rol está protegido por el sistema.'}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
        {/* Información del rol */}
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderTop: 3,
            borderTopColor: permitido
              ? 'error.main'
              : 'warning.main',
            borderRadius: 2,
            p: 1.5,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 1.5,
              bgcolor: 'action.hover',
              color: 'text.secondary',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Shield size={21} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              fontWeight={700}
              fontSize={14}
              sx={{ overflowWrap: 'anywhere' }}
            >
              {rol.nombre}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {predeterminado
                ? 'Rol predeterminado'
                : 'Rol personalizado'}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography fontSize={20} fontWeight={700}>
              {usuariosAsignados}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Usuarios asignados
            </Typography>
          </Box>
        </Box>

        <Typography
          id="delete-role-description"
          fontSize={13.5}
          sx={{ mb: 2 }}
        >
          {permitido
            ? '¿Estás seguro de que deseas eliminar este rol del sistema?'
            : motivoBloqueo}
        </Typography>

        {permitido && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ fontSize: 12.5 }}
          >
            Se eliminará el rol junto con sus asignaciones
            de privilegios. Esta acción no se puede deshacer.
          </Alert>
        )}

        {errorText && (
          <Alert
            severity="error"
            sx={{ mt: 1.5, fontSize: 12.5 }}
          >
            {errorText}
          </Alert>
        )}
      </DialogContent>

      {/* Acciones explícitas */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleCancel}
          disabled={loading}
          autoFocus
        >
          {permitido ? 'Cancelar' : 'Cerrar'}
        </Button>

        {permitido && (
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <Trash2 size={16} />
              )
            }
          >
            {loading ? 'Eliminando...' : 'Eliminar rol'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
