import { useEffect, useMemo, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, TextField, MenuItem, Button, IconButton,
  InputAdornment, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { TIPOS_DOCUMENTO } from '../services/empleadosService'

const EMPTY_FORM = {
  nombre: '',
  tipoDocumento: 'Cédula de ciudadanía',
  documento: '',
  telefono: '',
  horaEntrada: '',
  horaSalida: '',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'action.hover',
  },
}

function obtenerDatosEmpleado(empleado) {
  if (!empleado) return { ...EMPTY_FORM }
  return Object.fromEntries(
    Object.keys(EMPTY_FORM).map((campo) => [
      campo, empleado[campo] ?? EMPTY_FORM[campo],
    ])
  )
}

function normalizarFormulario(form) {
  return {
    ...form,
    nombre: form.nombre.trim().replace(/\s+/g, ' '),
    documento: form.tipoDocumento === 'Pasaporte'
      ? form.documento.trim().toUpperCase()
      : form.documento.trim(),
    telefono: form.telefono.trim(),
  }
}

function validarCampo(campo, valor, tipoDocumento) {
  const dato = String(valor ?? '').trim()
  if (!dato) return 'Este campo es obligatorio.'

  switch (campo) {
    case 'nombre':
      if (dato.length < 3 || dato.length > 80)
        return 'El nombre debe tener entre 3 y 80 caracteres.'
      if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(dato))
        return 'El nombre contiene caracteres no permitidos.'
      break
    case 'tipoDocumento':
      if (!TIPOS_DOCUMENTO.includes(dato))
        return 'Selecciona un tipo de documento válido.'
      break
    case 'documento':
      if (tipoDocumento === 'Pasaporte') {
        if (!/^[A-Z0-9]{5,15}$/i.test(dato))
          return 'El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos.'
      } else if (!/^\d{5,15}$/.test(dato)) {
        return 'El documento debe tener entre 5 y 15 números.'
      }
      break
    case 'telefono':
      if (!/^3\d{9}$/.test(dato))
        return 'Ingresa un número celular válido de 10 dígitos.'
      break
    case 'horaEntrada':
    case 'horaSalida':
      if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(dato))
        return 'Ingresa una hora válida.'
      break
    default:
      break
  }
  return ''
}

function FieldLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      color: 'text.secondary', mb: 0.5,
    }}>
      {children}
    </Typography>
  )
}

function convertirA12(hora) {
  if (!/^\d{2}:\d{2}$/.test(hora)) return ''
  const [h, m] = hora.split(':').map(Number)
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function convertirA24(hora12, periodo) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hora12)
  if (!match) return ''
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 1 || h > 12 || m > 59) return ''
  const hora24 = (h % 12) + (periodo === 'PM' ? 12 : 0)
  return `${String(hora24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function ajustarHora(hora, direccion) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora))
    return direccion > 0 ? '00:00' : '23:30'

  const [h, m] = hora.split(':').map(Number)
  const total = (h * 60 + m + direccion * 30 + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function SelectorHora({
  label, value, error, disabled, onChange, onBlur, onKeyDown,
}) {
  const [texto, setTexto] = useState('')
  const [editando, setEditando] = useState(false)

  const periodo = value && Number(value.slice(0, 2)) >= 12
    ? 'PM' : 'AM'

  useEffect(() => {
    if (!editando) {
      setTexto(convertirA12(value))
    }
  }, [value, editando])

  const cambiarTexto = (nuevo) => {
    const limpio = nuevo.replace(/[^\d:]/g, '').slice(0, 5)
    setTexto(limpio)
    setEditando(true)
    onChange(convertirA24(limpio, periodo))
  }

  const cambiarPeriodo = () => {
    const nuevo = periodo === 'AM' ? 'PM' : 'AM'
    const hora = convertirA24(texto, nuevo)
    if (hora) onChange(hora)
  }

  const mover = (direccion) => {
    const nuevaHora = ajustarHora(value, direccion)
    setEditando(false)
    setTexto(convertirA12(nuevaHora))
    onChange(nuevaHora)
  }

  return (
    <Box>
      <FieldLabel>{label}</FieldLabel>

      <TextField
        fullWidth
        size="small"
        required
        value={texto}
        placeholder="HH:mm"
        disabled={disabled}
        error={Boolean(error)}
        helperText={error}
        onChange={(e) => cambiarTexto(e.target.value)}
        onFocus={() => setEditando(true)}
        onBlur={() => {
          setEditando(false)
          onBlur()
        }}
        onKeyDown={onKeyDown}
        slotProps={{
          htmlInput: {
            maxLength: 5,
            inputMode: 'numeric',
            'aria-label': label,
          },
          input: {
            endAdornment: (
              <InputAdornment position="end" sx={{ ml: 0 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}>
                  <Button
                    type="button"
                    size="small"
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={cambiarPeriodo}
                    sx={{
                      minWidth: 40,
                      px: 0.3,
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    {periodo === 'AM' ? 'a. m.' : 'p. m.'}
                  </Button>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {[
                      { direccion: 1, Icon: ChevronUp },
                      { direccion: -1, Icon: ChevronDown },
                    ].map(({ direccion, Icon }) => (
                      <IconButton
                        key={direccion}
                        type="button"
                        size="small"
                        disabled={disabled}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => mover(direccion)}
                        sx={{
                          p: 0,
                          width: 18,
                          height: 17,
                          borderRadius: 0.5,
                        }}
                      >
                        <Icon size={13} />
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              </InputAdornment>
            ),
          },
        }}
        sx={inputSx}
      />
    </Box>
  )
}

export default function EmpleadoFormDialog({
  open, empleado = null, submitting = false,
  onSubmit, onCancel, onError, onDirtyChange,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [initialForm, setInitialForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const esEdicion = Boolean(empleado)

  useEffect(() => {
    if (!open) return
    const datos = obtenerDatosEmpleado(empleado)
    setForm(datos)
    setInitialForm(datos)
    setTouched({})
    onDirtyChange?.(false)
  }, [open, empleado, onDirtyChange])

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  )

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  const errors = Object.fromEntries(
    Object.keys(EMPTY_FORM).map((campo) => [
      campo, validarCampo(campo, form[campo], form.tipoDocumento),
    ])
  )

  if (form.horaEntrada && form.horaSalida &&
      form.horaEntrada === form.horaSalida) {
    errors.horaSalida = 'La hora de salida debe ser diferente de la entrada.'
  }

  const isValid = Object.values(errors).every((error) => !error)
  const marcarTocado = (campo) =>
    setTouched((prev) => ({ ...prev, [campo]: true }))

  const cambiarCampo = (campo, valor) => {
    let limpio = valor

    if (campo === 'nombre')
      limpio = valor.replace(/[^\p{L}\p{M} '\u2019-]/gu, '')

    if (campo === 'documento')
      limpio = form.tipoDocumento === 'Pasaporte'
        ? valor.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)
        : valor.replace(/\D/g, '').slice(0, 15)

    if (campo === 'telefono')
      limpio = valor.replace(/\D/g, '').slice(0, 10)

    if (campo === 'tipoDocumento') {
      const compatible = valor === 'Pasaporte'
        ? /^[a-zA-Z0-9]*$/.test(form.documento)
        : /^\d*$/.test(form.documento)

      setForm((prev) => ({
        ...prev,
        tipoDocumento: valor,
        documento: compatible ? prev.documento : '',
      }))
      marcarTocado('tipoDocumento')
      if (!compatible)
        setTouched((prev) => ({ ...prev, documento: false }))
      return
    }

    setForm((prev) => ({ ...prev, [campo]: limpio }))
  }

  const manejarTab = (campo) => (event) => {
    if (event.key !== 'Tab') return
    if (errors[campo]) {
      event.preventDefault()
      marcarTocado(campo)
    }
  }

  const manejarSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setTouched(Object.fromEntries(
      Object.keys(EMPTY_FORM).map((campo) => [campo, true])
    ))

    if (!isValid) {
      onError?.('Completa todos los campos y corrige los datos ingresados.')
      return
    }

    try {
      await onSubmit(normalizarFormulario(form))
    } catch {
      // La página principal gestiona la notificación.
    }
  }

  const campos = [
    { name: 'nombre', label: 'Nombre completo', placeholder: 'Ej. Carlos Andrés Gómez' },
    { name: 'tipoDocumento', label: 'Tipo de documento', select: true },
    { name: 'documento', label: 'Número de documento', placeholder: 'Ingresa el documento' },
    { name: 'telefono', label: 'Teléfono celular', placeholder: 'Ej. 3001234567' },
  ]

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <form onSubmit={manejarSubmit} noValidate>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700}>
            {esEdicion ? 'Editar empleado' : 'Registrar empleado'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa la información laboral del empleado.
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2, pt: 1,
          }}>
            {campos.map((campo) => (
              <Box key={campo.name}>
                <FieldLabel>{campo.label}</FieldLabel>
                <TextField
                  fullWidth size="small" required
                  name={campo.name}
                  placeholder={campo.placeholder}
                  value={form[campo.name]}
                  select={Boolean(campo.select)}
                  onChange={(e) => cambiarCampo(campo.name, e.target.value)}
                  onBlur={() => marcarTocado(campo.name)}
                  onKeyDown={manejarTab(campo.name)}
                  error={Boolean(touched[campo.name] && errors[campo.name])}
                  helperText={touched[campo.name] ? errors[campo.name] : ''}
                  disabled={submitting}
                  sx={inputSx}
                  slotProps={{
                    htmlInput: {
                      maxLength: campo.name === 'nombre' ? 80
                        : campo.name === 'telefono' ? 10
                        : campo.name === 'documento' ? 15 : undefined,
                      inputMode: campo.name === 'telefono' ||
                        (campo.name === 'documento' && form.tipoDocumento !== 'Pasaporte')
                        ? 'numeric' : undefined,
                    },
                  }}
                >
                  {campo.select && TIPOS_DOCUMENTO.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </TextField>
              </Box>
            ))}

            {['horaEntrada', 'horaSalida'].map((campo) => (
              <SelectorHora
                key={campo}
                label={campo === 'horaEntrada' ? 'Hora de entrada' : 'Hora de salida'}
                value={form[campo]}
                error={touched[campo] ? errors[campo] : ''}
                disabled={submitting}
                onChange={(valor) => {
                  cambiarCampo(campo, valor)
                  marcarTocado(campo)
                }}
                onBlur={() => marcarTocado(campo)}
                onKeyDown={manejarTab(campo)}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onCancel} disabled={submitting} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Guardando...'
              : esEdicion ? 'Guardar cambios' : 'Registrar empleado'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
