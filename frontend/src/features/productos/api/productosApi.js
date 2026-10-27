const API_BASE_URL = 'http://localhost:3000/api/productos';

export const productosApi = {
  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const response = await fetch(`${API_BASE_URL}?${params}`);
    if (!response.ok) throw new Error('Error al obtener los productos');
    return response.json();
  },

  async crearProducto(datosProducto) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosProducto)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear el producto');
    }
    return response.json();
  },

  async actualizarProducto(id, datosProducto) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosProducto)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar el producto');
    }
    return response.json();
  },

  async eliminarProducto(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar el producto');
    return true;
  },

  async cambiarEstado(id, estado) {
    const response = await fetch(`${API_BASE_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al cambiar el estado');
    return response.json();
  }
};