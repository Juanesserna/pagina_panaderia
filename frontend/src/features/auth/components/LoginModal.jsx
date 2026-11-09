
import { useState } from 'react'
import {
  Dialog, Box, Typography, IconButton, TextField,
  InputAdornment, Button, Tabs, Tab, MenuItem,
  Snackbar, Alert,
} from '@mui/material'
import {
  IconX, IconUserCircle, IconLock, IconMail,
  IconEye, IconEyeOff, IconId, IconPhone,
} from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { getColors, fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.png'
import { ForgotPasswordModal } from './ForgotPasswordModal'

const DOC_TYPES = [
  ['CC', 'Cédula de ciudadanía (C.C.)'],
  ['TI', 'Tarjeta de identidad (T.I.)'],
  ['CE', 'Cédula de extranjería (C.E.)'],
  ['NIT', 'NIT'],
  ['PAS', 'Pasaporte'],
  ['PPT', 'Permiso temporal (PPT)'],
]

const NUMERIC_DOCS = ['CC', 'TI', 'CE']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FORM = {
  documentType: '', documentNumber: '', name: '',
  phone: '', email: '', password: '', confirmPassword: '',
}

const REGISTER_FIELDS = [
  'documentType', 'documentNumber', 'name',
  'phone', 'email', 'password', 'confirmPassword',
]

const REQUIRED = {
  documentType: 'Selecciona un tipo de documento.',
  documentNumber: 'Ingresa tu número de documento.',
  name: 'Ingresa tu nombre completo.',
  phone: 'Ingresa tu teléfono.',
  email: 'Ingresa tu correo electrónico.',
  password: 'Ingresa tu contraseña.',
  confirmPassword: 'Confirma tu contraseña.',
}

function validarCampo(name, form, register) {
  const value = String(form[name] ?? '').trim()
  if (!value) return REQUIRED[name]

  switch (name) {
    case 'documentType':
      return DOC_TYPES.some(([id]) => id === value)
        ? '' : 'Selecciona un documento válido.'

    case 'documentNumber':
      if (!form.documentType) return 'Selecciona primero el tipo de documento.'
      if (NUMERIC_DOCS.includes(form.documentType)) {
        return /^\d{5,15}$/.test(value)
          ? '' : 'El documento debe tener entre 5 y 15 números.'
      }
      if (form.documentType === 'NIT') {
        return /^\d{5,15}(?:-\d)?$/.test(value)
          ? '' : 'Ingresa un NIT válido.'
      }
      return /^[A-Za-z0-9]{5,20}$/.test(value)
        ? '' : 'Ingresa un documento alfanumérico válido.'

    case 'name':
      return value.length >= 3 && value.length <= 80 &&
        /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(value)
        ? '' : 'Ingresa un nombre válido de 3 a 80 caracteres.'

    case 'phone':
      return /^3\d{9}$/.test(value)
        ? '' : 'Ingresa un celular válido de 10 números.'

    case 'email':
      return EMAIL_RE.test(value) ? '' : 'Ingresa un correo válido.'

    case 'password':
      return register && form.password.length < 8
        ? 'La contraseña debe tener mínimo 8 caracteres.' : ''

    case 'confirmPassword':
      return form.confirmPassword === form.password
        ? '' : 'Las contraseñas no coinciden.'

    default:
      return ''
  }
}

function limpiar(name, value, tipo) {
  if (name === 'name') {
    return value.replace(/[^\p{L}\p{M} '\u2019-]/gu, '').slice(0, 80)
  }
  if (name === 'phone') return value.replace(/\D/g, '').slice(0, 10)
  if (name === 'documentNumber') {
    if (NUMERIC_DOCS.includes(tipo)) return value.replace(/\D/g, '').slice(0, 15)
    if (tipo === 'NIT') {
      const limpio = value.replace(/[^\d-]/g, '')
      const match = limpio.match(/^(\d{0,15})(?:-(\d?))?/)
      return match ? match[0] : ''
    }
    return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)
  }
  return value
}

export function LoginModal({ isOpen, onClose, onSuccess, isDark }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const c = getColors(isDark)
  const register = mode === 'register'
  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)'
  const paperBg = isDark ? '#2A1D16' : '#FFFFFF'
  const fields = register ? REGISTER_FIELDS : ['email', 'password']
  const errors = Object.fromEntries(
    fields.map((name) => [name, validarCampo(name, form, register)])
  )

  const changeMode = (next) => {
    setMode(next)
    setTouched({})
    setNotice('')
  }

  const updateField = (name, value) => {
    if (name === 'documentType') {
      setForm((prev) => ({ ...prev, documentType: value, documentNumber: '' }))
      setTouched((prev) => ({ ...prev, documentNumber: false }))
      return
    }
    setForm((prev) => ({
      ...prev,
      [name]: limpiar(name, value, prev.documentType),
    }))
  }

  const touch = (name) => setTouched((prev) => ({ ...prev, [name]: true }))
  const handleTab = (name) => (e) => {
    if (e.key === 'Tab' && errors[name]) {
      e.preventDefault()
      touch(name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setTouched(Object.fromEntries(fields.map((name) => [name, true])))

    if (fields.some((name) => errors[name])) {
    if (register) {
    setNotice('Completa los campos obligatorios y corrige los datos inválidos.')
   }
    return
  }

    try {
      setSubmitting(true)
      // Flujo simulado; conectar al backend posteriormente.
      if (onSuccess) await onSuccess()
      else onClose()
    } catch {
      setNotice('No se pudo completar la operación.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldSx = {
    '& .MuiInputBase-root': {
      fontFamily: fonts.sans, fontSize: 14, color: textColor,
      bgcolor: 'transparent',
      '&:before': { borderBottom: `1px solid ${c.accentSoft}` },
      '&:hover:not(.Mui-disabled):before': { borderBottom: `1px solid ${c.accent}` },
      '&:after': { borderBottom: `2px solid ${c.accent}` },
    },
    '& .MuiInputBase-input': {
      py: 0.65,
      '&::placeholder': { color: mutedColor, opacity: 0.7 },
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${paperBg} inset`,
        WebkitTextFillColor: textColor,
        caretColor: textColor,
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: fonts.sans, fontSize: 14, color: mutedColor,
    },
    '& .MuiInputLabel-root.Mui-focused': { color: c.accent },
    '& .MuiFormHelperText-root': {
      fontSize: 10, lineHeight: 1.2, mx: 0, mt: 0.3,
    },
  }

  const iconProps = { size: 16, stroke: 1.5, color: c.accentSoft }
  const linkSx = {
    border: 0, bgcolor: 'transparent', cursor: 'pointer',
    fontFamily: fonts.sans, fontSize: 12, color: c.accent, p: 0,
    '&:hover': { textDecoration: 'underline' },
  }

  const field = (name, label, { icon: Icon, ...props } = {}) => (
    <TextField
      required variant="standard" label={label}
      value={form[name]} fullWidth
      onChange={(e) => updateField(name, e.target.value)}
      onBlur={() => touch(name)}
      onKeyDown={handleTab(name)}
      error={Boolean(touched[name] && errors[name])}
      helperText={touched[name] ? errors[name] : ''}
      disabled={submitting} sx={fieldSx}
      slotProps={Icon ? {
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Icon {...iconProps} />
            </InputAdornment>
          ),
        },
      } : undefined}
      {...props}
    />
  )

  const pwdField = (name, label, show, setShow) =>
    field(name, label, {
      type: show ? 'text' : 'password',
      placeholder: '••••••••',
      slotProps: {
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconLock {...iconProps} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button" size="small" edge="end"
                aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShow((prev) => !prev)}
                sx={{ color: mutedColor }}
              >
                {show
                  ? <IconEyeOff size={18} stroke={1.8} />
                  : <IconEye size={18} stroke={1.8} />}
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    })

  return (
    <>
      <Dialog
        open={isOpen && !recoveryOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
          onClose()
        }}
        disableEscapeKeyDown
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              width: register ? 540 : 400,
              maxWidth: 'calc(100% - 24px)',
              maxHeight: 'calc(100dvh - 24px)',
              bgcolor: paperBg,
              borderRadius: 3,
              border: `1px solid ${c.accentSoft}`,
              overflowX: 'hidden',
            },
          },
        }}
      >
        <Box sx={{
          height: 3,
          flexShrink: 0,
          background: `linear-gradient(90deg, ${c.brand}, ${c.accent})`,
        }} />

        <Box sx={{ p: register ? 2.5 : 4.5, position: 'relative' }}>
          <IconButton
            onClick={onClose}
            aria-label="Cerrar"
            sx={{
              position: 'absolute', top: 10, right: 10,
              color: mutedColor, '&:hover': { color: c.accent },
            }}
          >
            <IconX size={18} stroke={1.5} />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: register ? 1 : 4 }}>
            <Box sx={{
              mx: 'auto', mb: register ? 0.5 : 1,
              display: 'flex', justifyContent: 'center',
            }}>
              <ImageWithFallback
                src={logoImg} alt="Al Horno"
                style={{
                  height: register ? 40 : 64,
                  width: 'auto', objectFit: 'contain',
                  borderRadius: '50%',
                  boxShadow: '0 2px 12px rgba(23,17,13,0.15)',
                }}
              />
            </Box>

            <Typography sx={{
              fontFamily: fonts.serif,
              fontSize: register ? 25 : 28,
              fontWeight: 300, color: textColor, mb: 0.5,
            }}>
              {register ? 'Crear cuenta' : 'Bienvenido de vuelta'}
            </Typography>
            <Typography sx={{
              fontFamily: fonts.sans, fontSize: 13,
              fontWeight: 300, color: mutedColor,
            }}>
              {register
                ? 'Únete a la familia Al Horno'
                : 'Accede a tu cuenta para gestionar pedidos'}
            </Typography>
          </Box>

          <Tabs
            value={mode}
            onChange={(_, value) => changeMode(value)}
            variant="fullWidth"
            sx={{
              mb: 1.5, minHeight: 0,
              bgcolor: isDark ? 'rgba(242,233,221,0.05)' : '#F0E8DC',
              borderRadius: 1, p: 0.4,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                minHeight: 36, borderRadius: 0.5,
                fontFamily: fonts.sans, fontSize: 12,
                fontWeight: 500, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: mutedColor,
              },
              '& .Mui-selected': {
                bgcolor: c.brand,
                color: `${c.buttonText} !important`,
              },
            }}
          >
            <Tab value="login" label="Iniciar sesión" />
            <Tab value="register" label="Registrarse" />
          </Tabs>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: register ? 1 : 2.5,
            }}
          >
            {register && (
              <>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}>
                  {field('documentType', 'Tipo de documento', {
                    select: true,
                    children: DOC_TYPES.map(([value, label]) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    )),
                  })}
                  {field('documentNumber', 'Número de documento', {
                    icon: IconId,
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconId {...iconProps} />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: NUMERIC_DOCS.includes(form.documentType) ||
                          form.documentType === 'NIT' ? 'numeric' : 'text',
                      },
                    },
                  })}
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}>
                  {field('name', 'Nombre completo', { icon: IconUserCircle })}
                  {field('phone', 'Teléfono', {
                    icon: IconPhone, type: 'tel',
                    placeholder: '3001234567',
                    slotProps: {
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconPhone {...iconProps} />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: { inputMode: 'numeric' },
                    },
                  })}
                </Box>
              </>
            )}

            {field('email', 'Correo electrónico', {
              icon: IconMail, type: 'email',
              placeholder: 'tu@correo.com',
            })}

            <Box sx={register ? {
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            } : {}}>
              {pwdField('password', 'Contraseña', showPwd, setShowPwd)}
              {register && pwdField(
                'confirmPassword', 'Confirmar contraseña',
                showConfirmPwd, setShowConfirmPwd
              )}
            </Box>

            {!register && (
              <Box sx={{ textAlign: 'right', mt: -1 }}>
                <Typography
                  component="button" type="button"
                  onClick={() => setRecoveryOpen(true)}
                  sx={linkSx}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Box>
            )}

            <Button
              type="submit" fullWidth disabled={submitting}
              sx={{
                mt: 0.5, bgcolor: c.accent, color: c.buttonText,
                py: register ? 1 : 1.6, fontSize: 13,
                '&:hover': { bgcolor: c.brandHover },
              }}
            >
              {submitting ? 'Procesando...' :
                register ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>

            <Typography sx={{
              fontFamily: fonts.sans, fontSize: 12,
              color: mutedColor, textAlign: 'center',
            }}>
              {register ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <Box
                component="button" type="button"
                onClick={() => changeMode(register ? 'login' : 'register')}
                sx={{ ...linkSx, textDecoration: 'underline' }}
              >
                {register ? 'Inicia sesión' : 'Regístrate'}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Dialog>

      <ForgotPasswordModal
        open={isOpen && recoveryOpen}
        isDark={isDark}
        onClose={() => setRecoveryOpen(false)}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4500}
        onClose={() => setNotice('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error" variant="filled"
          onClose={() => setNotice('')}
        >
          {notice}
        </Alert>
      </Snackbar>
    </>
  )
}
