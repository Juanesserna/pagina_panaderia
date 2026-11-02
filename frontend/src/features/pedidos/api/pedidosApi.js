const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(body?.message ?? 'Error en la petición de pedidos')
    error.code = body?.code
    error.status = res.status
    error.details = body?.details
    throw error
  }
  return body
}

const qs = (params) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  const s = new URLSearchParams(clean).toString()
  return s ? `?${s}` : ''
}

const idUrl = (id) => encodeURIComponent((id || '').replace('#', ''))

export const pedidosApi = {
  listar: (params = {}) => request(`/pedidos${qs(params)}`),
  obtener: (id) => request(`/pedidos/${idUrl(id)}`),
  crear: (data) => request('/pedidos', { method: 'POST', body: JSON.stringify(data) }),
  cambiarEstado: (id, estado, motivo) =>
    request(`/pedidos/${idUrl(id)}/estado`, { method: 'PATCH', body: JSON.stringify({ estado, motivo }) }),
  registrarAbono: (id, slot, urlComprobante, monto) =>
    request(`/pedidos/${idUrl(id)}/pagos/${slot}`, { method: 'PUT', body: JSON.stringify({ urlComprobante, monto }) }),
  listarCatalogos: async () => {
    const [clientes, productos] = await Promise.all([
      request('/catalogos/clientes').catch(() => []),
      request('/catalogos/productos').catch(() => []),
    ])
    return { clientes, productos }
  },
}

