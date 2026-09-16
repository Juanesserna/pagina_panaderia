import { useState } from 'react'
import { Dialog, Box, Typography, IconButton, TextField, InputAdornment, Button, Tabs, Tab } from '@mui/material'
import { IconX, IconUserCircle, IconLock, IconMail, IconEye, IconEyeOff, IconId, IconPhone } from '@tabler/icons-react'
import { ImageWithFallback } from '@shared/components/ImageWithFallback'
import { getColors, fonts } from '@app/theme/colors'
import logoImg from '@assets/img/logo_claro.png'

export function LoginModal({ isOpen, onClose, isDark }) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con el service real de auth (features/auth/services)
    onClose()
  }

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: isDark ? 'rgba(242,233,221,0.05)' : c.sidebar,
      borderRadius: 1,
      '& fieldset': { borderColor: c.accentSoft },
      '&:hover fieldset': { borderColor: c.accent },
      '&.Mui-focused fieldset': { borderColor: c.accent },
    },
    '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: 14, color: isDark ? '#F2E9DD' : '#4A2E17' },
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { bgcolor: isDark ? '#2A1D16' : '#FFFFFF', borderRadius: 1, border: `1px solid ${c.accentSoft}` } }}
    >
      <Box sx={{ height: 3, background: `linear-gradient(90deg, ${c.brand}, ${c.accent})` }} />

      <Box sx={{ p: 4.5, pb: 4, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 12, right: 12, color: isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)', '&:hover': { color: c.accent } }}
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
          <Typography sx={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 300, color: isDark ? '#F2E9DD' : '#4A2E17', mb: 0.75 }}>
            {isRegister ? 'Crear cuenta' : 'Bienvenido de vuelta'}
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 300, color: isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)' }}>
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
              color: isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)',
            },
            '& .Mui-selected': { bgcolor: c.brand, color: `${c.buttonText} !important` },
          }}
        >
          <Tab value="login" label="Iniciar sesión" />
          <Tab value="register" label="Registrarse" />
        </Tabs>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {isRegister && (
            <>
              <TextField
                label="NIT / Cédula"
                placeholder="Número de identificación"
                value={form.nitCedula}
                onChange={(e) => setForm({ ...form, nitCedula: e.target.value })}
                sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><IconId size={16} stroke={1.5} color={c.accentSoft} /></InputAdornment> }}
              />
              <TextField
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
                  <IconButton size="small" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {isRegister && (
            <TextField
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
                    <IconButton size="small" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                      {showConfirmPwd ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {!isRegister && (
            <Box sx={{ textAlign: 'right' }}>
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

          <Typography sx={{ fontFamily: fonts.sans, fontSize: 12, color: isDark ? 'rgba(242,233,221,0.55)' : 'rgba(74,46,23,0.5)', textAlign: 'center', mt: 1 }}>
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
