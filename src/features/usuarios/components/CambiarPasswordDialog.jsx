import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { BRAND } from '@shared/utils/colors'

const EMPTY_FORM = { actual: '', nueva: '', confirmar: '' }

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

export default function CambiarPasswordDialog({ open, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Mismo patrón que UsuarioFormDialog: reinicia el formulario al abrir,
  // ajustando el estado durante el render en vez de con useEffect.
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setForm(EMPTY_FORM)
      setTouched(false)
      setShowPassword(false)
    }
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const isValid =
    form.actual.trim().length > 0 &&
    form.nueva.length >= 6 &&
    form.nueva === form.confirmar

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onSubmit({ actual: form.actual, nueva: form.nueva })
  }

  const passwordField = (label, field, placeholder) => (
    <Box>
      <FieldLabel>{label}</FieldLabel>
      <TextField
        type={showPassword ? 'text' : 'password'}
        value={form[field]}
        onChange={set(field)}
        placeholder={placeholder}
        error={
          touched &&
          ((field === 'nueva' && form.nueva.length < 6) ||
            (field === 'confirmar' && form.confirmar !== form.nueva) ||
            (field === 'actual' && !form.actual.trim()))
        }
        helperText={
          touched && field === 'nueva' && form.nueva.length < 6
            ? 'Mínimo 6 caracteres'
            : touched && field === 'confirmar' && form.confirmar !== form.nueva
            ? 'Las contraseñas no coinciden'
            : ''
        }
        fullWidth
        sx={inputSx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment:
              field === 'actual' ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ) : undefined,
          },
        }}
      />
    </Box>
  )

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 0 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Cambiar contraseña</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 400 }}>
            Actualiza la contraseña de tu cuenta
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={submitting} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {passwordField('Contraseña actual', 'actual', 'Ingresa tu contraseña actual')}
        {passwordField('Nueva contraseña', 'nueva', 'Mínimo 6 caracteres')}
        {passwordField('Confirmar nueva contraseña', 'confirmar', 'Repetir nueva contraseña')}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || (touched && !isValid)}
          sx={{ bgcolor: BRAND.orange, '&:hover': { bgcolor: BRAND.orangeDark } }}
        >
          {submitting ? 'Guardando...' : 'Guardar nueva contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}