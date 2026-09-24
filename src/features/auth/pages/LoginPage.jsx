// src/features/auth/pages/LoginPage.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { LoginModal } from '../components/LoginModal'
import { ROUTES } from '@app/router/routes' // ← ajusta esta ruta

export default function LoginPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const isDark = localStorage.getItem('alhorno-dark') === 'true'
  const from = state?.from ?? ROUTES.LANDING

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#1A0D07' : '#FAF5EE' }}>
      <LoginModal
        isOpen
        isDark={isDark}
        onClose={() => navigate(from)}                                   // la X sigue volviendo a donde venía
        onSuccess={() => navigate(ROUTES.DASHBOARD, { replace: true })}  // iniciar sesión → dashboard
      />
    </Box>
  )
}