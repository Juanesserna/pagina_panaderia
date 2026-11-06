// Mock temporal — reemplazar cuando exista la API de categorías.
import { COLORES_CATEGORIA } from '../constants/coloresCategoria'

export const categorias = [
  {
    id: 1,
    codigo: 'CAT-001',
    nombre: 'Panadería',
    color: COLORES_CATEGORIA.cafe,
    tipo: 'Ambos',
    productosCount: 12,
    insumosCount: 8,
    creada: '15/01/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1587912001191-0cd4f14fd89e?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 2,
    codigo: 'CAT-002',
    nombre: 'Repostería',
    color: COLORES_CATEGORIA.verde,
    tipo: 'Producto',
    productosCount: 8,
    insumosCount: 0,
    creada: '15/01/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 3,
    codigo: 'CAT-003',
    nombre: 'Snacks',
    color: COLORES_CATEGORIA.naranja,
    tipo: 'Producto',
    productosCount: 6,
    insumosCount: 0,
    creada: '20/02/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 4,
    codigo: 'CAT-004',
    nombre: 'Café y bebidas',
    color: COLORES_CATEGORIA.azul,
    tipo: 'Insumo',
    productosCount: 0,
    insumosCount: 15,
    creada: '10/03/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 5,
    codigo: 'CAT-005',
    nombre: 'Combos',
    color: COLORES_CATEGORIA.morado,
    tipo: 'Ambos',
    productosCount: 4,
    insumosCount: 2,
    creada: '05/04/2024',
    estado: 'Inactiva',
    urlImagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 6,
    codigo: 'CAT-006',
    nombre: 'Temporada',
    color: COLORES_CATEGORIA.rosado,
    tipo: 'Producto',
    productosCount: 3,
    insumosCount: 0,
    creada: '12/05/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 7,
    codigo: 'CAT-007',
    nombre: 'Sin gluten',
    color: COLORES_CATEGORIA.gris,
    tipo: 'Producto',
    productosCount: 2,
    insumosCount: 0,
    creada: '18/06/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1596665573177-92f93c2762a4?w=600&h=600&fit=crop&auto=format',
  },
  {
    id: 8,
    codigo: 'CAT-008',
    nombre: 'Empaques e insumos',
    color: COLORES_CATEGORIA.celeste,
    tipo: 'Insumo',
    productosCount: 0,
    insumosCount: 20,
    creada: '22/07/2024',
    estado: 'Activa',
    urlImagen: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop&auto=format',
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
