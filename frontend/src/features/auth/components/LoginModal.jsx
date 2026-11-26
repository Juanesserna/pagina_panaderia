import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Checkbox,
  FormControl,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {
  IconUserCircle,
  IconMail,
  IconId,
  IconPhone,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'
import { NotificacionesContainer, useNotificaciones } from '@shared/notifications'
import useAuthForm, {
  LOGIN_FIELDS,
  REGISTER_FIELDS,
} from '../hooks/useAuthForm'
import {
  DOC_TYPES,
  NUMERIC_DOCS,
  EMAIL_MAX_LENGTH,
} from '../utils/authValidations'
import AuthLayout from './AuthLayout'
import AuthField from './AuthField'
import PasswordRequirements from './PasswordRequirements'
import TermsDialog from './TermsDialog'
import { ForgotPasswordModal } from './ForgotPasswordModal'
const grid2 = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'minmax(0, 1fr)',
    sm: 'repeat(2, minmax(0, 1fr))',
  },
  gap: 1,
}
const CONSENTS = [
  {
    name: 'acceptTerms',
    text: 'He leído y acepto los',
    link: 'términos y condiciones.',
    type: 'terms',
  },
  {
    name: 'acceptPrivacy',
    text: 'Autorizo el tratamiento de mis datos conforme a la',
    link: 'política de tratamiento de datos personales.',
    type: 'privacy',
  },
]
export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  isDark,
}) {
  const [mode, setMode] = useState('login')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [documentOpen, setDocumentOpen] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [formVersion, setFormVersion] = useState(0)
  const register = mode === 'register'
  const c = getColors(isDark)
  const auth = useAuthForm({
    fields: register ? REGISTER_FIELDS : LOGIN_FIELDS,
    mode,
  })
  const { notificaciones, mostrarNotificacion } = useNotificaciones()
  const { notice, setNotice } = auth
  // Reutiliza las notificaciones del aplicativo y consume cada aviso.
  useEffect(() => {
    if (!notice) return
    mostrarNotificacion('error', 'Verifica la información', notice)
    setNotice('')
  }, [notice, setNotice, mostrarNotificacion])
  const warningColor = isDark ? '#FFB74D' : '#986000'
  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? '#C4B5A6' : '#796655'
  const paperBg = isDark ? '#2A1D16' : '#FFFCF8'
  const primaryColor = isDark ? c.brand : '#A65B2B'
  const fieldProps = { auth, isDark }
  const linkSx = {
    color: primaryColor,
    fontFamily: fonts.sans,
    textTransform: 'none',
    fontWeight: 600,
    textDecoration: 'underline',
    minWidth: 0,
    p: 0,
    verticalAlign: 'baseline',
    '&:hover': {
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  }
  // Ejecuta una acción después de descartar el formulario.
  const executeAction = (action) => {
    auth.resetForm()
    setFormVersion((prev) => prev + 1)
    setPendingAction(null)
    if (action === 'close') {
      onClose()
      return
    }
    if (action === 'recovery') {
      setRecoveryOpen(true)
      return
    }
    setRecoveryOpen(false)
    setMode(action)
  }
  // Solicita confirmación únicamente si existen cambios.
  const requestAction = (action, dirty = auth.isDirty) => {
    if (auth.submitting || (!recoveryOpen && action === mode)) return
    if (dirty) {
      setPendingAction(action)
      return
    }
    executeAction(action)
  }
  const handleSubmit = (event) => {
    return auth.handleSubmit(event, async () => {
      // Flujo simulado existente.
      // Pendiente de conexión con el backend.
      if (onSuccess) {
        await onSuccess()
      } else {
        onClose()
      }
    })
  }
  return (
    <>
      <AuthLayout
        open={isOpen && !recoveryOpen}
        onClose={() => requestAction('close')}
        title={
          register
            ? 'Crea tu cuenta'
            : 'Bienvenido de vuelta'
        }
        description={
          register
            ? 'Regístrate y disfruta de todo lo que Al Horno tiene para ti.'
            : 'Ingresa tus credenciales para acceder a tu cuenta.'
        }
        isDark={isDark}
        submitting={auth.submitting}
        wide={register}
      >
        <Box
          key={`${mode}-${formVersion}`}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !event.defaultPrevented && !documentOpen && !pendingAction) {
              event.preventDefault()
              requestAction('close')
            }
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            gap: register ? 0.75 : 2,
            animation: 'authEnter 300ms ease-out both',
            '@keyframes authEnter': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          {/* Información personal del registro */}
          {register && (
            <>
              <Box sx={grid2}>
                <AuthField
                  {...fieldProps}
                  name="documentType"
                  label="Tipo de documento"
                  select
                >
                  {DOC_TYPES.map(([id, label]) => (
                    <MenuItem key={id} value={id}>
                      {label}
                    </MenuItem>
                  ))}
                </AuthField>
                <AuthField
                  {...fieldProps}
                  name="documentNumber"
                  label="Número de documento"
                  icon={IconId}
                  disabled={!auth.form.documentType}
                  inputProps={{
                    inputMode: NUMERIC_DOCS.includes(
                      auth.form.documentType
                    )
                      ? 'numeric'
                      : 'text',
                  }}
                />
              </Box>
              <Box sx={grid2}>
                <AuthField
                  {...fieldProps}
                  name="name"
                  label="Nombre completo"
                  icon={IconUserCircle}
                  autoComplete="name"
                  inputProps={{ maxLength: 80 }}
                />
                <AuthField
                  {...fieldProps}
                  name="phone"
                  label="Celular"
                  icon={IconPhone}
                  type="tel"
                  autoComplete="tel-national"
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 10,
                  }}
                />
              </Box>
            </>
          )}
          {/* Credenciales compartidas */}
          <AuthField
            {...fieldProps}
            name="email"
            label="Correo electrónico"
            icon={IconMail}
            type="email"
            autoComplete={register ? 'email' : 'username'}
            inputProps={{ maxLength: EMAIL_MAX_LENGTH }}
          />
          <Box
            sx={
              register
                ? grid2
                : { display: 'grid', gap: 1.5 }
            }
          >
            <AuthField
              {...fieldProps}
              name="password"
              label="Contraseña"
              type="password"
              autoComplete={
                register
                  ? 'new-password'
                  : 'current-password'
              }
            />
            {register && (
              <AuthField
                {...fieldProps}
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                autoComplete="new-password"
              />
            )}
          </Box>
          {register ? (
            <>
              <PasswordRequirements
                password={auth.form.password}
                isDark={isDark}
              />
              {/* Autorizaciones independientes */}
              <Box>
                {CONSENTS.map(({ name, text, link, type }) => {
                  const error =
                    auth.touched[name] && auth.errors[name]
                  return (
                    <FormControl
                      key={name}
                      error={Boolean(error)}
                      fullWidth
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 0.5,
                        }}
                      >
                        <Checkbox
                          id={`auth-${name}`}
                          checked={auth.form[name]}
                          disabled={auth.submitting}
                          onChange={(event) => {
                            auth.updateField(
                              name,
                              event.target.checked
                            )
                            auth.touch(name)
                          }}
                          sx={{
                            p: 0.5,
                            color: error
                              ? 'error.main'
                              : mutedColor,
                            '&.Mui-checked': {
                              color: primaryColor,
                            },
                          }}
                        />
                        <Box sx={{ pt: 0.5 }}>
                          <Typography
                            component="label"
                            htmlFor={`auth-${name}`}
                            sx={{
                              fontFamily: fonts.sans,
                              fontSize: 12,
                              lineHeight: 1.6,
                              color: textColor,
                            }}
                          >
                            {text}{' '}
                          </Typography>
                          <Button
                            type="button"
                            onClick={() => setDocumentOpen(type)}
                            disabled={auth.submitting}
                            sx={{
                              ...linkSx,
                              display: 'inline',
                              fontSize: 12,
                              lineHeight: 1.6,
                              textAlign: 'left',
                            }}
                          >
                            {link}
                          </Button>
                        </Box>
                      </Box>
                      {error && (
                        <FormHelperText sx={{ ml: 4.5 }}>
                          {error}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )
                })}
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'right' }}>
              <Button
                type="button"
                disabled={auth.submitting}
                onClick={() => requestAction('recovery')}
                sx={{ ...linkSx, fontSize: 12 }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>
          )}
          {/* Acción principal */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={auth.submitting}
            sx={{
              minHeight: 46,
              borderRadius: 2,
              bgcolor: primaryColor,
              color: '#FFFFFF',
              fontFamily: fonts.sans,
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              mt: register ? 0 : 0.5,
              '&:hover': {
                bgcolor: isDark ? c.brandHover : '#8C4821',
                boxShadow: 'none',
              },
            }}
          >
            {auth.submitting
              ? 'Procesando...'
              : register
                ? 'Crear cuenta'
                : 'Iniciar sesión'}
          </Button>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 12,
              color: mutedColor,
              textAlign: 'center',
              mt: register ? 0 : 0.5,
            }}
          >
            {register
              ? '¿Ya tienes una cuenta?'
              : '¿Todavía no tienes una cuenta?'}{' '}
            <Button
              type="button"
              disabled={auth.submitting}
              onClick={() =>
                requestAction(register ? 'login' : 'register')
              }
              sx={{ ...linkSx, fontSize: 12 }}
            >
              {register ? 'Inicia sesión' : 'Regístrate'}
            </Button>
          </Typography>
        </Box>
      </AuthLayout>
      {/* Consulta de documentos sin perder el formulario */}
      <TermsDialog
        open={Boolean(documentOpen)}
        type={documentOpen ?? 'terms'}
        onClose={() => setDocumentOpen(null)}
        isDark={isDark}
      />
      {/* Confirmación de cambios sin guardar */}
      <Dialog
        open={Boolean(pendingAction)}
        disableEscapeKeyDown
        maxWidth="xs"
        fullWidth
        aria-labelledby="auth-discard-title"
        aria-describedby="auth-discard-description"
        slotProps={{
          paper: {
            sx: {
              bgcolor: paperBg,
              borderRadius: 3,
              borderTop: '4px solid #ED9B25',
            },
          },
        }}
      >
        <DialogTitle
          id="auth-discard-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: textColor,
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <IconAlertTriangle
            size={25}
            color={isDark ? '#FFB74D' : '#B76E00'}
          />
          ¿Deseas abandonar el formulario?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="auth-discard-description"
            sx={{
              fontFamily: fonts.sans,
              fontSize: 14,
              lineHeight: 1.7,
              color: mutedColor,
            }}
          >
            Si sales del formulario, perderás la información que has ingresado.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: 'wrap' }}>
          <Button
            onClick={() => executeAction(pendingAction)}
            variant="outlined"
            sx={{
              color: warningColor,
              borderColor: warningColor,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                borderColor: warningColor,
                bgcolor: isDark ? 'rgba(255,183,77,0.08)' : '#FFF4E2',
              },
            }}
          >
            Salir del formulario
          </Button>
          <Button
            autoFocus
            onClick={() => setPendingAction(null)}
            variant="contained"
            sx={{
              bgcolor: primaryColor,
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: isDark ? c.brandHover : '#8C4821',
              },
            }}
          >
            Permanecer aquí
          </Button>
        </DialogActions>
      </Dialog>
      {isOpen && recoveryOpen && (
        <ForgotPasswordModal
          open
          onClose={(dirty) => requestAction('login', dirty)}
          isDark={isDark}
        />
      )}
      {/* Notificaciones globales de validación */}
      <NotificacionesContainer notificaciones={notificaciones} />
    </>
  )
}
