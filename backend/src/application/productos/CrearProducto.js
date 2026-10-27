import { Producto } from '../../domain/productos/Producto.js';

export class CrearProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(datosProducto) {
    const siguienteId = await this.productoRepository.obtenerSiguienteId();
    const nuevoProducto = new Producto({
      id: siguienteId,
      ...datosProducto
    });

    return await this.productoRepository.guardar(nuevoProducto);
  }
}