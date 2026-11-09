
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Stack,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import { BRAND } from '@shared/utils/colors'
import { Button } from '@shared/components/Button'

const EMPTY_FORM = {
  actual: '',
  nueva: '',
  confirmar: '',
}

const EMPTY_MOSTRAR = {
  actual: false,
  nueva: false,
  confirmar: false,
}

const CAMPOS = [
  { id: 'actual', label: 'Contraseña actual' },
  { id: 'nueva', label: 'Nueva contraseña' },
  { id: 'confirmar', label: 'Confirmar nueva contraseña' },
]

function validarCampo(campo, form) {
  const valor = form[campo]

  if (!valor.trim()) {
    return 'Este campo es obligatorio'
  }

  if (campo === 'nueva') {
    if (valor.length < 6) {
      return 'La contraseña debe tener mínimo 6 caracteres'
    }

    if (valor === form.actual) {
      return 'La nueva contraseña debe ser diferente a la actual'
    }
  }

  if (campo === 'confirmar' && valor !== form.nueva) {
    return 'Las contraseñas no coinciden'
  }

  return ''
}

export default function CambiarPasswordDialog({
  open,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [mostrar, setMostrar] = useState(EMPTY_MOSTRAR)
  const [errores, setErrores] = useState({})
  const [intentandoGuardar, setIntentandoGuardar] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM })
      setMostrar({ ...EMPTY_MOSTRAR })
      setErrores({})
      setIntentandoGuardar(false)
    }
  }, [open])

  const handleChange = (campo) => (event) => {
    const valor = event.target.value
    const siguiente = { ...form, [campo]: valor }

    setForm(siguiente)

    setErrores((prev) => {
      const nuevos = { ...prev }

      if (Object.prototype.hasOwnProperty.call(prev, campo)) {
        nuevos[campo] = validarCampo(campo, siguiente)
      }

      // Actualizar errores dependientes cuando cambian
      // la contraseña actual o la nueva.
      if (campo === 'actual' && 'nueva' in prev) {
        nuevos.nueva = validarCampo('nueva', siguiente)
      }

      if (campo === 'nueva' && 'confirmar' in prev) {
        nuevos.confirmar = validarCampo('confirmar', siguiente)
      }

      return nuevos
    })
  }

  const validarUno = (campo) => {
    const error = validarCampo(campo, form)

    setErrores((prev) => ({
      ...prev,
      [campo]: error,
    }))

    return !error
  }

  const handleTab = (campo) => (event) => {
    if (event.key !== 'Tab') return

    if (!validarUno(campo)) {
      event.preventDefault()
    }
  }

  const toggleMostrar = (campo) => {
    setMostrar((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }))
  }

  const handleSubmit = () => {
    if (submitting || intentandoGuardar) return

    const nuevosErrores = Object.fromEntries(
      CAMPOS.map(({ id }) => [id, validarCampo(id, form)])
    )

    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some(Boolean)) return

    setIntentandoGuardar(true)

    Promise.resolve()
      .then(() =>
        onSubmit({
          actual: form.actual,
          nueva: form.nueva,
        })
      )
      .catch(() => {
        // El componente padre gestiona el mensaje de error.
      })
      .finally(() => {
        setIntentandoGuardar(false)
      })
  }

  const handleClose = (event, reason) => {
    if (submitting || intentandoGuardar) return

    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return
    }

    onClose()
  }

  const bloqueado = submitting || intentandoGuardar

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pb: 0,
        }}
      >
        <Box>
          <Typography fontWeight={700} fontSize={18}>
            Cambiar contraseña
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Actualiza la contraseña de tu cuenta.
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={bloqueado}
          size="small"
          aria-label="Cerrar formulario"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack spacing={2}>
          {CAMPOS.map(({ id, label }) => (
            <Box key={id}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  mb: 0.5,
                }}
              >
                {label.toUpperCase()}
              </Typography>

              <TextField
                fullWidth
                size="small"
                type={mostrar[id] ? 'text' : 'password'}
                value={form[id]}
                onChange={handleChange(id)}
                onBlur={() => validarUno(id)}
                onKeyDown={handleTab(id)}
                placeholder={`Ingresa ${label.toLowerCase()}`}
                error={Boolean(errores[id])}
                helperText={errores[id] || ''}
                disabled={bloqueado}
                autoComplete={
                  id === 'actual'
                    ? 'current-password'
                    : 'new-password'
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary' }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => toggleMostrar(id)}
                          disabled={bloqueado}
                          aria-label={
                            mostrar[id]
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                        >
                          {mostrar[id] ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={bloqueado}
          color="inherit"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={bloqueado}
          sx={{
            bgcolor: BRAND.orange,
            '&:hover': {
              bgcolor: BRAND.orangeDark,
            },
          }}
        >
          {bloqueado ? 'Guardando...' : 'Actualizar contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
