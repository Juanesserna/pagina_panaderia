// Estados que se muestran y se pueden filtrar. "Agotado" no se guarda: el backend lo calcula cuando el stock llega a cero
export const ESTADOS_PRODUCTO = ['Activo', 'Inactivo', 'Agotado']

// Estados que el gerente puede asignar manualmente
export const ESTADOS_EDITABLES = ['Activo', 'Inactivo']

// Tipos de producto (valor que viaja al backend y texto que se muestra)
export const TIPOS_PRODUCTO = [
  { value: 'TERMINADO', label: 'Terminado' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
]

export const etiquetaTipo = (tipo) => (tipo === 'INTERMEDIO' ? 'Intermedio' : 'Terminado')

// Devuelve la variante de StatusBadge según el estado del producto
export const varianteEstadoProducto = (estado) => {
  if (estado === 'Activo') return 'success'
  if (estado === 'Agotado') return 'warning'
  return 'danger' // Inactivo
}
