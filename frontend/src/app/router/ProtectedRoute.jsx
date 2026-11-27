import { useSyncExternalStore } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from './routes'
import {
  estaAutenticado,
  suscribirAuth,
} from '@features/auth/services/authService'

export default function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useSyncExternalStore(
    suscribirAuth,
    estaAutenticado
  )

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <Outlet />
}