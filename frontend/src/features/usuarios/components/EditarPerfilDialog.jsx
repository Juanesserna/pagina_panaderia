import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { BRAND } from '@shared/utils/colors'

const EMPTY_FORM = { email: '', telefono: '' }

function FieldLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.5,
      color: 'text.secondary',
      textTransform: 'uppercase',
      mb: 0.5,
    }}>
      {children}
    </Typography>
  )
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'action.hover',
    borderRadius: 2,
  },
}

export default function EditarPerfilDialog({
  open,
  initialData,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setForm({
        email: initialData?.email ?? '',
        telefono: initialData?.telefono ?? '',
      })
      setTouched(false)
    }
  }

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())

  const telefonoValido =
    /^[0-9+\s()-]{7,15}$/.test(form.telefono.trim())

  const isValid = emailValido && telefonoValido

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onSubmit({
      email: form.email.trim(),
      telefono: form.telefono.trim(),
    })
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        pb: 0,
      }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Editar perfil
          </Typography>
          <Typography sx={{
            fontSize: 13,
            color: 'text.secondary',
          }}>
            Actualiza tus datos de contacto
          </Typography>
        </Box>

        <IconButton onClick={onClose} disabled={submitting} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        pt: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box>
          <FieldLabel>Correo electrónico</FieldLabel>
          <TextField
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="usuario@correo.com"
            error={touched && !emailValido}
            helperText={
              touched && !emailValido
                ? 'Ingresa un correo electrónico válido'
                : ''
            }
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlinedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
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
            error={touched && !telefonoValido}
            helperText={
              touched && !telefonoValido
                ? 'Ingresa un teléfono válido'
                : ''
            }
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={<EditOutlinedIcon />}
          sx={{
            bgcolor: BRAND.orange,
            '&:hover': { bgcolor: BRAND.orangeDark },
          }}
        >
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
