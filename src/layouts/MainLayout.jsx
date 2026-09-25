import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Sidebar } from "@layouts/components/Sidebar";
import { Header } from "@layouts/components/Header";
import { ROUTES } from "@app/router/routes";

const PATH_TO_PAGE = {
  [ROUTES.DASHBOARD]: "dashboard",
  [ROUTES.MIS_PEDIDOS]: "mis-pedidos",
  [ROUTES.PERFIL]: "perfil",
  [ROUTES.VENTAS]: "ventas",
  [ROUTES.PRODUCCION]: "produccion",
  [ROUTES.COMPRAS]: "compras",
  [ROUTES.PROVEEDORES]: "proveedores",
  [ROUTES.INSUMOS]: "insumos",
  [ROUTES.PRODUCTOS]: "productos",
  [ROUTES.USUARIOS]: "usuarios",
  [ROUTES.CATEGORIAS]: "categorias",
  [ROUTES.ROLES]: "roles",
};

const PAGE_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_PAGE).map(([path, page]) => [page, path])
);

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const activePage = useMemo(
    () => PATH_TO_PAGE[location.pathname] ?? "dashboard",
    [location.pathname]
  );

  const handleNavigate = (page) => {
    const path = PAGE_TO_PATH[page];
    if (path) navigate(path);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh' }}>
        <Header page={activePage} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
