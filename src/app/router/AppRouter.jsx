import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '@layouts/MainLayout'

// Rutas públicas
const LandingPage = lazy(() => import('@features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'))

// Rutas protegidas
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'))
const CategoriasPage = lazy(() => import('@features/categorias/pages/CategoriasPage'))
const ComprasPage = lazy(() => import('@features/compras/pages/ComprasPage'))
const InsumosPage = lazy(() => import('@features/insumos/pages/InsumosPage'))
const ProduccionPage = lazy(() => import('@features/produccion/pages/ProduccionPage'))
const ProductosPage = lazy(() => import('@features/productos/pages/ProductosPage'))
const ProveedoresPage = lazy(() => import('@features/proveedores/pages/ProveedoresPage'))
const RolesPage = lazy(() => import('@features/roles/pages/RolesPage'))
const UsuariosPage = lazy(() => import('@features/usuarios/pages/UsuariosPage'))
const VentasPage = lazy(() => import('@features/ventas/pages/VentasPage'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Rutas públicas */}
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Rutas protegidas, envueltas en el layout con sidebar/header */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.CATEGORIAS} element={<CategoriasPage />} />
              <Route path={ROUTES.COMPRAS} element={<ComprasPage />} />
              <Route path={ROUTES.INSUMOS} element={<InsumosPage />} />
              <Route path={ROUTES.PRODUCCION} element={<ProduccionPage />} />
              <Route path={ROUTES.PRODUCTOS} element={<ProductosPage />} />
              <Route path={ROUTES.PROVEEDORES} element={<ProveedoresPage />} />
              <Route path={ROUTES.ROLES} element={<RolesPage />} />
              <Route path={ROUTES.USUARIOS} element={<UsuariosPage />} />
              <Route path={ROUTES.VENTAS} element={<VentasPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}