export class Producto {
  constructor({ id, nombre, categoria, precio, stock, estado = 'ACTIVO', receta = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = Number(precio);
    this.stock = Number(stock);
    this.estado = estado;
    this.receta = receta; // Lista de insumos/ingredientes

    this.validar();
  }

  validar() {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error('El nombre del producto es obligatorio.');
    }
    if (isNaN(this.precio) || this.precio < 0) {
      throw new Error('El precio del producto debe ser un número válido mayor o igual a 0.');
    }
    if (isNaN(this.stock) || this.stock < 0) {
      throw new Error('El stock debe ser un número entero mayor o igual a 0.');
    }
  }

  cambiarEstado(nuevoEstado) {
    const estadosValidos = ['ACTIVO', 'INACTIVO', 'AGOTADO'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado no válido. Permitidos: ${estadosValidos.join(', ')}`);
    }
    this.estado = nuevoEstado;
  }

  actualizarStock(cantidad) {
    const nuevoStock = this.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente para realizar la operación.');
    }
    this.stock = nuevoStock;
    if (this.stock === 0) {
      this.estado = 'AGOTADO';
    }
  }
}