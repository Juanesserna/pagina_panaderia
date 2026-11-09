const API_BASE_URL = 'http://localhost:3000/api/productos';
import { estadoDesdeApi, estadoHaciaApi } from './estadoProducto'

const token = () => localStorage.getItem('token') || sessionStorage.getItem('token')

// SOLO DESARROLLO: el login del frontend es simulado y no guarda token.
// Mientras tanto, se pide uno real al backend con las credenciales de ejemplo.
// Reemplazar cuando el módulo auth guarde el token real.
const AUTH_URL = 'http://localhost:3000/api/auth/login'
const DEV_CREDENCIALES = { email: 'admin@alhorno.local', password: 'cambiar_en_local' }
let pendienteLogin = null
const obtenerTokenDev = () => {
  if (!import.meta.env.DEV) return Promise.resolve(null)
  if (!pendienteLogin) {
    pendienteLogin = fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEV_CREDENCIALES),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.token) localStorage.setItem('token', d.token)
        return d?.token ?? null
      })
      .catch(() => null)
      .finally(() => { pendienteLogin = null })
  }
  return pendienteLogin
}
// fetch autenticado: si no hay token, o la respuesta es 401, pide uno y reintenta una vez
const fetchAuth = async (url, opciones = {}) => {
  if (!token()) await obtenerTokenDev()
  let res = await fetch(url, { ...opciones, headers: headers(opciones.headers) })
  if (res.status === 401 && import.meta.env.DEV) {
    localStorage.removeItem('token')
    if (await obtenerTokenDev()) {
      res = await fetch(url, { ...opciones, headers: headers(opciones.headers) })
    }
  }
  return res
}

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
  ...extra,
})

const soloCamposSchema = (datosProducto) => {
  const estadoApi = estadoHaciaApi(datosProducto.estado)
  const body = {
    nombre: datosProducto.nombre,
    categoria: datosProducto.categoria,
    precio: datosProducto.precioVenta,
    stock: datosProducto.stockActual ?? datosProducto.stock,
    estado: estadoApi,
  }
  if (datosProducto.receta) body.receta = datosProducto.receta
  const imagen = datosProducto.imagen ?? datosProducto.imagenUrl
  if (imagen && /^https?:\/\//.test(imagen)) body.imagen = imagen
  return body
}

const mapearProductoLeido = (p) => ({
  ...p,
  precioVenta: p.precio,
  imagenUrl: p.imagen,
  codigo: p.codigo ?? `PR-${p.id}`,
  estado: estadoDesdeApi(p.estado),
})

const extraerErrorBackend = async (response) => {
  let cuerpo
  try {
    cuerpo = await response.json()
  } catch {
    cuerpo = {}
  }
  if (response.status === 401) {
    return new Error('Tu sesión expiró. Inicia sesión de nuevo.')
  }
  if (!response.ok && !cuerpo) {
    return new Error('No se pudo conectar con el servidor.')
  }
  const detalles = cuerpo.details ? ` (${cuerpo.details.map((d) => `${d.campo}: ${d.mensaje}`).join(', ')})` : ''
  return new Error(`${cuerpo.message || 'Error en la petición'}${detalles}`)
}

export const productosApi = {
  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const response = await fetchAuth(`${API_BASE_URL}?${params}`);
    if (!response.ok) {
      throw await extraerErrorBackend(response)
    }
    const data = await response.json();
    const lista = data.items || data.datos || (Array.isArray(data) ? data : []);
    const productos = lista.map(mapearProductoLeido);
    return { ...data, datos: productos };
  },

  async crearProducto(datosProducto) {
    const body = soloCamposSchema(datosProducto)
    const response = await fetchAuth(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw await extraerErrorBackend(response)
    }
    return mapearProductoLeido(await response.json());
  },

  async actualizarProducto(id, datosProducto) {
    const body = soloCamposSchema(datosProducto)
    const response = await fetchAuth(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw await extraerErrorBackend(response)
    }
    return mapearProductoLeido(await response.json());
  },

  async eliminarProducto(id) {
    const response = await fetchAuth(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw await extraerErrorBackend(response)
    }
    return true;
  },

  async cambiarEstado(id, estado) {
    const estadoApi = estadoHaciaApi(estado);
    const response = await fetchAuth(`${API_BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: estadoApi }),
    });
    if (!response.ok) {
      throw await extraerErrorBackend(response)
    }
    return mapearProductoLeido(await response.json());
  }
};
