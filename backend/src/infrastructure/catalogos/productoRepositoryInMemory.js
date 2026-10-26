import { Producto } from '../../domain/productos/Producto.js';

export class ProductoRepositoryInMemory {
  constructor() {
    this.productos = [
      new Producto({ id: 1, nombre: 'Pan Baguette', categoria: 'Panadería', precio: 3500, stock: 50, estado: 'ACTIVO' }),
      new Producto({ id: 2, nombre: 'Croissant de Mantequilla', categoria: 'Repostería', precio: 4500, stock: 30, estado: 'ACTIVO' }),
      new Producto({ id: 3, nombre: 'Torta de Chocolate', categoria: 'Repostería', precio: 45000, stock: 5, estado: 'ACTIVO' })
    ];
  }

  async obtenerSiguienteId() {
    const ids = this.productos.map(p => p.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  async buscarPorId(id) {
    return this.productos.find(p => p.id === Number(id)) || null;
  }

  async buscarConFiltros({ buscar, categoria, estado, pagina, limite }) {
    let resultado = [...this.productos];

    if (buscar) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(p => p.nombre.toLowerCase().includes(termino));
    }
    if (categoria) {
      resultado = resultado.filter(p => p.categoria === categoria);
    }
    if (estado) {
      resultado = resultado.filter(p => p.estado === estado);
    }

    const total = resultado.length;
    const inicio = (pagina - 1) * limite;
    const paginados = resultado.slice(inicio, inicio + limite);

    return {
      datos: paginados,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  async guardar(producto) {
    this.productos.push(producto);
    return producto;
  }

  async actualizar(producto) {
    const index = this.productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.productos[index] = producto;
      return producto;
    }
    throw new Error('Producto no encontrado para actualizar.');
  }
}