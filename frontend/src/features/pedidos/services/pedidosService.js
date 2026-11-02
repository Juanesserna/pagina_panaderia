import {
  catalogoClientes,
  catalogoPanaderia,
  usuarioAutenticado,
} from '@features/ventas/mocks/ventasMockData'
import { initialPedidos } from '../data/pedidosMockData'

export const pedidosService = {
  listarPedidos: () => initialPedidos,
  listarClientes: () => catalogoClientes,
  listarProductos: () => catalogoPanaderia,
  obtenerUsuarioActual: () => usuarioAutenticado,
}

