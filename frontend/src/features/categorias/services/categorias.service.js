// Mock temporal — reemplazar cuando exista la API de categorías.
import { COLORES_CATEGORIA } from '../constants/coloresCategoria'

export const categorias = [
  {
    id: 1,
    nombre: 'Panadería',
    color: COLORES_CATEGORIA.cafe,
    tipo: 'Ambos',
    productosCount: 12,
    insumosCount: 8,
    creada: '15/01/2024',
    estado: 'Activa',
  },
  {
    id: 2,
    nombre: 'Repostería',
    color: COLORES_CATEGORIA.verde,
    tipo: 'Producto',
    productosCount: 8,
    insumosCount: 0,
    creada: '15/01/2024',
    estado: 'Activa',
  },
  {
    id: 3,
    nombre: 'Snacks',
    color: COLORES_CATEGORIA.naranja,
    tipo: 'Producto',
    productosCount: 6,
    insumosCount: 0,
    creada: '20/02/2024',
    estado: 'Activa',
  },
  {
    id: 4,
    nombre: 'Café y bebidas',
    color: COLORES_CATEGORIA.azul,
    tipo: 'Insumo',
    productosCount: 0,
    insumosCount: 15,
    creada: '10/03/2024',
    estado: 'Activa',
  },
  {
    id: 5,
    nombre: 'Combos',
    color: COLORES_CATEGORIA.morado,
    tipo: 'Ambos',
    productosCount: 4,
    insumosCount: 2,
    creada: '05/04/2024',
    estado: 'Inactiva',
  },
  {
    id: 6,
    nombre: 'Temporada',
    color: COLORES_CATEGORIA.rosado,
    tipo: 'Producto',
    productosCount: 3,
    insumosCount: 0,
    creada: '12/05/2024',
    estado: 'Activa',
  },
  {
    id: 7,
    nombre: 'Sin gluten',
    color: COLORES_CATEGORIA.gris,
    tipo: 'Producto',
    productosCount: 2,
    insumosCount: 0,
    creada: '18/06/2024',
    estado: 'Activa',
  },
  {
    id: 8,
    nombre: 'Empaques e insumos',
    color: COLORES_CATEGORIA.celeste,
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

export default categoriasService