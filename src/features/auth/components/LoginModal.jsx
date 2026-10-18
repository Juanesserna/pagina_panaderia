// src/features/auth/components/LoginModal.jsx
import { useState } from 'react'
import { Dialog, Box, Typography, IconButton, TextField, InputAdornment, Button, Tabs, Tab } from '@mui/material'
import { IconX, IconUserCircle, IconLock, IconMail, IconEye, IconEyeOff, IconId, IconPhone } from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { getColors, fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.png'

export function LoginModal({ isOpen, onClose, onSuccess, isDark }) {
  const [mode, setMode] = useState('login')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [form, setForm] = useState({
    nitCedula: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const c = getColors(isDark)
  const isRegister = mode === 'register'

  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)'
  const paperBg = isDark ? '#2A1D16' : '#FFFFFF'

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con el service real de auth (features/auth/services)
    if (onSuccess) onSuccess()
    else onClose()
  }

  // Inputs sin fondo, solo con línea inferior
  const fieldSx = {
    '& .MuiInputBase-root': {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: textColor,
      bgcolor: 'transparent',
      '&:before': { borderBottom: `1px solid ${c.accentSoft}` },
      '&:hover:not(.Mui-disabled):before': { borderBottom: `1px solid ${c.accent}` },
      '&:after': { borderBottom: `2px solid ${c.accent}` },
    },
    '& .MuiInputBase-input': {
      py: 1,
      '&::placeholder': { color: mutedColor, opacity: 0.7 },
      // Evita el fondo azul/amarillo del autocompletado del navegador
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${paperBg} inset`,
        WebkitTextFillColor: textColor,
        caretColor: textColor,
      },
    },
    '& .MuiInputLabel-root': { fontFamily: fonts.sans, fontSize: 14, color: mutedColor },
    '& .MuiInputLabel-root.Mui-focused': { color: c.accent },
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { bgcolor: paperBg, borderRadius: 1, border: `1px solid ${c.accentSoft}` } }}
    >
      <Box sx={{ height: 3, background: `linear-gradient(90deg, ${c.brand}, ${c.accent})` }} />

      <Box sx={{ p: 4.5, pb: 4, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: mutedColor, '&:hover': { color: c.accent } }}
        >
          <IconX size={18} stroke={1.5} />
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ mx: 'auto', mb: 1.75, display: 'flex', justifyContent: 'center' }}>
            <ImageWithFallback
              src={logoImg}
              alt="Al Horno"
              style={{ height: 64, width: 'auto', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 2px 12px rgba(23,17,13,0.15)' }}
            />
          </Box>
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 300, color: textColor, mb: 0.75 }}>
            {isRegister ? 'Crear cuenta' : 'Bienvenido de vuelta'}
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: mutedColor }}>
            {isRegister ? 'Únete a la familia Al Horno' : 'Accede a tu cuenta para gestionar pedidos'}
          </Typography>
        </Box>

        {/* Tabs login / registro */}
        <Tabs
          value={mode}
          onChange={(_, v) => setMode(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 0,
            bgcolor: isDark ? 'rgba(242,233,221,0.05)' : '#F0E8DC',
            borderRadius: 1,
            p: 0.4,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: 36,
              borderRadius: 0.5,
              fontFamily: fonts.sans,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: mutedColor,
            },
            '& .Mui-selected': { bgcolor: c.brand, color: `${c.buttonText} !important` },
          }}
        >
          <Tab value="login" label="Iniciar sesión" />
          <Tab value="register" label="Registrarse" />
        </Tabs>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {isRegister && (
            <>
              <TextField
                variant="standard"
                label="NIT / Cédula"
                placeholder="Número de identificación"
                value={form.nitCedula}
                onChange={(e) => setForm({ ...form, nitCedula: e.target.value })}
                sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><IconId size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment> }}
              />
              <TextField
                variant="standard"
                label="Nombre completo"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><IconUserCircle size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment> }}
              />
            </>
          )}

          <TextField
            variant="standard"
            type="email"
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><IconMail size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment> }}
          />

          {isRegister && (
            <TextField
              variant="standard"
              type="tel"
              label="Teléfono"
              placeholder="+57 300 000 0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><IconPhone size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment> }}
            />
          )}

          <TextField
            variant="standard"
            type={showPwd ? 'text' : 'password'}
            label="Contraseña"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><IconLock size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPwd(!showPwd)} sx={{ color: mutedColor }}>
                    {showPwd ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {isRegister && (
            <TextField
              variant="standard"
              type={showConfirmPwd ? 'text' : 'password'}
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              sx={fieldSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><IconLock size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirmPwd(!showConfirmPwd)} sx={{ color: mutedColor }}>
                      {showConfirmPwd ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {!isRegister && (
            <Box sx={{ textAlign: 'right', mt: -1 }}>
              <Typography component="a" href="#" sx={{ fontFamily: fonts.sans, fontSize: 12, color: c.accent, textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            sx={{ mt: 1, bgcolor: c.accent, color: c.buttonText, py: 1.6, fontSize: 13, '&:hover': { bgcolor: c.brandHover } }}
          >
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </Button>

          <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: mutedColor, textAlign: 'center' }}>
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <Box
              component="button"
              type="button"
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              sx={{ background: 'none', border: 'none', cursor: 'pointer', color: c.accent, fontFamily: fonts.sans, fontSize: 12, p: 0, textDecoration: 'underline' }}
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Dialog>
  )
}