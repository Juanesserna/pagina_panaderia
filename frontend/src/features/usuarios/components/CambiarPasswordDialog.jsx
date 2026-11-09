
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

export default function CambiarPasswordDialog({
  open,
  onClose,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [mostrar, setMostrar] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  })
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setMostrar({
        actual: false,
        nueva: false,
        confirmar: false,
      })
      setTouched(false)
    }
  }, [open])

  const handleChange = (campo) => (event) => {
    setForm((prev) => ({
      ...prev,
      [campo]: event.target.value,
    }))
  }

  const toggleMostrar = (campo) => {
    setMostrar((prev) => ({
      ...prev,
      [campo]: !prev[campo],
    }))
  }

  const isValid =
    form.actual.trim().length > 0 &&
    form.nueva.length >= 6 &&
    form.nueva === form.confirmar

  const handleSubmit = () => {
    setTouched(true)

    if (!isValid) return

    onSubmit({
      actual: form.actual,
      nueva: form.nueva,
    })
  }

  const campos = [
    { id: 'actual', label: 'Contraseña actual' },
    { id: 'nueva', label: 'Nueva contraseña' },
    { id: 'confirmar', label: 'Confirmar nueva contraseña' },
  ]

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
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
          onClick={onClose}
          disabled={submitting}
          size="small"
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
          {campos.map(({ id, label }) => {
            const error =
              touched &&
              (
                (id === 'actual' && !form.actual.trim()) ||
                (id === 'nueva' && form.nueva.length < 6) ||
                (id === 'confirmar' && form.confirmar !== form.nueva)
              )

            const helperText =
              error && id === 'actual'
                ? 'Ingresa tu contraseña actual'
                : error && id === 'nueva'
                  ? 'Mínimo 6 caracteres'
                  : error && id === 'confirmar'
                    ? 'Las contraseñas no coinciden'
                    : ''

            return (
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
                  placeholder={`Ingresa ${label.toLowerCase()}`}
                  error={error}
                  helperText={helperText}
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
                            disabled={submitting}
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
            )
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          color="inherit"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || (touched && !isValid)}
          sx={{
            bgcolor: BRAND.orange,
            '&:hover': {
              bgcolor: BRAND.orangeDark,
            },
          }}
        >
          {submitting ? 'Guardando...' : 'Actualizar contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
