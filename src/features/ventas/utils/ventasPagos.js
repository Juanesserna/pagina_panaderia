// Cálculo del resumen de pagos de una venta (función pura).
import { pagosPermitidos } from './ventasHelpers'

// abonosDeVenta: abonos ya filtrados para esa venta
export function calcularResumenPagos(venta, abonosDeVenta) {
  const cantidadPagos = pagosPermitidos(venta)
  const slots = Array.from({ length: cantidadPagos }, (_, i) => i + 1)
  const montoPorPago = venta ? venta.total / cantidadPagos : 0
  const totalAbonado = abonosDeVenta.filter((a) => a.slot <= cantidadPagos).length * montoPorPago
  const saldoPendiente = venta ? Math.max(venta.total - totalAbonado, 0) : 0
  return { cantidadPagos, slots, montoPorPago, totalAbonado, saldoPendiente }
}
