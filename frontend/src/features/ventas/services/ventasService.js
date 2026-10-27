// Única puerta de acceso a los datos de "ventas".
// HOY: lee los mocks (síncrono). MAÑANA: llamará a la API (async) y los hooks
// agregarán estados de carga/error. Ningún hook ni componente debe importar ../mocks directamente.
import {
  initialVentas,
  usuarioAutenticado,
  catalogoClientes,
  catalogoPanaderia,
  obtenerProductosVenta,
} from '../mocks/ventasMockData'

export const ventasService = {
  listarVentas: () => initialVentas,
  listarClientes: () => catalogoClientes,
  listarProductos: () => catalogoPanaderia,
  // TODO: debe venir de features/auth
  obtenerUsuarioActual: () => usuarioAutenticado,
  obtenerDetalleVenta: (venta) => obtenerProductosVenta(venta),
}
