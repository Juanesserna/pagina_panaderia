// Mock temporal — reemplazar cuando exista la API de productos.

export const productos = [
  {
    id: 1,
    codigo: 'P-0001',
    nombre: 'Baguette Francés',
    categoria: 'Pan Artesanal',
    precioVenta: 4500,
    stock: 24,
    estado: 'Activo',
    imagenUrl: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=100',
  },
  {
    id: 2,
    codigo: 'P-0002',
    nombre: 'Croissant de Mantequilla',
    categoria: 'Pastelería',
    precioVenta: 8900,
    stock: 18,
    estado: 'Activo',
    imagenUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100',
  },
  {
    id: 3,
    codigo: 'P-0003',
    nombre: 'Pan de Campo',
    categoria: 'Pan Artesanal',
    precioVenta: 6200,
    stock: 15,
    estado: 'Activo',
    imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100',
  },
  {
    id: 4,
    codigo: 'P-0004',
    nombre: 'Torta de Chocolate',
    categoria: 'Tortas',
    precioVenta: 28500,
    stock: 8,
    estado: 'Activo',
    imagenUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100',
  },
  {
    id: 5,
    codigo: 'P-0005',
    nombre: 'Pan de Muerto',
    categoria: 'Pan Artesanal',
    precioVenta: 9500,
    stock: 0,
    estado: 'Agotado',
    imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100',
  },
  {
    id: 6,
    codigo: 'P-0006',
    nombre: 'Café de Origen',
    categoria: 'Bebidas',
    precioVenta: 7500,
    stock: 12,
    estado: 'Activo',
    imagenUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=100',
  },
]

export const productosService = {
  getAll: () => productos,
  getProductosActivos: () => productos.filter((p) => p.estado === 'Activo').length,
  getAgotados: () => productos.filter((p) => p.estado === 'Agotado').length,
}

export const resumenStats = {
  productosActivos: 5,
  variacionActivos: '+5.6% vs. mes anterior',
  agotados: 1,
  variacionAgotados: '+0% vs. mes anterior',
}

export function formatPrice(value) {
  return `$${value.toLocaleString('es-CO')}`
}

export default productosService
