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
  MenuItem,
  Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TIPOS_DOCUMENTO } from '../services/clientesService'

const EMPTY_FORM = {
  nombre: '',
  tipoDocumento: 'Cédula de ciudadanía',
  documento: '',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'action.hover',
  },
}

function FieldLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        color: 'text.secondary',
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
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
  const isCreate = mode === 'create'

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!open) return

    setTouched({})
    setForm(
      initialData
        ? {
            nombre: initialData.nombre || '',
            tipoDocumento:
              initialData.tipoDocumento || 'Cédula de ciudadanía',
            documento: initialData.documento || '',
          }
        : { ...EMPTY_FORM }
    )
  }, [open, initialData])

  const esDocumentoPasaporte = form.tipoDocumento === 'Pasaporte'

  const validarNombre = (nombre) => {
    const limpio = nombre.trim()

    if (!limpio) return 'Ingresa el nombre del cliente.'

    if (limpio.length < 3 || limpio.length > 80) {
      return 'El nombre debe tener entre 3 y 80 caracteres.'
    }

    if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(limpio)) {
      return 'Usa solamente letras, espacios, apóstrofes o guiones.'
    }

    return ''
  }

  const validarDocumento = (documento) => {
    const limpio = documento.trim()

    if (!limpio) return 'Ingresa el número de documento.'

    if (esDocumentoPasaporte) {
      if (!/^[A-Z0-9]{5,15}$/i.test(limpio)) {
        return 'El pasaporte debe tener entre 5 y 15 caracteres alfanuméricos.'
      }
    } else if (!/^\d{5,15}$/.test(limpio)) {
      return 'El documento debe tener entre 5 y 15 números.'
    }

    return ''
  }

  const errors = {
    nombre: validarNombre(form.nombre),
    documento: validarDocumento(form.documento),
    tipoDocumento: TIPOS_DOCUMENTO.includes(form.tipoDocumento)
      ? ''
      : 'Selecciona un tipo de documento válido.',
  }

  const isValid = !Object.values(errors).some(Boolean)

  const marcarTocado = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Bloquea TAB y Shift + TAB si el campo actual es inválido.
  const manejarTab = (field) => (event) => {
    if (event.key !== 'Tab') return

    if (errors[field]) {
      event.preventDefault()
      marcarTocado(field)
    }
  }

  const cambiarNombre = (event) => {
    const valor = event.target.value
      .replace(/[^\p{L}\p{M} '\u2019-]/gu, '')
      .slice(0, 80)

    setForm((prev) => ({ ...prev, nombre: valor }))
  }

  const cambiarDocumento = (event) => {
    const valor = esDocumentoPasaporte
      ? event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
      : event.target.value.replace(/\D/g, '')

    setForm((prev) => ({
      ...prev,
      documento: valor.slice(0, 15),
    }))
  }

  const cambiarTipoDocumento = (event) => {
    const tipoDocumento = event.target.value
    const esPasaporte = tipoDocumento === 'Pasaporte'

    setForm((prev) => ({
      ...prev,
      tipoDocumento,
      documento: esPasaporte
        ? prev.documento.replace(/\D/g, '').toUpperCase()
        : prev.documento.replace(/\D/g, ''),
    }))

    marcarTocado('tipoDocumento')
    marcarTocado('documento')
  }

  const handleSubmit = () => {
  if (submitting) return

  setTouched({
    nombre: true,
    tipoDocumento: true,
    documento: true,
  })

  if (!isValid) {
    onError?.(
      'Completa los campos obligatorios y corrige los datos señalados.'
    )
    return
  }

  onSubmit({
    nombre: form.nombre.trim().replace(/\s+/g, ' '),
    tipoDocumento: form.tipoDocumento,
    documento: form.documento.trim(),
  })
}
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        onClose?.()
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box>
          <Typography fontWeight={700} fontSize={19}>
            {isCreate ? 'Registrar cliente' : 'Editar cliente'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isCreate
              ? 'Completa la información del cliente.'
              : 'Actualiza la información del cliente.'}
          </Typography>
        </Box>

        <IconButton onClick={onClose} disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: '1 / -1' }}>
            <FieldLabel>NOMBRE COMPLETO *</FieldLabel>
            <TextField
              fullWidth
              required
              size="small"
              placeholder="Nombre del cliente"
              value={form.nombre}
              onChange={cambiarNombre}
              onBlur={() => marcarTocado('nombre')}
              onKeyDown={manejarTab('nombre')}
              error={Boolean(touched.nombre && errors.nombre)}
              helperText={touched.nombre ? errors.nombre : ''}
              inputProps={{ maxLength: 80 }}
              sx={inputSx}
            />
          </Box>

          <Box>
            <FieldLabel>TIPO DE DOCUMENTO *</FieldLabel>
            <TextField
              select
              fullWidth
              required
              size="small"
              value={form.tipoDocumento}
              onChange={cambiarTipoDocumento}
              onBlur={() => marcarTocado('tipoDocumento')}
              onKeyDown={manejarTab('tipoDocumento')}
              error={Boolean(touched.tipoDocumento && errors.tipoDocumento)}
              helperText={touched.tipoDocumento ? errors.tipoDocumento : ''}
              sx={inputSx}
            >
              {TIPOS_DOCUMENTO.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <FieldLabel>NÚMERO DE DOCUMENTO *</FieldLabel>
            <TextField
              fullWidth
              required
              size="small"
              placeholder="Número de documento"
              value={form.documento}
              onChange={cambiarDocumento}
              onBlur={() => marcarTocado('documento')}
              onKeyDown={manejarTab('documento')}
              error={Boolean(touched.documento && errors.documento)}
              helperText={touched.documento ? errors.documento : ''}
              inputProps={{
                maxLength: 15,
                inputMode: esDocumentoPasaporte ? 'text' : 'numeric',
              }}
              sx={inputSx}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={submitting}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? 'Guardando...'
            : isCreate
              ? 'Registrar cliente'
              : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
