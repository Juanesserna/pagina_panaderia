// Categorías disponibles para los productos
export const CATEGORIAS_PRODUCTO = ['Pan Artesanal', 'Pastelería', 'Tortas', 'Bebidas']

// Estados disponibles para los productos
export const ESTADOS_PRODUCTO = ['Activo', 'Agotado']

// Devuelve la variante de StatusBadge según el estado del producto
export const varianteEstadoProducto = (estado) => (estado === 'Activo' ? 'success' : 'danger')
