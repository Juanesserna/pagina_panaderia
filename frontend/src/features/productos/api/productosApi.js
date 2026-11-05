const API_BASE_URL = 'http://localhost:3000/api/productos';
import { estadoDesdeApi, estadoHaciaApi } from './estadoProducto'

const token = () => localStorage.getItem('token') || sessionStorage.getItem('token')

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

export const productosApi = {
  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const response = await fetch(`${API_BASE_URL}?${params}`, { headers: headers() });
    if (!response.ok) throw new Error('Error al obtener los productos');
    const data = await response.json();
    const productos = (data.datos || data || []).map((p) => ({
      ...p,
      precioVenta: p.precio,
      imagenUrl: p.imagen,
      codigo: p.codigo ?? `PR-${p.id}`,
      estado: estadoDesdeApi(p.estado),
    }));
    return { ...data, datos: productos };
  },

  async crearProducto(datosProducto) {
    const body = soloCamposSchema(datosProducto)
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear el producto');
    }
    return response.json();
  },

  async actualizarProducto(id, datosProducto) {
    const body = soloCamposSchema(datosProducto)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar el producto');
    }
    return response.json();
  },

  async eliminarProducto(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!response.ok) throw new Error('Error al eliminar el producto');
    return true;
  },

  async cambiarEstado(id, estado) {
    const estadoApi = estadoHaciaApi(estado);
    const response = await fetch(`${API_BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ estado: estadoApi }),
    });
    if (!response.ok) throw new Error('Error al cambiar el estado');
    return response.json();
  }
};
