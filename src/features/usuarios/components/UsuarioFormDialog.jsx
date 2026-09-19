import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { BRAND } from '@shared/utils/colors'
import { ROLES, ESTADOS } from '../services/usuariosService'
import { Pencil } from 'lucide-react'

const EMPTY_FORM = {
  cedula: '',
  nombre: '',
  email: '',
  telefono: '',
  rol: '',
  estado: 'Activo',
  password: '',
  confirmPassword: '',
}

// Mismo criterio que en Roles y Ventas: un label fijo, chico y en mayúsculas
// ARRIBA del campo (en vez del label flotante de MUI, que en un grid de dos
// columnas quedaba tapado/recortado en el primer renglón y era ilegible en
// modo oscuro). Así el alto de cada campo es siempre el mismo y no depende
// de si el campo tiene o no contenido.
function FieldLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        color: 'text.secondary',
        textTransform: 'uppercase',
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  )
}

const inputSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'action.hover', borderRadius: 2 },
}

export default function UsuarioFormDialog({ open, mode, initialData, onClose, onSubmit, submitting }) {
  const isCreate = mode === 'create'
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Reinicia el formulario cada vez que el diálogo pasa de cerrado a abierto,
  // ajustando el estado durante el render (patrón recomendado por React) en
  // vez de en un useEffect, para evitar el render en cascada que marca la
  // regla react-hooks/set-state-in-effect.
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setForm(
        isCreate
          ? EMPTY_FORM
          : {
              cedula: initialData?.cedula ?? '',
              nombre: initialData?.nombre ?? '',
              email: initialData?.email ?? '',
              telefono: initialData?.telefono ?? '',
              rol: initialData?.rol ?? '',
              estado: initialData?.estado ?? 'Activo',
              password: '',
              confirmPassword: '',
            }
      )
      setTouched(false)
      setShowPassword(false)
    }
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // En creación TODOS los campos son obligatorios. En edición no bloqueamos
  // el guardado (a pedido explícito: "en editar no debería ser tan exigente").
  const isValid = isCreate
    ? form.cedula.trim() &&
      form.nombre.trim() &&
      form.email.trim() &&
      form.telefono.trim() &&
      form.rol &&
      form.estado &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword
    : true

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    const rest = { ...form }
    delete rest.password
    delete rest.confirmPassword
    onSubmit(rest)
  }

  const showError = (value) => touched && isCreate && !value

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            {isCreate ? 'Nuevo usuario' : 'Editar usuario'}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 400 }}>
            {isCreate ? 'Completa los datos del nuevo usuario' : 'Actualiza los datos del usuario'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={submitting} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <FieldLabel>NIT / Cédula</FieldLabel>
            <TextField
              value={form.cedula}
              onChange={set('cedula')}
              placeholder="Ej. 1234567890"
              error={showError(form.cedula.trim())}
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <FieldLabel>Nombre completo</FieldLabel>
            <TextField
              value={form.nombre}
              onChange={set('nombre')}
              placeholder="Ej. Ana Martínez"
              error={showError(form.nombre.trim())}
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <FieldLabel>Email</FieldLabel>
            <TextField
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="usuario@alhorno.mx"
              error={showError(form.email.trim())}
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <FieldLabel>Teléfono</FieldLabel>
            <TextField
              value={form.telefono}
              onChange={set('telefono')}
              placeholder="Ej. 3001234567"
              error={showError(form.telefono.trim())}
              fullWidth
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <FieldLabel>Rol</FieldLabel>
            <TextField
              select
              value={form.rol}
              onChange={set('rol')}
              error={showError(form.rol)}
              fullWidth
              sx={inputSx}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) =>
                    selected || <Box sx={{ color: 'text.disabled' }}>Seleccionar rol...</Box>,
                },
              }}
            >
              {ROLES.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  {rol}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <FieldLabel>{isCreate ? 'Estado inicial' : 'Estado'}</FieldLabel>
            <TextField select value={form.estado} onChange={set('estado')} fullWidth sx={inputSx}>
              {ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {isCreate && (
            <>
              <Box>
                <FieldLabel>Contraseña</FieldLabel>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Mínimo 6 caracteres"
                  error={touched && form.password.length < 6}
                  helperText={touched && form.password.length < 6 ? 'Mínimo 6 caracteres' : ''}
                  fullWidth
                  sx={inputSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setShowPassword((p) => !p)}>
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box>
                <FieldLabel>Confirmar contraseña</FieldLabel>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="Repetir contraseña"
                  error={touched && form.confirmPassword !== form.password}
                  helperText={touched && form.confirmPassword !== form.password ? 'Las contraseñas no coinciden' : ''}
                  fullWidth
                  sx={inputSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || (touched && isCreate && !isValid)}
          startIcon={isCreate ? <AddIcon /> :  <Pencil size={18} />}
          sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
        >
          {submitting ? 'Guardando...' : isCreate ? 'Crear usuario' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}