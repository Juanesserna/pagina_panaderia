import { Producto } from '../../domain/productos/Producto.js';

export class ProductoRepositoryInMemory {
  constructor() {
    this.productos = [
      new Producto({ id: 1, nombre: 'Pan Baguette', categoria: 'Panadería', precio: 3500, stock: 50, estado: 'ACTIVO', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', receta: [] }),
      new Producto({ id: 2, nombre: 'Croissant de Mantequilla', categoria: 'Repostería', precio: 4500, stock: 30, estado: 'ACTIVO', imagen: 'https://images.unsplash.com/photo-1555507036-ab1a63daa8c3?w=800', receta: [] }),
      new Producto({ id: 3, nombre: 'Torta de Chocolate', categoria: 'Repostería', precio: 45000, stock: 5, estado: 'ACTIVO', imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', receta: [] }),
    ];
  }

  async obtenerSiguienteId() {
    const ids = this.productos.map((p) => p.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  async buscarPorId(id) {
    return this.productos.find((p) => p.id === Number(id)) || null;
  }

  async buscarConFiltros({ buscar, categoria, estado, pagina, limite }) {
    const pag = Number(pagina) || 1;
    const lim = Number(limite) || 10;
    let resultado = [...this.productos];

    if (buscar) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(termino));
    }
    if (categoria) {
      resultado = resultado.filter((p) => p.categoria === categoria);
    }
    if (estado) {
      resultado = resultado.filter((p) => p.estado === estado);
    }

    const total = resultado.length;
    const inicio = (pag - 1) * lim;
    return {
      datos: resultado.slice(inicio, inicio + lim),
      total,
      pagina: pag,
      totalPaginas: Math.ceil(total / lim),
    };
  }

  async guardar(producto) {
    this.productos.push(producto);
    return producto;
  }

  async actualizar(producto) {
    const index = this.productos.findIndex((p) => p.id === producto.id);
    if (index === -1) {
      throw new Error('Producto no encontrado para actualizar.');
    }
    this.productos[index] = producto;
    return producto;
  }

  async eliminar(id) {
    const index = this.productos.findIndex((p) => p.id === Number(id));
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    this.productos.splice(index, 1);
  }
}

