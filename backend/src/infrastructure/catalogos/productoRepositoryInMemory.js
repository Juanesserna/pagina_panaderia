import { Producto } from '../../domain/productos/Producto.js';

const lineaInsumo = (idComponente, nombre, cantidad, unidad) => ({ origen: 'INSUMO', idComponente, nombre, cantidad, unidad })
const lineaProducto = (idComponente, nombre, cantidad, unidad) => ({ origen: 'PRODUCTO', idComponente, nombre, cantidad, unidad })

export class ProductoRepositoryInMemory {
  constructor() {
    this.productos = [
      new Producto({ id: 1, nombre: 'Pan Baguette', categoria: 'Panadería', precio: 3500, stock: 50, imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800' }),
      new Producto({ id: 2, nombre: 'Croissant de Mantequilla', categoria: 'Repostería', precio: 4500, stock: 30, imagen: 'https://images.unsplash.com/photo-1555507036-ab1a63daa8c3?w=800' }),
      new Producto({ id: 3, nombre: 'Torta de Chocolate', categoria: 'Repostería', precio: 45000, stock: 5, imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800' }),

      // --- Datos de prueba de Tipo y Vendible (se borran cuando llegue la base de datos) ---
      new Producto({
        id: 4, nombre: 'Masa dulce', categoria: 'Panadería', tipo: 'INTERMEDIO', esVendible: false, precio: 0, stock: 20,
        receta: [lineaInsumo(1, 'Harina', 1, 'kg'), lineaInsumo(2, 'Azúcar', 0.2, 'kg')],
      }),
      new Producto({
        id: 5, nombre: 'Masa de buñuelos', categoria: 'Snacks', tipo: 'INTERMEDIO', esVendible: true, precio: 8000, stock: 15,
        receta: [lineaInsumo(1, 'Harina', 1, 'kg'), lineaInsumo(3, 'Queso', 0.5, 'kg')],
      }),
      new Producto({
        id: 6, nombre: 'Pastel de guayaba', categoria: 'Repostería', precio: 4500, stock: 12,
        receta: [lineaProducto(4, 'Masa dulce', 0.08, 'kg'), lineaInsumo(4, 'Bocadillo de guayaba', 0.03, 'kg')],
      }),
      new Producto({
        id: 7, nombre: 'Buñuelo frito', categoria: 'Snacks', precio: 2000, stock: 40,
        receta: [lineaProducto(5, 'Masa de buñuelos', 0.06, 'kg')],
      }),
    ];
  }

  async obtenerSiguienteId() {
    const ids = this.productos.map((p) => p.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  async buscarPorId(id) {
    return this.productos.find((p) => p.id === Number(id)) || null;
  }

  async buscarPorNombre(nombre) {
    const n = String(nombre).trim().toLowerCase();
    return this.productos.find((p) => p.nombre.trim().toLowerCase() === n) || null;
  }

  // Productos cuya receta contiene a este producto como componente
  async buscarQueUsan(idProducto) {
    return this.productos.filter((p) => p.usaComponente(idProducto));
  }

  async buscarConFiltros({ buscar, categoria, estado, tipo, esVendible, pagina, limite }) {
    const pag = Number(pagina) || 1;
    const lim = Number(limite) || 10;
    let resultado = [...this.productos];

    if (buscar) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(
        (p) => p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino),
      );
    }
    if (categoria) {
      resultado = resultado.filter((p) => p.categoria === categoria);
    }
    if (estado) {
      resultado = resultado.filter((p) => p.estadoEfectivo === estado);
    }
    if (tipo) {
      resultado = resultado.filter((p) => p.tipo === tipo);
    }
    if (esVendible !== undefined && esVendible !== '') {
      const valor = esVendible === true || esVendible === 'true';
      resultado = resultado.filter((p) => p.esVendible === valor);
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