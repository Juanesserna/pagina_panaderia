import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from './routes'

export default function ProtectedRoute() {
  const isAuthenticated = true // 👈 por ahora en false a propósito, luego lo conectamos con auth real

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}