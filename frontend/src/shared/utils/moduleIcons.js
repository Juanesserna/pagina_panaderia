import {
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  Users,
  Factory,
  Package,
  ShoppingCart,
  Truck,
  Layers,
  Tag,
  UserRound,
  UserCog,
  Shield,
  Settings,
} from 'lucide-react'

export const MODULE_ICONS = {
  Dashboard: LayoutDashboard,
  Ventas: TrendingUp,
  Pedidos: ClipboardList,
  Clientes: Users,
  Producción: Factory,
  Insumos: Package,
  Compras: ShoppingCart,
  Proveedores: Truck,
  Catálogo: Layers,
  Categorías: Tag,
  Productos: Layers,
  Usuarios: UserRound,
  Empleados: UserCog,
  Roles: Shield,
  Configuración: Settings,
}

export function getModuleIcon(nombre) {
  return MODULE_ICONS[nombre] ?? Layers
}
