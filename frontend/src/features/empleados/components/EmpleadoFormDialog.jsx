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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import {
  UserPlus,
  Pencil,
  Clock3,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

import { TIPOS_DOCUMENTO } from '../services/empleadosService'

const EMPTY_FORM = {
  nombre: '',
  tipoDocumento: 'Cédula de ciudadanía',
  documento: '',
  telefono: '',
  horaEntrada: '',
  horaSalida: '',
}

const CAMPOS = Object.keys(EMPTY_FORM)
const FORMATO_HORA = /^(?:[01]\d|2[0-3]):[0-5]\d$/

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'background.alt',
    minHeight: 40,

    '& fieldset': {
      borderColor: 'divider',
      borderRadius: '8px',
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

  '& .MuiOutlinedInput-input': {
    background: 'transparent',
    boxShadow: 'none',
    border: 0,
  },

  '& input:-webkit-autofill': {
    WebkitBoxShadow: theme =>
      `0 0 0 100px ${theme.palette.background.alt} inset`,
    WebkitTextFillColor: theme =>
      theme.palette.text.primary,
  },

  '& .MuiFormHelperText-root': {
    fontSize: 11,
    mx: 0.5,
  },
}

// Obtener únicamente los datos editables.
function obtenerDatosEmpleado(empleado) {
  return Object.fromEntries(
    CAMPOS.map(campo => [
      campo,
      empleado?.[campo] ?? EMPTY_FORM[campo],
    ])
  )
}

function normalizarDatos(form) {
  return {
    ...form,
    nombre: form.nombre.trim().replace(/\s+/g, ' '),
    documento: form.tipoDocumento === 'Pasaporte'
      ? form.documento.trim().toUpperCase()
      : form.documento.trim(),
    telefono: form.telefono.trim(),
  }
}

// Validaciones coherentes con empleadosService.
function validarDatos(form) {
  const datos = normalizarDatos(form)
  const errores = {}

  CAMPOS.forEach(campo => {
    if (!datos[campo]) {
      errores[campo] = 'Este campo es obligatorio.'
    }
  })

  if (datos.nombre) {
    if (datos.nombre.length < 3 || datos.nombre.length > 80) {
      errores.nombre = 'El nombre debe tener entre 3 y 80 caracteres.'
    } else if (
      !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(datos.nombre)
    ) {
      errores.nombre = 'El nombre contiene caracteres no permitidos.'
    }
  }

  if (!TIPOS_DOCUMENTO.includes(datos.tipoDocumento)) {
    errores.tipoDocumento = 'Selecciona un tipo de documento válido.'
  }

  if (datos.documento) {
    if (datos.tipoDocumento === 'Pasaporte') {
      if (!/^[A-Z0-9]{5,15}$/i.test(datos.documento)) {
        errores.documento = 'Ingresa entre 5 y 15 caracteres alfanuméricos.'
      }
    } else if (!/^\d{5,15}$/.test(datos.documento)) {
      errores.documento = 'Ingresa entre 5 y 15 números.'
    }
  }

  if (datos.telefono && !/^3\d{9}$/.test(datos.telefono)) {
    errores.telefono = 'Ingresa un celular colombiano válido de 10 dígitos.'
  }

  for (const campo of ['horaEntrada', 'horaSalida']) {
    if (datos[campo] && !FORMATO_HORA.test(datos[campo])) {
      errores[campo] = 'Selecciona una hora válida.'
    }
  }

  if (
    datos.horaEntrada &&
    datos.horaSalida &&
    datos.horaEntrada === datos.horaSalida
  ) {
    errores.horaSalida = 'Debe ser diferente de la hora de entrada.'
  }

  return errores
}

// Etiqueta uniforme de los campos obligatorios.
function Campo({ label, id, children }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          color: 'text.secondary',
          mb: 0.5,
        }}
      >
        {label}{' '}
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      </Typography>

      {children}
    </Box>
  )
}

export default function EmpleadoFormDialog({
  open,
  empleado = null,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const inicial = useRef(EMPTY_FORM)
  const formulario = useRef(null)
  const enviando = useRef(false)

  const esEdicion = Boolean(empleado)
  const ocupado = submitting || guardando

  useEffect(() => {
    if (!open) return

    const datos = obtenerDatosEmpleado(empleado)

    inicial.current = datos
    setForm(datos)
    setTouched({})
    setConfirmacion(null)
  }, [open, empleado])

  const dirty =
    JSON.stringify(form) !== JSON.stringify(inicial.current)

  const cambiosValidos =
    JSON.stringify(normalizarDatos(form)) !==
    JSON.stringify(normalizarDatos(inicial.current))

  const errores = validarDatos(form)

  function marcarTocado(campo) {
    setTouched(prev => ({ ...prev, [campo]: true }))
  }

  function cambiarCampo(campo, valor) {
    let limpio = valor

    if (campo === 'nombre') {
      limpio = valor.replace(/[^\p{L}\p{M} '\u2019-]/gu, '').slice(0, 80)
    }

    if (campo === 'documento') {
      limpio = form.tipoDocumento === 'Pasaporte'
        ? valor.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 15)
        : valor.replace(/\D/g, '').slice(0, 15)
    }

    if (campo === 'telefono') {
      limpio = valor.replace(/\D/g, '').slice(0, 10)
    }

    if (campo === 'tipoDocumento') {
      setForm(prev => ({
        ...prev,
        tipoDocumento: valor,
        documento: valor === 'Pasaporte'
          ? prev.documento.toUpperCase()
          : /^\d*$/.test(prev.documento)
            ? prev.documento
            : '',
      }))

      marcarTocado(campo)
      return
    }

    setForm(prev => ({ ...prev, [campo]: limpio }))
  }

  // TAB y Shift + TAB no permiten omitir campos inválidos.
  function manejarTab(campo, event) {
    if (event.key !== 'Tab') return

    if (event.target.getAttribute('aria-expanded') === 'true') {
      return
    }

    if (errores[campo]) {
      event.preventDefault()
      event.stopPropagation()
      marcarTocado(campo)
    }
  }

  function propsCampo(campo) {
    return {
      id: `empleado-${campo}`,
      name: campo,
      fullWidth: true,
      size: 'small',
      required: true,
      disabled: ocupado,
      value: form[campo],
      error: Boolean(touched[campo] && errores[campo]),
      helperText: touched[campo] ? errores[campo] : '',
      onChange: e => cambiarCampo(campo, e.target.value),
      onBlur: () => marcarTocado(campo),
      onKeyDown: e => manejarTab(campo, e),
      sx: inputSx,
    }
  }

  function validarFormulario() {
    setTouched(
      Object.fromEntries(CAMPOS.map(campo => [campo, true]))
    )

    const primerError = CAMPOS.find(campo => errores[campo])

    if (!primerError) return true

    onError?.('Completa todos los campos y corrige los datos ingresados.')

    requestAnimationFrame(() => {
      const elemento = formulario.current?.querySelector(
        `#empleado-${primerError}`
      )

      elemento?.focus()
    })

    return false
  }

  async function guardar() {
    if (ocupado || enviando.current) return
    if (!validarFormulario()) return
    if (esEdicion && !cambiosValidos) return

    enviando.current = true
    setGuardando(true)

    try {
      await onSubmit(normalizarDatos(form))
    } catch (error) {
      onError?.(error.message || 'No se pudo guardar el empleado.')
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }

  function manejarSubmit(event) {
    event.preventDefault()

    if (ocupado || enviando.current) return
    if (!validarFormulario()) return

    if (esEdicion) {
      if (cambiosValidos) {
        setConfirmacion('guardar')
      }
      return
    }

    guardar()
  }

  function cancelar() {
    if (ocupado || enviando.current) return

    if (dirty) {
      setConfirmacion('salir')
    } else {
      onCancel()
    }
  }

  function restaurar() {
    setForm({ ...inicial.current })
    setTouched({})
  }

  function confirmarAccion() {
    const accion = confirmacion
    setConfirmacion(null)

    if (accion === 'salir') onCancel()
    if (accion === 'restaurar') restaurar()
    if (accion === 'guardar') guardar()
  }

  const confirmaciones = {
    salir: {
      titulo: '¿Deseas salir del formulario?',
      mensaje: 'Los cambios realizados no se guardarán.',
      boton: 'Salir sin guardar',
      color: 'warning',
    },
    restaurar: {
      titulo: esEdicion
        ? '¿Restaurar los datos originales?'
        : '¿Limpiar el formulario?',
      mensaje: 'Se descartarán los cambios realizados.',
      boton: esEdicion ? 'Restaurar' : 'Limpiar',
      color: 'warning',
    },
    guardar: {
      titulo: '¿Guardar los cambios?',
      mensaje: 'Se actualizará la información del empleado.',
      boton: 'Guardar cambios',
      color: 'primary',
    },
  }

  const actual = confirmaciones[confirmacion]
  const Icono = esEdicion ? Pencil : UserPlus

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') cancelar()
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="empleado-form-title"
        slotProps={{
          paper: { sx: { borderRadius: 3 } },
        }}
      >
        <Box
          component="form"
          ref={formulario}
          onSubmit={manejarSubmit}
          noValidate
        >
          <DialogTitle>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: 'action.hover',
                color: 'primary.main',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}>
                <Icono size={21} />
              </Box>

              <Box>
                <Typography
                  id="empleado-form-title"
                  sx={{ fontSize: 17, fontWeight: 700 }}
                >
                  {esEdicion ? 'Editar empleado' : 'Registrar empleado'}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Completa la información personal y laboral.
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={1.8}>
              <Campo
                label="Nombre completo"
                id="empleado-nombre"
              >
                <TextField
                  {...propsCampo('nombre')}
                  placeholder="Ej. Carlos Andrés Gómez"
                  slotProps={{
                    htmlInput: { maxLength: 80 },
                  }}
                />
              </Campo>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                },
                gap: 1.5,
              }}>
                <Campo
                  label="Tipo de documento"
                  id="empleado-tipoDocumento"
                >
                  <TextField
                    {...propsCampo('tipoDocumento')}
                    select
                  >
                    {TIPOS_DOCUMENTO.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Campo>

                <Campo
                  label="Número de documento"
                  id="empleado-documento"
                >
                  <TextField
                    {...propsCampo('documento')}
                    placeholder="Ingresa el documento"
                    slotProps={{
                      htmlInput: {
                        maxLength: 15,
                        inputMode: form.tipoDocumento === 'Pasaporte'
                          ? 'text'
                          : 'numeric',
                      },
                    }}
                  />
                </Campo>
              </Box>

              <Campo
                label="Teléfono celular"
                id="empleado-telefono"
              >
                <TextField
                  {...propsCampo('telefono')}
                  placeholder="Ej. 3001234567"
                  slotProps={{
                    htmlInput: {
                      maxLength: 10,
                      inputMode: 'numeric',
                    },
                  }}
                />
              </Campo>

              <Divider />

              {/* Horario laboral habitual. */}
              <Stack spacing={1.2}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Clock3 size={17} />

                  <Typography sx={{ fontWeight: 600 }}>
                    Horario laboral
                  </Typography>
                </Stack>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                  },
                  gap: 1.5,
                }}>
                  {[
                    ['horaEntrada', 'Hora de entrada'],
                    ['horaSalida', 'Hora de salida'],
                  ].map(([campo, label]) => (
                    <Campo
                      key={campo}
                      label={label}
                      id={`empleado-${campo}`}
                    >
                      <TextField
                        {...propsCampo(campo)}
                        type="time"
                        slotProps={{
                          htmlInput: { step: 60 },
                        }}
                      />
                    </Campo>
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Selecciona las horas habituales de trabajo del empleado.
                </Typography>
              </Stack>
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 2.5, py: 1.5 }}>
            <Button
              color="inherit"
              disabled={ocupado || !dirty}
              onClick={() => setConfirmacion('restaurar')}
              sx={{ mr: 'auto' }}
            >
              {esEdicion ? 'Restaurar' : 'Limpiar'}
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
              disabled={
                ocupado || (esEdicion && !cambiosValidos)
              }
              startIcon={
                ocupado
                  ? <CircularProgress size={15} color="inherit" />
                  : null
              }
            >
              {ocupado
                ? 'Guardando...'
                : esEdicion
                  ? 'Guardar cambios'
                  : 'Registrar empleado'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmaciones centralizadas del formulario. */}
      <Dialog
        open={open && Boolean(confirmacion)}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') {
            setConfirmacion(null)
          }
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: { sx: { borderRadius: 3 } },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <Box sx={{
              display: 'flex',
              color: confirmacion === 'guardar'
                ? 'success.main'
                : 'warning.main',
            }}>
              {confirmacion === 'guardar'
                ? <CheckCircle2 size={23} />
                : <AlertTriangle size={23} />}
            </Box>

            <Typography sx={{ fontWeight: 700 }}>
              {actual?.titulo}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {actual?.mensaje}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            onClick={() => setConfirmacion(null)}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color={actual?.color || 'primary'}
            onClick={confirmarAccion}
          >
            {actual?.boton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
