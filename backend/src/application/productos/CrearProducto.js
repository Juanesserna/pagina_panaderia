import { Producto } from '../../domain/productos/Producto.js';
import { validarNombreUnico, validarComponentes } from './validacionesProducto.js';

export class CrearProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(datosProducto) {
    const siguienteId = await this.productoRepository.obtenerSiguienteId();
    const nuevoProducto = new Producto({ id: siguienteId, ...datosProducto });

    await validarNombreUnico(this.productoRepository, nuevoProducto.nombre);
    await validarComponentes(this.productoRepository, nuevoProducto);

    return await this.productoRepository.guardar(nuevoProducto);
  }
}