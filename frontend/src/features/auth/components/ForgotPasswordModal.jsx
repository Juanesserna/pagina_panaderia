import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { IconMail, IconKey, IconCircleCheck } from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'
import { NotificacionesContainer, useNotificaciones } from '@shared/notifications'
import useAuthForm from '../hooks/useAuthForm'
import { EMAIL_MAX_LENGTH } from '../utils/authValidations'
import AuthLayout from './AuthLayout'
import AuthField from './AuthField'
import PasswordRequirements from './PasswordRequirements'

const STEPS = {
  email: {
    title: 'Recuperar contraseña',
    description: 'Ingresa tu correo electrónico para recuperar el acceso a tu cuenta.',
    fields: ['email'],
    button: 'Enviar código',
  },
  code: {
    title: 'Verificar correo',
    description: 'Si el correo está asociado a una cuenta, recibirás las instrucciones para restablecer tu contraseña.',
    fields: ['code'],
    button: 'Verificar código',
  },
  password: {
    title: 'Nueva contraseña',
    description: 'Ingresa y confirma tu nueva contraseña.',
    fields: ['password', 'confirmPassword'],
    button: 'Actualizar contraseña',
  },
  success: {
    title: 'Demostración finalizada',
    description: 'El recorrido de recuperación se ha completado en modo de prueba.',
    fields: [],
  },
}

export function ForgotPasswordModal({ open, onClose, isDark }) {
  const [step, setStep] = useState('email')
  const current = STEPS[step]
  const auth = useAuthForm({ fields: current.fields, mode: 'recovery' })
  const { notificaciones, mostrarNotificacion } = useNotificaciones()
  const { notice, setNotice } = auth
  const c = getColors(isDark)
  const primary = isDark ? c.brand : '#A65B2B'
  const muted = isDark ? '#C4B5A6' : '#796655'
  const fieldProps = { auth, isDark }

  useEffect(() => {
    if (!notice) return
    mostrarNotificacion('error', 'Verifica la información', notice)
    setNotice('')
  }, [notice, setNotice, mostrarNotificacion])

  const requestClose = () => {
    if (!auth.submitting) onClose(step !== 'success' && auth.isDirty)
  }

  const handleSubmit = (event) => auth.handleSubmit(event, async () => {
    // Demostración: no envía correos ni verifica códigos reales.
    if (step === 'email') {
      auth.resetValidation()
      setStep('code')
      mostrarNotificacion('info', 'Modo de prueba', 'No se ha enviado un correo real.')
    } else if (step === 'code') {
      auth.resetValidation()
      setStep('password')
    } else if (step === 'password') {
      auth.clearSensitiveFields()
      setStep('success')
    }
  })

  const changeEmail = () => {
    auth.resetForm({ email: auth.form.email })
    setStep('email')
  }

  const buttonSx = {
    minHeight: 46, borderRadius: 2, bgcolor: primary, color: '#FFFFFF',
    fontFamily: fonts.sans, fontSize: 14, fontWeight: 600,
    textTransform: 'none', boxShadow: 'none',
    '&:hover': { bgcolor: isDark ? c.brandHover : '#8C4821', boxShadow: 'none' },
  }
  const linkSx = {
    color: primary, textTransform: 'none', fontWeight: 600,
    fontSize: 12, textDecoration: 'underline',
  }

  return (
    <>
      <AuthLayout open={open} onClose={requestClose} backLabel="Volver al inicio de sesión"
        title={current.title} description={current.description} isDark={isDark}
        submitting={auth.submitting}>
        <Box key={step} component={step === 'success' ? 'div' : 'form'}
          onSubmit={step === 'success' ? undefined : handleSubmit} noValidate
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !event.defaultPrevented) {
              event.preventDefault()
              requestClose()
            }
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2,
            animation: 'recoveryEnter 300ms ease-out both',
            '@keyframes recoveryEnter': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}>
          {step === 'email' && <AuthField {...fieldProps} name="email" label="Correo electrónico"
            icon={IconMail} type="email" autoComplete="email" inputProps={{ maxLength: EMAIL_MAX_LENGTH }} />}
          {step === 'code' && <AuthField {...fieldProps} name="code" label="Código de verificación"
            icon={IconKey} autoComplete="one-time-code" inputProps={{ inputMode: 'numeric', maxLength: 6 }} />}
          {step === 'password' && <>
            <AuthField {...fieldProps} name="password" label="Nueva contraseña" type="password" autoComplete="new-password" />
            <AuthField {...fieldProps} name="confirmPassword" label="Confirmar contraseña" type="password" autoComplete="new-password" />
            <PasswordRequirements password={auth.form.password} isDark={isDark} />
          </>}
          {step === 'success' ? <>
            <Box sx={{ textAlign: 'center', color: isDark ? '#81C784' : '#2E7D32' }}><IconCircleCheck size={48} /></Box>
            <Typography sx={{ color: muted, fontSize: 13, textAlign: 'center' }}>
              No se ha enviado ningún correo ni se ha modificado una contraseña real.
            </Typography>
            <Button type="button" variant="contained" onClick={requestClose} sx={buttonSx}>Volver al inicio de sesión</Button>
          </> : <>
            <Typography sx={{ color: muted, fontSize: 12, textAlign: 'center' }}>
              Modo de prueba: {step === 'code' ? 'ingresa seis números para continuar la demostración.' : 'la recuperación aún no está conectada al servidor.'}
            </Typography>
            <Button type="submit" variant="contained" disabled={auth.submitting} sx={buttonSx}>
              {auth.submitting ? 'Procesando...' : current.button}
            </Button>
            {step === 'code' && <Button type="button" disabled={auth.submitting} onClick={changeEmail} sx={linkSx}>Cambiar correo</Button>}
          </>}
        </Box>
      </AuthLayout>
      <NotificacionesContainer notificaciones={notificaciones} />
    </>
  )
}
