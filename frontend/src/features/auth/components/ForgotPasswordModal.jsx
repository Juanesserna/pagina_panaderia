
import { useState } from 'react'
import {
  Dialog, Box, Typography, TextField, Button,
  IconButton, Snackbar, Alert, InputAdornment,
} from '@mui/material'
import { IconX, IconEye, IconEyeOff } from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL = {
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
}

const TITLES = {
  email: 'Recuperar contraseña',
  code: 'Verificar correo',
  password: 'Nueva contraseña',
  success: 'Proceso finalizado',
}

function validar(name, form) {
  const value = form[name]?.trim() || ''

  if (!value) {
    return {
      email: 'Ingresa tu correo electrónico.',
      code: 'Ingresa el código de verificación.',
      password: 'Ingresa tu nueva contraseña.',
      confirmPassword: 'Confirma tu nueva contraseña.',
    }[name]
  }

  if (name === 'email' && !EMAIL_RE.test(value)) {
    return 'Ingresa un correo electrónico válido.'
  }

  if (name === 'code' && !/^\d{6}$/.test(value)) {
    return 'El código debe tener exactamente 6 números.'
  }

  if (name === 'password' && form.password.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.'
  }

  if (
    name === 'confirmPassword' &&
    form.confirmPassword !== form.password
  ) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

export function ForgotPasswordModal({ open, onClose, isDark }) {
  const [step, setStep] = useState('email')
  const [form, setForm] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const c = getColors(isDark)
  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark
    ? 'rgba(242,233,221,0.75)'
    : 'rgba(74,46,23,0.75)'
  const paperBg = isDark ? '#2A1D16' : '#FFFFFF'

  const fields = step === 'email'
    ? ['email']
    : step === 'code'
      ? ['code']
      : step === 'password'
        ? ['password', 'confirmPassword']
        : []

  const errors = Object.fromEntries(
    fields.map((name) => [name, validar(name, form)])
  )

  const descriptions = {
    email: 'Ingresa tu correo electrónico para iniciar la recuperación.',
    code: `Introduce el código de verificación enviado a ${form.email}.`,
    password: 'Ingresa y confirma tu nueva contraseña.',
    success: 'Esta es una demostración del flujo de recuperación.',
  }

  const updateField = (name, value) => {
    const limpio = name === 'code'
      ? value.replace(/\D/g, '').slice(0, 6)
      : value

    setForm((prev) => ({ ...prev, [name]: limpio }))
  }

  const touch = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleTab = (name) => (event) => {
    if (event.key === 'Tab' && errors[name]) {
      event.preventDefault()
      touch(name)
    }
  }

  const nextStep = (next) => {
    setTouched({})
    setNotice('')
    setStep(next)
  }

  const handleClose = () => {
    if (submitting) return
    setStep('email')
    setForm({ ...INITIAL })
    setTouched({})
    setNotice('')
    setShowPassword(false)
    setShowConfirm(false)
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setTouched(
      Object.fromEntries(fields.map((name) => [name, true]))
    )

    if (fields.some((name) => errors[name])) {
      setNotice('Completa los campos y corrige los datos inválidos.')
      return
    }

    try {
      setSubmitting(true)

      if (step === 'email') {
        // TODO: solicitar envío del código mediante backend.
        nextStep('code')
      } else if (step === 'code') {
        // TODO: verificar código mediante backend.
        nextStep('password')
      } else if (step === 'password') {
        // TODO: actualizar contraseña mediante backend.
        nextStep('success')
      }
    } catch {
      setNotice('Ocurrió un error. Inténtalo nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldSx = {
    '& .MuiInputBase-root': {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: textColor,
      '&:before': {
        borderBottom: `1px solid ${c.accentSoft}`,
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: `1px solid ${c.accent}`,
      },
      '&:after': {
        borderBottom: `2px solid ${c.accent}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: mutedColor,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: c.accent,
    },
    '& .MuiFormHelperText-root': {
      fontSize: 11,
      mx: 0,
      mt: 0.5,
    },
  }

  const buttonSx = {
    bgcolor: c.accent,
    color: '#FFFFFF',
    py: 1.4,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    '&:hover': {
      bgcolor: c.brandHover,
      color: '#FFFFFF',
    },
    '&.Mui-disabled': {
      bgcolor: isDark ? '#59483B' : '#C9B8A5',
      color: isDark ? '#E5D9CB' : '#FFFFFF',
    },
  }

  const field = (name, label, props = {}) => (
    <TextField
      fullWidth
      required
      variant="standard"
      label={label}
      value={form[name]}
      onChange={(e) => updateField(name, e.target.value)}
      onBlur={() => touch(name)}
      onKeyDown={handleTab(name)}
      error={Boolean(touched[name] && errors[name])}
      helperText={touched[name] ? errors[name] : ''}
      disabled={submitting}
      sx={fieldSx}
      {...props}
    />
  )

  const passwordField = (name, label, show, setShow) =>
    field(name, label, {
      type: show ? 'text' : 'password',
      slotProps: {
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                size="small"
                edge="end"
                aria-label={
                  show ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShow((prev) => !prev)}
                sx={{ color: mutedColor }}
              >
                {show
                  ? <IconEyeOff size={18} />
                  : <IconEye size={18} />}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    })

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (
            reason === 'backdropClick' ||
            reason === 'escapeKeyDown'
          ) return
          handleClose()
        }}
        disableEscapeKeyDown
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: paperBg,
              borderRadius: 3,
              border: `1px solid ${c.accentSoft}`,
              maxWidth: 400,
              maxHeight: 'calc(100dvh - 24px)',
            },
          },
        }}
      >
        <Box
          sx={{
            height: 3,
            background: `linear-gradient(90deg, ${c.brand}, ${c.accent})`,
          }}
        />

        <Box sx={{ p: 3, position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            disabled={submitting}
            aria-label="Cerrar recuperación"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: mutedColor,
              '&:hover': { color: c.accent },
            }}
          >
            <IconX size={18} stroke={1.5} />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              sx={{
                fontFamily: fonts.serif,
                fontSize: 25,
                color: textColor,
              }}
            >
              {TITLES[step]}
            </Typography>

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: mutedColor,
                mt: 1,
              }}
            >
              {descriptions[step]}
            </Typography>
          </Box>

          {step !== 'success' ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {step === 'email' &&
                field('email', 'Correo electrónico', {
                  type: 'email',
                  placeholder: 'tu@correo.com',
                })}

              {step === 'code' && (
                <>
                  {field('code', 'Código de verificación', {
                    placeholder: '000000',
                    slotProps: {
                      htmlInput: {
                        maxLength: 6,
                        inputMode: 'numeric',
                      },
                    },
                  })}
                </>
              )}

              {step === 'password' && (
                <>
                  {passwordField(
                    'password',
                    'Nueva contraseña',
                    showPassword,
                    setShowPassword
                  )}

                  {passwordField(
                    'confirmPassword',
                    'Confirmar contraseña',
                    showConfirm,
                    setShowConfirm
                  )}
                </>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={submitting}
                sx={buttonSx}
              >
                {submitting
                  ? 'Procesando...'
                  : step === 'email'
                    ? 'Enviar código'
                    : step === 'code'
                      ? 'Verificar código'
                      : 'Actualizar contraseña'}
              </Button>

              {step === 'code' && (
                <Button
                  type="button"
                  onClick={() => nextStep('email')}
                  disabled={submitting}
                  sx={{
                    color: textColor,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Cambiar correo
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  color: mutedColor,
                  textAlign: 'center',
                }}
              >
                El recorrido visual se completó, pero todavía
                no se ha enviado ningún correo ni se ha
                modificado una contraseña.
              </Typography>

              <Button
                fullWidth
                onClick={handleClose}
                sx={buttonSx}
              >
                Volver al inicio de sesión
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4500}
        onClose={() => setNotice('')}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setNotice('')}
        >
          {notice}
        </Alert>
      </Snackbar>
    </>
  )
}
