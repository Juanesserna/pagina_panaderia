import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  Pencil,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

const EMPTY_FORM = {
  email: '',
  telefono: '',
}

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

function normalizarDatos(data, esEmpleado) {
  return {
    email: String(data.email ?? '').trim().toLowerCase(),
    ...(esEmpleado && {
      telefono: String(data.telefono ?? '').trim(),
    }),
  }
}

function validarCampo(campo, valor) {
  const texto = String(valor ?? '').trim()

  if (!texto) {
    return 'Este campo es obligatorio.'
  }

  if (campo === 'email') {
    if (texto.length > 120) {
      return 'El correo no puede superar los 120 caracteres.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) {
      return 'Ingresa un correo electrónico válido.'
    }
  }

  if (campo === 'telefono' && !/^3\d{9}$/.test(texto)) {
    return 'Ingresa un celular válido de 10 dígitos.'
  }

  return ''
}

function Campo({ label, id, children }) {
  return (
    <Box>
      <Typography
        component="label"
        htmlFor={id}
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
          sx={{ color: 'error.main', ml: 0.5 }}
        >
          *
        </Box>
      </Typography>

      {children}
    </Box>
  )
}

export default function EditarPerfilDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  onError,
  submitting = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [tocados, setTocados] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const inicial = useRef(EMPTY_FORM)
  const enviando = useRef(false)

  const esEmpleado = initialData?.tipoPerfil === 'Empleado'
  const ocupado = submitting || guardando

  const campos = esEmpleado
    ? ['email', 'telefono']
    : ['email']

  // Recupera los datos actuales cada vez que se abre el formulario.
  useEffect(() => {
    if (!open) return

    const datos = {
      email: initialData?.email ?? '',
      telefono: initialData?.telefono ?? '',
    }

    inicial.current = datos

    setForm(datos)
    setTocados({})
    setConfirmacion(null)
  }, [open, initialData])

  const errores = Object.fromEntries(
    campos.map((campo) => [
      campo,
      validarCampo(campo, form[campo]),
    ])
  )

  const hayCambios =
    JSON.stringify(form) !== JSON.stringify(inicial.current)

  const hayCambiosValidos =
    JSON.stringify(normalizarDatos(form, esEmpleado)) !==
    JSON.stringify(
      normalizarDatos(inicial.current, esEmpleado)
    )

  const marcarCampo = (campo) => {
    setTocados((prev) => ({
      ...prev,
      [campo]: true,
    }))
  }

  const cambiarCampo = (campo) => (event) => {
    let valor = event.target.value

    if (campo === 'email') {
      valor = valor.replace(/\s/g, '').slice(0, 120)
    }

    if (campo === 'telefono') {
      valor = valor.replace(/\D/g, '').slice(0, 10)
    }

    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  // Evita avanzar con TAB o Shift + TAB si el campo es inválido.
  const manejarTab = (campo) => (event) => {
    if (event.key !== 'Tab') return

    marcarCampo(campo)

    if (errores[campo]) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const propsCampo = (campo) => ({
    id: `perfil-${campo}`,
    name: campo,
    value: form[campo],
    onChange: cambiarCampo(campo),
    onBlur: () => marcarCampo(campo),
    onKeyDown: manejarTab(campo),
    error: Boolean(tocados[campo] && errores[campo]),
    helperText: tocados[campo] ? errores[campo] : '',
    disabled: ocupado,
    fullWidth: true,
    required: true,
    size: 'small',
    sx: inputSx,
  })

  const validarFormulario = () => {
    setTocados(
      Object.fromEntries(
        campos.map((campo) => [campo, true])
      )
    )

    const primerError = campos.find(
      (campo) => errores[campo]
    )

    if (primerError) {
      onError?.('Revisa los campos obligatorios o inválidos.')

      requestAnimationFrame(() => {
        document
          .getElementById(`perfil-${primerError}`)
          ?.focus()
      })

      return false
    }

    return true
  }

  const guardar = async () => {
    if (
      ocupado ||
      enviando.current ||
      !hayCambiosValidos
    ) {
      return
    }

    if (!validarFormulario()) return

    enviando.current = true
    setGuardando(true)
    setConfirmacion(null)

    try {
      await onSubmit(
        normalizarDatos(form, esEmpleado)
      )
    } catch (error) {
      onError?.(
        error.message || 'No se pudo actualizar el perfil.'
      )
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }

  const manejarSubmit = (event) => {
    event.preventDefault()

    if (ocupado || !hayCambiosValidos) return
    if (!validarFormulario()) return

    setConfirmacion('guardar')
  }

  const cancelar = () => {
    if (ocupado) return

    if (hayCambios) {
      setConfirmacion('salir')
    } else {
      onClose()
    }
  }

  const restaurar = () => {
    setForm({ ...inicial.current })
    setTocados({})
    setConfirmacion(null)
  }

  const confirmarAccion = () => {
    if (ocupado) return

    if (confirmacion === 'guardar') {
      guardar()
      return
    }

    if (confirmacion === 'restaurar') {
      restaurar()
      return
    }

    if (confirmacion === 'salir') {
      setConfirmacion(null)
      onClose()
    }
  }

  const esGuardar = confirmacion === 'guardar'
  const esRestaurar = confirmacion === 'restaurar'

  const tituloConfirmacion = esGuardar
    ? '¿Guardar los cambios?'
    : esRestaurar
      ? '¿Restaurar los datos?'
      : '¿Salir sin guardar?'

  const descripcionConfirmacion = esGuardar
    ? 'Se actualizarán los datos de contacto de tu perfil.'
    : esRestaurar
      ? 'Se recuperarán los datos originales del formulario.'
      : 'Los cambios realizados se perderán.'

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') cancelar()
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="editar-perfil-titulo"
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
                <Pencil size={20} />
              </Box>

              <Box>
                <Typography
                  id="editar-perfil-titulo"
                  sx={{ fontSize: 17, fontWeight: 700 }}
                >
                  Editar perfil
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Actualiza tus datos de contacto.
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ py: 2.5 }}>
            <Stack spacing={2}>
              <Campo
                label="Correo electrónico"
                id="perfil-email"
              >
                <TextField
                  {...propsCampo('email')}
                  type="email"
                  placeholder="usuario@correo.com"
                  autoComplete="email"
                  slotProps={{
                    htmlInput: {
                      maxLength: 120,
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={17} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Campo>

              {esEmpleado && (
                <Campo
                  label="Teléfono"
                  id="perfil-telefono"
                >
                  <TextField
                    {...propsCampo('telefono')}
                    type="tel"
                    placeholder="Ej. 3001234567"
                    autoComplete="tel"
                    slotProps={{
                      htmlInput: {
                        inputMode: 'numeric',
                        maxLength: 10,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={17} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Campo>
              )}

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
              onClick={() => setConfirmacion('restaurar')}
              sx={{ mr: 'auto' }}
            >
              Restaurar
            </Button>

            <Button
              color="inherit"
              onClick={cancelar}
              disabled={ocupado}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={ocupado || !hayCambiosValidos}
              startIcon={
                ocupado
                  ? <CircularProgress size={15} color="inherit" />
                  : <Pencil size={15} />
              }
            >
              {ocupado ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmaciones de guardado, restauración y salida. */}
      <Dialog
        open={open && Boolean(confirmacion)}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown' && !ocupado) {
            setConfirmacion(null)
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="confirmar-perfil-titulo"
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
              id="confirmar-perfil-titulo"
              sx={{ fontSize: 16, fontWeight: 700 }}
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
            {esGuardar || esRestaurar
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
              : esRestaurar
                ? 'Restaurar'
                : 'Salir sin guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}