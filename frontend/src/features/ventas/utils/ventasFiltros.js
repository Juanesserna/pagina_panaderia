// Filtrado y ordenamiento del listado de ventas (funciones puras).
import { parseFechaVenta } from './ventasHelpers'

export const FILTROS_INICIALES = {
  estado: '',
  metodo: '',
  cantidadMin: '',
  cantidadMax: '',
  totalMin: '',
  totalMax: '',
  fechaDesde: '',
  fechaHasta: '',
}

export const contarFiltrosActivos = (filtros) => Object.values(filtros).filter(Boolean).length

export function filtrarVentas(ventas, search, filtros) {
  let data = ventas

  if (search) {
    const q = search.toLowerCase()
    data = data.filter(
      (v) => v.usuario.toLowerCase().includes(q) || (v.cliente ?? '').toLowerCase().includes(q) || v.id.includes(search)
    )
  }
  if (filtros.estado) data = data.filter((v) => v.estado === filtros.estado)
  if (filtros.metodo) data = data.filter((v) => v.metodo === filtros.metodo)

  if (filtros.cantidadMin !== '') {
    const min = parseInt(filtros.cantidadMin, 10)
    if (!isNaN(min)) data = data.filter((v) => v.productos >= min)
  }
  if (filtros.cantidadMax !== '') {
    const max = parseInt(filtros.cantidadMax, 10)
    if (!isNaN(max)) data = data.filter((v) => v.productos <= max)
  }
  if (filtros.totalMin !== '') {
    const min = parseFloat(filtros.totalMin)
    if (!isNaN(min)) data = data.filter((v) => v.total >= min)
  }
  if (filtros.totalMax !== '') {
    const max = parseFloat(filtros.totalMax)
    if (!isNaN(max)) data = data.filter((v) => v.total <= max)
  }
  if (filtros.fechaDesde) {
    const desde = new Date(`${filtros.fechaDesde}T00:00:00`)
    data = data.filter((v) => parseFechaVenta(v) >= desde)
  }
  if (filtros.fechaHasta) {
    const hasta = new Date(`${filtros.fechaHasta}T23:59:59`)
    data = data.filter((v) => parseFechaVenta(v) <= hasta)
  }
  return data
}

const numeroDeId = (venta) => parseInt(venta.id.replace('#', ''), 10)

export function ordenarVentas(ventas, sortKey, sortDir) {
  return [...ventas].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'id') cmp = numeroDeId(a) - numeroDeId(b)
    if (sortKey === 'total') cmp = a.total - b.total
    return sortDir === 'asc' ? cmp : -cmp
  })
}
