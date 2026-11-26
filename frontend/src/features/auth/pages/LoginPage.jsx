import { useLocation, useNavigate } from 'react-router-dom'
import { LoginModal } from '../components/LoginModal'
import { ROUTES } from '@app/router/routes'
import { iniciarSesionSimulada } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const isDark =
    localStorage.getItem('alhorno-dark') === 'true'

  const handleSuccess = () => {
    iniciarSesionSimulada()
    navigate(ROUTES.DASHBOARD, { replace: true })
  }

  return (
    <LoginModal
      isOpen
      isDark={isDark}
      onClose={() =>
        navigate(state?.from || ROUTES.LANDING, {
          replace: true,
        })
      }
      onSuccess={handleSuccess}
    />
  )
}