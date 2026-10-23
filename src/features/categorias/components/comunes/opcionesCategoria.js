// Tipos y estados de las categorías (valores exactos que usa el mock)
export const TIPOS_CATEGORIA = ['Producto', 'Insumo', 'Ambos']
export const ESTADOS_CATEGORIA = ['Activa', 'Inactiva']

// Textos del filtro "sin filtrar"
export const FILTRO_TODOS_TIPOS = 'Todos los tipos'
export const FILTRO_TODAS_ESTADOS = 'Todas'

// Variante de StatusBadge según el estado (mismo criterio que productos)
export const varianteEstadoCategoria = (estado) => (estado === 'Activa' ? 'success' : 'danger')

// Variante de StatusBadge según el tipo
export const varianteTipoCategoria = (tipo) => {
  if (tipo === 'Insumo') return 'warning'
  if (tipo === 'Ambos') return 'process'
  return 'info'
}