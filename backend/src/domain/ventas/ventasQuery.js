// Filtrado, orden y paginación (antes: utils/ventasFiltros.js + paginación de useVentasFiltros).
const numeroDeId = (v) => parseInt(v.id.replace('#', ''), 10)
const num = (x, parse) => { const n = parse(x, 10); return Number.isNaN(n) ? null : n }

export function filtrarVentas(ventas, { search, estado, metodo, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta } = {}) {
  let data = ventas
  if (search) {
    const q = search.toLowerCase()
    data = data.filter((v) => v.usuario.toLowerCase().includes(q) || (v.cliente ?? '').toLowerCase().includes(q) || v.id.includes(search))
  }
  if (estado) data = data.filter((v) => v.estado === estado)
  if (metodo) data = data.filter((v) => v.metodo === metodo)
  const cMin = cantidadMin !== undefined && cantidadMin !== '' ? num(cantidadMin, parseInt) : null
  const cMax = cantidadMax !== undefined && cantidadMax !== '' ? num(cantidadMax, parseInt) : null
  const tMin = totalMin !== undefined && totalMin !== '' ? num(totalMin, parseFloat) : null
  const tMax = totalMax !== undefined && totalMax !== '' ? num(totalMax, parseFloat) : null
  if (cMin !== null) data = data.filter((v) => v.productos >= cMin)
  if (cMax !== null) data = data.filter((v) => v.productos <= cMax)
  if (tMin !== null) data = data.filter((v) => v.total >= tMin)
  if (tMax !== null) data = data.filter((v) => v.total <= tMax)
  if (fechaDesde) { const d = new Date(`${fechaDesde}T00:00:00`); data = data.filter((v) => v.fechaHora >= d) }
  if (fechaHasta) { const h = new Date(`${fechaHasta}T23:59:59`); data = data.filter((v) => v.fechaHora <= h) }
  return data
}

export function ordenarVentas(ventas, sortKey = 'id', sortDir = 'desc') {
  return [...ventas].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'id') cmp = numeroDeId(a) - numeroDeId(b)
    if (sortKey === 'total') cmp = a.total - b.total
    return sortDir === 'asc' ? cmp : -cmp
  })
}

export function paginar(items, page = 1, pageSize = 8) {
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize }
}
