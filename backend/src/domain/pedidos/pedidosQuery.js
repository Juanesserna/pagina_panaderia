// Filtrado, orden y paginación para Pedidos
const numeroDeId = (p) => parseInt(p.id.replace('#', '').replace('PED-', ''), 10) || 0
const num = (x, parse) => { const n = parse(x, 10); return Number.isNaN(n) ? null : n }

export function filtrarPedidos(pedidos, { search, estado, metodo, canal, totalMin, totalMax, fechaDesde, fechaHasta } = {}) {
  let data = pedidos

  if (search) {
    const q = search.toLowerCase()
    data = data.filter((p) =>
      (p.usuario || '').toLowerCase().includes(q) ||
      (p.cliente || '').toLowerCase().includes(q) ||
      (p.nit || '').toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    )
  }

  // Filtrado por estado (soporta 'anulado', 'pendiente', etc.)
  if (estado) {
    data = data.filter((p) => p.estado === estado)
  }

  if (metodo) {
    data = data.filter((p) => p.metodo === metodo)
  }

  if (canal) {
    data = data.filter((p) => p.canal === canal)
  }

  const tMin = totalMin !== undefined && totalMin !== '' ? num(totalMin, parseFloat) : null
  const tMax = totalMax !== undefined && totalMax !== '' ? num(totalMax, parseFloat) : null

  if (tMin !== null) data = data.filter((p) => p.total >= tMin)
  if (tMax !== null) data = data.filter((p) => p.total <= tMax)

  if (fechaDesde) {
    const d = new Date(`${fechaDesde}T00:00:00`)
    data = data.filter((p) => new Date(p.fechaHora) >= d)
  }

  if (fechaHasta) {
    const h = new Date(`${fechaHasta}T23:59:59`)
    data = data.filter((p) => new Date(p.fechaHora) <= h)
  }

  return data
}

export function ordenarPedidos(pedidos, sortKey = 'id', sortDir = 'desc') {
  return [...pedidos].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'id') cmp = numeroDeId(a) - numeroDeId(b)
    if (sortKey === 'total') cmp = a.total - b.total
    if (sortKey === 'fecha' || sortKey === 'fechaHora') cmp = new Date(a.fechaHora) - new Date(b.fechaHora)
    return sortDir === 'asc' ? cmp : -cmp
  })
}

export function paginar(items, page = 1, pageSize = 8) {
  const p = Math.max(1, parseInt(page, 10) || 1)
  const size = Math.max(1, parseInt(pageSize, 10) || 8)
  return {
    items: items.slice((p - 1) * size, p * size),
    total: items.length,
    page: p,
    pageSize: size,
  }
}

