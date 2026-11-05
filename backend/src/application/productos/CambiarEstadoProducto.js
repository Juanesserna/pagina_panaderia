import { NotFoundError } from '../../domain/shared/errors.js'

export class CambiarEstadoProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id, nuevoEstado) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }
    existente.cambiarEstado(nuevoEstado);
    return await this.productoRepository.actualizar(existente);
  }
}
