import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react'

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

const REGLAS = [
  {
    label: 'Mínimo 15 caracteres',
    validar: (valor) => [...valor].length >= 15,
  },
  {
    label: 'Máximo 72 bytes',
    validar: (valor) =>
      new TextEncoder().encode(valor).length <= 72,
  },
  {
    label: 'Una letra mayúscula',
    validar: (valor) => /\p{Lu}/u.test(valor),
  },
  {
    label: 'Una letra minúscula',
    validar: (valor) => /\p{Ll}/u.test(valor),
  },
  {
    label: 'Un número',
    validar: (valor) => /\d/.test(valor),
  },
  {
    label: 'Un carácter especial',
    validar: (valor) => /[\p{P}\p{S}]/u.test(valor),
  },
]

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'background.alt',
    borderRadius: '8px',
    minHeight: 40,

    '& fieldset': {
      borderColor: 'divider',
    },

    '&:hover fieldset': {
      borderColor: 'text.secondary',
    },

    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },

    '&.Mui-error fieldset': {
      borderColor: 'error.main',
    },
  },

  '& .MuiFormHelperText-root': {
    fontSize: 11,
    mx: 0,
  },

  '& input:-webkit-autofill': {
    WebkitBoxShadow: (theme) =>
      `0 0 0 100px ${theme.palette.background.alt} inset`,
    WebkitTextFillColor: (theme) =>
      theme.palette.text.primary,
  },
}

function validarCampo(campo, form) {
  const valor = form[campo]

  if (!valor.trim()) {
    return 'Este campo es obligatorio.'
  }

  if (campo === 'nueva') {
    if (valor === form.actual) {
      return 'La nueva contraseña debe ser diferente a la actual.'
    }

    if (!REGLAS.every((regla) => regla.validar(valor))) {
      return 'La contraseña no cumple todos los requisitos.'
    }
  }

  if (campo === 'confirmar' && valor !== form.nueva) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

// Requisitos de seguridad de la nueva contraseña.
function RequisitosPassword({ password }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        bgcolor: 'background.alt',
        p: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 11.5,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Requisitos de seguridad
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
          },
          gap: 0.75,
        }}
      >
        {REGLAS.map((regla) => {
          const cumple =
            Boolean(password) && regla.validar(password)

          const Icon = cumple ? CheckCircle2 : Circle

          return (
            <Stack
              key={regla.label}
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: 'center',
                color: cumple
                  ? 'success.main'
                  : 'text.secondary',
              }}
            >
              <Icon size={14} />

              <Typography
                sx={{
                  fontSize: 11,
                  color: 'inherit',
                }}
              >
                {regla.label}
              </Typography>
            </Stack>
          )
        })}
      </Box>
    </Box>
  )
}

export default function CambiarPasswordDialog({
  open,
  onClose,
  onSubmit,
  onError,
  submitting = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [mostrar, setMostrar] = useState(EMPTY_MOSTRAR)
  const [tocados, setTocados] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const enviando = useRef(false)

  const ocupado = submitting || guardando

  const hayCambios = Object.values(form).some(Boolean)

  const errores = Object.fromEntries(
    CAMPOS.map(({ id }) => [
      id,
      validarCampo(id, form),
    ])
  )

  // Limpia las contraseñas al abrir o cerrar el formulario.
  useEffect(() => {
    setForm({ ...EMPTY_FORM })
    setMostrar({ ...EMPTY_MOSTRAR })
    setTocados({})
    setConfirmacion(null)
  }, [open])

  const marcarCampo = (campo) => {
    setTocados((prev) => ({
      ...prev,
      [campo]: true,
    }))
  }

  const cambiarCampo = (campo) => (event) => {
    const valor = event.target.value

    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const toggleMostrar = (campo) => {
    setMostrar((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }))
  }

  const manejarTab = (campo) => (event) => {
    if (event.key !== 'Tab') return

    marcarCampo(campo)

    if (errores[campo]) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const validarFormulario = () => {
    setTocados(
      Object.fromEntries(
        CAMPOS.map(({ id }) => [id, true])
      )
    )

    const primerError = CAMPOS.find(
      ({ id }) => errores[id]
    )

    if (primerError) {
      onError?.('Revisa los campos y requisitos de seguridad.')

      requestAnimationFrame(() => {
        document
          .getElementById(`password-${primerError.id}`)
          ?.focus()
      })

      return false
    }

    return true
  }

  const guardar = async () => {
    if (ocupado || enviando.current) return
    if (!validarFormulario()) return

    enviando.current = true
    setGuardando(true)
    setConfirmacion(null)

    try {
      const resultado = await onSubmit({
        actual: form.actual,
        nueva: form.nueva,
      })

      if (resultado !== false) {
        setForm({ ...EMPTY_FORM })
        setMostrar({ ...EMPTY_MOSTRAR })
        setTocados({})
      }
    } catch (error) {
      onError?.(
        error.message || 'No se pudo cambiar la contraseña.'
      )
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }

  const manejarSubmit = (event) => {
    event.preventDefault()

    if (ocupado) return
    if (!validarFormulario()) return

    setMostrar({ ...EMPTY_MOSTRAR })
    setConfirmacion('guardar')
  }

  const cancelar = () => {
    if (ocupado) return

    if (hayCambios) {
      setMostrar({ ...EMPTY_MOSTRAR })
      setConfirmacion('salir')
    } else {
      onClose()
    }
  }

  const limpiar = () => {
    setForm({ ...EMPTY_FORM })
    setMostrar({ ...EMPTY_MOSTRAR })
    setTocados({})
    setConfirmacion(null)
  }

  const confirmarAccion = () => {
    if (ocupado) return

    if (confirmacion === 'guardar') {
      guardar()
      return
    }

    if (confirmacion === 'limpiar') {
      limpiar()
      return
    }

    if (confirmacion === 'salir') {
      limpiar()
      onClose()
    }
  }

  const esGuardar = confirmacion === 'guardar'
  const esLimpiar = confirmacion === 'limpiar'

  const tituloConfirmacion = esGuardar
    ? '¿Actualizar la contraseña?'
    : esLimpiar
      ? '¿Limpiar el formulario?'
      : '¿Salir sin guardar?'

  const descripcionConfirmacion = esGuardar
    ? 'Se realizará el cambio de contraseña en modo de prueba.'
    : esLimpiar
      ? 'Se eliminarán los datos ingresados en el formulario.'
      : 'Los datos ingresados se perderán.'

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') cancelar()
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="cambiar-password-titulo"
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={manejarSubmit}
        >
          <DialogTitle>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <KeyRound size={20} />
              </Box>

              <Box>
                <Typography
                  id="cambiar-password-titulo"
                  sx={{
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  Cambiar contraseña
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Actualiza la contraseña de tu cuenta.
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={1.5}>
              <Alert severity="info" sx={{ fontSize: 11.5 }}>
                Modo de prueba. No se modifican credenciales reales.
              </Alert>

              {CAMPOS.map(({ id, label }) => (
                <Box key={id}>
                  <Typography
                    component="label"
                    htmlFor={`password-${id}`}
                    sx={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      mb: 0.5,
                    }}
                  >
                    {label}

                    <Box
                      component="span"
                      sx={{
                        color: 'error.main',
                        ml: 0.5,
                      }}
                    >
                      *
                    </Box>
                  </Typography>

                  <TextField
                    id={`password-${id}`}
                    name={id}
                    fullWidth
                    required
                    size="small"
                    type={mostrar[id] ? 'text' : 'password'}
                    value={form[id]}
                    onChange={cambiarCampo(id)}
                    onBlur={() => marcarCampo(id)}
                    onKeyDown={manejarTab(id)}
                    placeholder={`Ingresa ${label.toLowerCase()}`}
                    error={Boolean(tocados[id] && errores[id])}
                    helperText={tocados[id] ? errores[id] : ''}
                    disabled={ocupado}
                    autoComplete={
                      id === 'actual'
                        ? 'current-password'
                        : 'new-password'
                    }
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockKeyhole size={17} />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              edge="end"
                              type="button"
                              disabled={ocupado}
                              onMouseDown={(event) =>
                                event.preventDefault()
                              }
                              onClick={() => toggleMostrar(id)}
                              aria-label={
                                mostrar[id]
                                  ? `Ocultar ${label.toLowerCase()}`
                                  : `Mostrar ${label.toLowerCase()}`
                              }
                              aria-pressed={mostrar[id]}
                            >
                              {mostrar[id]
                                ? <EyeOff size={17} />
                                : <Eye size={17} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {id === 'nueva' && (
                    <Box sx={{ mt: 1.25 }}>
                      <RequisitosPassword
                        password={form.nueva}
                      />
                    </Box>
                  )}
                </Box>
              ))}

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Los campos marcados con * son obligatorios.
              </Typography>
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 2.5, py: 2, gap: 0.5 }}>
            <Button
              color="inherit"
              disabled={ocupado || !hayCambios}
              onClick={() => setConfirmacion('limpiar')}
              sx={{ mr: 'auto' }}
            >
              Limpiar
            </Button>

            <Button
              color="inherit"
              disabled={ocupado}
              onClick={cancelar}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={ocupado}
              startIcon={
                ocupado
                  ? <CircularProgress size={15} color="inherit" />
                  : <KeyRound size={15} />
              }
            >
              {ocupado ? 'Guardando...' : 'Actualizar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmaciones del formulario. */}
      <Dialog
        open={open && Boolean(confirmacion)}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown' && !ocupado) {
            setConfirmacion(null)
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="confirmar-password-titulo"
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'action.hover',
                color: esGuardar
                  ? 'primary.main'
                  : 'warning.main',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {esGuardar
                ? <CheckCircle2 size={21} />
                : <AlertTriangle size={21} />}
            </Box>

            <Typography
              id="confirmar-password-titulo"
              sx={{
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {tituloConfirmacion}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {descripcionConfirmacion}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            disabled={ocupado}
            onClick={() => setConfirmacion(null)}
          >
            {esGuardar || esLimpiar
              ? 'Cancelar'
              : 'Seguir editando'}
          </Button>

          <Button
            variant="contained"
            color={esGuardar ? 'primary' : 'warning'}
            disabled={ocupado}
            onClick={confirmarAccion}
          >
            {esGuardar
              ? 'Confirmar'
              : esLimpiar
                ? 'Limpiar'
                : 'Salir sin guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}