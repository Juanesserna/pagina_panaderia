import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, MenuItem,
  Stack, TextField, Typography,
} from '@mui/material'

import {
  UserPlus, Pencil, AlertTriangle, CheckCircle2,
} from 'lucide-react'

import { TIPOS_DOCUMENTO } from '../services/clientesService'

const EMPTY_FORM = {
  nombre: '',
  tipoDocumento: 'Cédula de ciudadanía',
  documento: '',
}

const CAMPOS = Object.keys(EMPTY_FORM)

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'background.alt',
    minHeight: 40,
    boxShadow: 'none',

    '& fieldset': {
      borderRadius: '8px',
      borderColor: 'divider',
    },
    '&:hover fieldset': {
      borderColor: 'text.secondary',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: 1,
    },
    '&.Mui-error fieldset': {
      borderColor: 'error.main',
    },
    '&.Mui-disabled fieldset': {
      borderColor: 'divider',
    },
  },

  '& .MuiInputBase-input': {
    borderRadius: '8px',
    bgcolor: 'transparent',
    border: 0,
    boxShadow: 'none',
  },

  '& input:-webkit-autofill': {
    WebkitBoxShadow: theme =>
      `0 0 0 100px ${theme.palette.background.alt} inset`,
    WebkitTextFillColor: theme =>
      theme.palette.text.primary,
  },

  '& .MuiFormHelperText-root': {
    mx: 0.5,
    mt: 0.5,
    fontSize: 11,
  },
}

// Normalización consistente con el servicio.
function normalizarDatos(form) {
  return {
    nombre: form.nombre.trim().replace(/\s+/g, ' '),
    tipoDocumento: form.tipoDocumento,
    documento: form.tipoDocumento === 'Pasaporte'
      ? form.documento.trim().toUpperCase()
      : form.documento.trim(),
  }
}

function validarDatos(form) {
  const { nombre, tipoDocumento, documento } =
    normalizarDatos(form)

  return {
    nombre: !nombre
      ? 'Ingresa el nombre del cliente.'
      : nombre.length < 3 || nombre.length > 80
        ? 'El nombre debe tener entre 3 y 80 caracteres.'
        : !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(nombre)
          ? 'Usa solamente letras, espacios, apóstrofes o guiones.'
          : '',

    tipoDocumento: TIPOS_DOCUMENTO.includes(tipoDocumento)
      ? ''
      : 'Selecciona un tipo de documento válido.',

    documento: !documento
      ? 'Ingresa el número de documento.'
      : tipoDocumento === 'Pasaporte'
        ? !/^[A-Z0-9]{5,15}$/.test(documento)
          ? 'El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos.'
          : ''
        : !/^\d{5,15}$/.test(documento)
          ? 'El documento debe tener entre 5 y 15 números.'
          : '',
  }
}

function Encabezado({
  icon: Icon,
  titulo,
  descripcion,
  color = 'primary.main',
}) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 2,
        bgcolor: 'action.hover',
        color,
      }}>
        <Icon size={22} />
      </Box>

      <Box>
        <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
          {titulo}
        </Typography>

        {descripcion && (
          <Typography variant="body2">
            {descripcion}
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

function Campo({ nombre, etiqueta, children }) {
  return (
    <Box data-campo={nombre} sx={{ minWidth: 0 }}>
      <Typography
        id={`cliente-${nombre}-label`}
        component="div"
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}
      >
        {etiqueta}

        <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
          *
        </Box>
      </Typography>

      {children}
    </Box>
  )
}

export default function ClienteFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  onError,
  submitting = false,
}) {
  const esCreacion = mode === 'create'

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [confirmacion, setConfirmacion] = useState(null)

  const inicial = useRef(EMPTY_FORM)
  const enviando = useRef(false)
  const formularioRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const valores = initialData
      ? {
          nombre: initialData.nombre ?? '',
          tipoDocumento:
            initialData.tipoDocumento ?? EMPTY_FORM.tipoDocumento,
          documento: initialData.documento ?? '',
        }
      : { ...EMPTY_FORM }

    inicial.current = valores
    setForm(valores)
    setTouched({})
    setConfirmacion(null)
  }, [open, initialData, mode])

  const errores = validarDatos(form)
  const esPasaporte = form.tipoDocumento === 'Pasaporte'

  const hayCambios =
    JSON.stringify(form) !== JSON.stringify(inicial.current)

  const hayCambiosValidos =
    JSON.stringify(normalizarDatos(form)) !==
    JSON.stringify(normalizarDatos(inicial.current))

  function cambiar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  function marcar(campo) {
    setTouched(prev => ({ ...prev, [campo]: true }))
  }

  function cambiarNombre(event) {
    cambiar(
      'nombre',
      event.target.value
        .replace(/[^\p{L}\p{M} '\u2019-]/gu, '')
        .slice(0, 80)
    )
  }

  function cambiarDocumento(event) {
    const valor = esPasaporte
      ? event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
      : event.target.value.replace(/\D/g, '')

    cambiar('documento', valor.slice(0, 15))
  }

  function cambiarTipoDocumento(event) {
    const tipoDocumento = event.target.value

    setForm(prev => ({
      ...prev,
      tipoDocumento,
      documento: tipoDocumento === 'Pasaporte'
        ? prev.documento.toUpperCase()
        : prev.documento.replace(/\D/g, ''),
    }))

    marcar('tipoDocumento')

    if (form.documento) marcar('documento')
  }

  // Validar TAB y Shift + TAB sin interferir con menús abiertos.
  function validarTab(event, campo) {
    if (event.key !== 'Tab' || submitting) return
    if (event.target.getAttribute('aria-expanded') === 'true') return

    marcar(campo)

    if (errores[campo]) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function propsCampo(campo) {
    const mensaje = touched[campo] ? errores[campo] : ''

    return {
      name: campo,
      fullWidth: true,
      required: true,
      size: 'small',
      disabled: submitting,
      error: Boolean(mensaje),
      helperText: mensaje,
      onBlur: () => marcar(campo),
      onKeyDown: event => validarTab(event, campo),
      sx: inputSx,
    }
  }

  function validarFormulario() {
    setTouched(Object.fromEntries(CAMPOS.map(campo => [campo, true])))

    const primerError = CAMPOS.find(campo => errores[campo])

    if (!primerError) return true

    onError?.(
      'Completa los campos obligatorios y corrige los datos señalados.'
    )

    requestAnimationFrame(() => {
      formularioRef.current
        ?.querySelector(`[data-campo="${primerError}"]`)
        ?.querySelector('[role="combobox"], input:not([type="hidden"])')
        ?.focus()
    })

    return false
  }

  async function guardar() {
    if (submitting || enviando.current) return
    if (!esCreacion && !hayCambiosValidos) return
    if (!validarFormulario()) return

    enviando.current = true
    setConfirmacion(null)

    try {
      await onSubmit(normalizarDatos(form))
    } catch (error) {
      onError?.(error.message || 'No se pudo guardar el cliente.')
    } finally {
      enviando.current = false
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (submitting || enviando.current) return
    if (!esCreacion && !hayCambiosValidos) return
    if (!validarFormulario()) return

    if (esCreacion) guardar()
    else setConfirmacion('guardar')
  }

  function cancelar() {
    if (submitting || enviando.current) return

    if (hayCambios) setConfirmacion('salir')
    else onClose?.()
  }

  function confirmarAccion() {
    const accion = confirmacion
    setConfirmacion(null)

    if (accion === 'salir') {
      onClose?.()
    } else if (accion === 'restaurar') {
      setForm({ ...inicial.current })
      setTouched({})
    } else if (accion === 'guardar') {
      guardar()
    }
  }

  const textos = {
    salir: {
      titulo: '¿Deseas abandonar el formulario?',
      mensaje: 'Perderás los cambios que no hayas guardado.',
      boton: 'Salir del formulario',
    },
    restaurar: {
      titulo: esCreacion
        ? '¿Limpiar formulario?'
        : '¿Restaurar los datos?',
      mensaje: esCreacion
        ? 'Se eliminarán los datos ingresados.'
        : 'Se recuperarán los valores originales del cliente.',
      boton: esCreacion ? 'Limpiar' : 'Restaurar',
    },
    guardar: {
      titulo: '¿Guardar los cambios?',
      mensaje: 'Se actualizará la información del cliente.',
      boton: 'Guardar cambios',
    },
  }

  const texto = textos[confirmacion]
  const esAdvertencia = confirmacion !== 'guardar'

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown' && !confirmacion) cancelar()
        }}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <Box
          component="form"
          ref={formularioRef}
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <DialogTitle>
            <Encabezado
              icon={esCreacion ? UserPlus : Pencil}
              titulo={esCreacion ? 'Registrar cliente' : 'Editar cliente'}
              descripcion={esCreacion
                ? 'Completa la información del cliente.'
                : 'Actualiza la información del cliente.'}
            />
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="overline">
                Información personal
              </Typography>

              <Campo nombre="nombre" etiqueta="Nombre completo">
                <TextField
                  {...propsCampo('nombre')}
                  placeholder="Nombre del cliente"
                  value={form.nombre}
                  onChange={cambiarNombre}
                  slotProps={{
                    htmlInput: {
                      maxLength: 80,
                      'aria-labelledby': 'cliente-nombre-label',
                    },
                  }}
                />
              </Campo>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}>
                <Campo nombre="tipoDocumento" etiqueta="Tipo de documento">
                  <TextField
                    {...propsCampo('tipoDocumento')}
                    select
                    value={form.tipoDocumento}
                    onChange={cambiarTipoDocumento}
                    slotProps={{
                      select: {
                        SelectDisplayProps: {
                          'aria-labelledby': 'cliente-tipoDocumento-label',
                          'aria-required': true,
                        },
                      },
                    }}
                  >
                    {TIPOS_DOCUMENTO.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Campo>

                <Campo nombre="documento" etiqueta="Número de documento">
                  <TextField
                    {...propsCampo('documento')}
                    placeholder="Número de documento"
                    value={form.documento}
                    onChange={cambiarDocumento}
                    slotProps={{
                      htmlInput: {
                        maxLength: 15,
                        inputMode: esPasaporte ? 'text' : 'numeric',
                        'aria-labelledby': 'cliente-documento-label',
                      },
                    }}
                  />
                </Campo>
              </Box>
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 2.5, py: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Button
              color="inherit"
              disabled={submitting || !hayCambios}
              onClick={() => setConfirmacion('restaurar')}
              sx={{ mr: 'auto' }}
            >
              {esCreacion ? 'Limpiar' : 'Restaurar'}
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={cancelar}
              disabled={submitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting || (!esCreacion && !hayCambiosValidos)}
              startIcon={submitting
                ? <CircularProgress size={16} color="inherit" />
                : undefined}
            >
              {submitting
                ? 'Guardando...'
                : esCreacion
                  ? 'Registrar cliente'
                  : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmación compartida para las acciones del formulario. */}
      <Dialog
        open={Boolean(confirmacion)}
        onClose={(_, reason) => {
          if (reason === 'escapeKeyDown') setConfirmacion(null)
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle>
          <Encabezado
            icon={esAdvertencia ? AlertTriangle : CheckCircle2}
            titulo={texto?.titulo}
            color={esAdvertencia ? 'warning.main' : 'primary.main'}
          />
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            {texto?.mensaje}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setConfirmacion(null)}
            autoFocus
          >
            {esAdvertencia ? 'Permanecer aquí' : 'Cancelar'}
          </Button>

          <Button
            variant="contained"
            color={esAdvertencia ? 'warning' : 'primary'}
            onClick={confirmarAccion}
          >
            {texto?.boton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
