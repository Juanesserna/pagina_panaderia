import { DOS_DIAS_MS } from '@features/produccion/constants/produccion.constants'

export const cap = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

// "completado" y "cancelado" son estados finales: una vez que una orden llega a alguno de
// los dos, la orden completa (estado e ítems) queda bloqueada y ya no se puede modificar.
export const esEstadoFinal = (estado) => estado === 'completado' || estado === 'cancelado'

// Convierte "DD/MM/YYYY HH:mm" a un Date real para poder comparar contra una franja de fechas.
export function parseFechaSolicitud(fecha) {
  const [datePart, timePart] = fecha.split(' ')
  const [d, m, y] = datePart.split('/').map(Number)
  const [hh, mm] = (timePart || '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

// Estado "efectivo" de una orden para mostrar en pantalla: si lleva 2 días o más desde su
// fecha de solicitud y todavía no llegó a un estado final, se considera "retrasado".
export const estadoEfectivo = (orden) => {
  if (esEstadoFinal(orden.estado)) return orden.estado
  const solicitada = parseFechaSolicitud(orden.fechaSolicitud)
  const transcurrido = Date.now() - solicitada.getTime()
  if (transcurrido >= DOS_DIAS_MS) return 'retrasado'
  return orden.estado
}

export const totalCantidad = (orden) => orden.items.reduce((s, i) => s + i.cantidad, 0)

export const formatFecha = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Siguiente id disponible: OP-001, OP-002...
export const siguienteIdOrden = (ordenes) => {
  const maxNum = ordenes.reduce((max, o) => Math.max(max, parseInt(o.id.replace(/\D/g, ''), 10) || 0), 0)
  return `OP-${String(maxNum + 1).padStart(3, '0')}`
}

// Total consolidado de insumos de una orden, sumando insumos iguales entre productos distintos.
// `recetas` = { [producto]: [{ nombre, cantidad, unidad }] } (hoy viene del mock).
export const calcularInsumos = (items, recetas) => {
  const acumulado = {}
  for (const item of items) {
    const receta = recetas[item.nombre]
    if (!receta) continue
    for (const insumo of receta) {
      const total = insumo.cantidad * item.cantidad
      if (acumulado[insumo.nombre]) {
        acumulado[insumo.nombre].cantidad += total
      } else {
        acumulado[insumo.nombre] = { cantidad: total, unidad: insumo.unidad }
      }
    }
  }
  return Object.entries(acumulado).map(([nombre, { cantidad, unidad }]) => ({ nombre, cantidad, unidad }))
}

export const formatCantidadInsumo = (cantidad) =>
  cantidad % 1 === 0 ? cantidad : cantidad.toFixed(3).replace(/\.?0+$/, '')
