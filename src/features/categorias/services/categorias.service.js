// Mock temporal — reemplazar cuando exista la API de categorías.

export const categorias = [
  {
    id: 1,
    nombre: 'Panadería',
    color: '#8B5E3C', // café
    tipo: 'Ambos',
    productosCount: 12,
    insumosCount: 8,
    creada: '15/01/2024',
    estado: 'Activa',
  },
  {
    id: 2,
    nombre: 'Repostería',
    color: '#4A7C59', // verde
    tipo: 'Producto',
    productosCount: 8,
    insumosCount: 0,
    creada: '15/01/2024',
    estado: 'Activa',
  },
  {
    id: 3,
    nombre: 'Snacks',
    color: '#E8A838', // naranja
    tipo: 'Producto',
    productosCount: 6,
    insumosCount: 0,
    creada: '20/02/2024',
    estado: 'Activa',
  },
  {
    id: 4,
    nombre: 'Café y bebidas',
    color: '#3B82F6', // azul
    tipo: 'Insumo',
    productosCount: 0,
    insumosCount: 15,
    creada: '10/03/2024',
    estado: 'Activa',
  },
  {
    id: 5,
    nombre: 'Combos',
    color: '#9B59B6', // morado
    tipo: 'Ambos',
    productosCount: 4,
    insumosCount: 2,
    creada: '05/04/2024',
    estado: 'Inactiva',
  },
  {
    id: 6,
    nombre: 'Temporada',
    color: '#E91E63', // rosado
    tipo: 'Producto',
    productosCount: 3,
    insumosCount: 0,
    creada: '12/05/2024',
    estado: 'Activa',
  },
  {
    id: 7,
    nombre: 'Sin gluten',
    color: '#9E9E9E', // gris
    tipo: 'Producto',
    productosCount: 2,
    insumosCount: 0,
    creada: '18/06/2024',
    estado: 'Activa',
  },
  {
    id: 8,
    nombre: 'Empaques e insumos',
    color: '#00BCD4', // celeste
    tipo: 'Insumo',
    productosCount: 0,
    insumosCount: 20,
    creada: '22/07/2024',
    estado: 'Activa',
  },
]

export const categoriasService = {
  getAll: () => categorias,
  getActivas: () => categorias.filter((c) => c.estado === 'Activa').length,
  getInactivas: () => categorias.filter((c) => c.estado === 'Inactiva').length,
  updateCategoria(id, datosActualizados) {
    const index = categorias.findIndex((c) => c.id === id)
    if (index === -1) return null
    categorias[index] = { ...categorias[index], ...datosActualizados }
    return categorias[index]
  },
}

export const resumenStats = {
  total: categorias.length,
  activas: categorias.filter((c) => c.estado === 'Activa').length,
  inactivas: categorias.filter((c) => c.estado === 'Inactiva').length,
  tipos: {
    ambos: categorias.filter((c) => c.tipo === 'Ambos').length,
    producto: categorias.filter((c) => c.tipo === 'Producto').length,
    insumo: categorias.filter((c) => c.tipo === 'Insumo').length,
  },
}

export function formatDate(value) {
  return value
}

export default categoriasService