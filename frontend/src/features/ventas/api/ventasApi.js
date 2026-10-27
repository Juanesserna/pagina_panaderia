// Reemplaza a services/ventasService.js + mocks/. Única puerta de acceso a la API de ventas.
// Configura VITE_API_URL en frontend/.env (ej: http://localhost:3000/api)
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw Object.assign(new Error(body?.message ?? 'Error de red'), { code: body?.code, status: res.status })
  return body
}

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ''
}
const idUrl = (id) => id.replace('#', '')

export const ventasApi = {
  // params: { search, estado, metodo, cantidadMin, cantidadMax, totalMin, totalMax, fechaDesde, fechaHasta, sortKey, sortDir, page, pageSize }
  listar: (params = {}) => request(`/ventas${qs(params)}`),                 // → { items, total, page, pageSize }
  obtener: (id) => request(`/ventas/${idUrl(id)}`),                         // → venta + items + abonos + resumenPagos
  crear: ({ clienteNit, items, metodo, pagoDividido }) =>                   // items: [{ nombre, cantidad }]
    request('/ventas', { method: 'POST', body: JSON.stringify({ clienteNit, items, metodo, pagoDividido }) }),
  cambiarEstado: (id, estado) =>
    request(`/ventas/${idUrl(id)}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  registrarAbono: (id, slot, urlComprobante) =>
    request(`/ventas/${idUrl(id)}/pagos/${slot}`, { method: 'PUT', body: JSON.stringify({ urlComprobante }) }),
  listarClientes: () => request('/catalogos/clientes'),
  listarProductos: () => request('/catalogos/productos'),
}
