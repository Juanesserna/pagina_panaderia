import { NotFoundError, ValidationError } from '../../domain/shared/errors.js'

export class ActualizarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id, datosProducto) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }

    if (datosProducto.nombre !== undefined) existente.nombre = datosProducto.nombre;
    if (datosProducto.categoria !== undefined) existente.categoria = datosProducto.categoria;
    if (datosProducto.precio !== undefined) existente.precio = Number(datosProducto.precio);
    if (datosProducto.stock !== undefined) existente.stock = Number(datosProducto.stock);
    if (datosProducto.estado !== undefined) existente.cambiarEstado(datosProducto.estado);
    if (datosProducto.receta !== undefined) {
      if (!Array.isArray(datosProducto.receta)) {
        throw new ValidationError('La receta debe ser una lista');
      }
      existente.receta = datosProducto.receta;
    }

    existente.validar();
    return await this.productoRepository.actualizar(existente);
  }
}
