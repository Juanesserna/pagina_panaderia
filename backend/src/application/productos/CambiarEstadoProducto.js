import { NotFoundError } from '../../domain/shared/errors.js'
import { validarQueNoSeInactivaEnUso } from './validacionesProducto.js'

export class CambiarEstadoProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id, nuevoEstado) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }
    if (nuevoEstado === 'INACTIVO' && existente.estado !== 'INACTIVO') {
      await validarQueNoSeInactivaEnUso(this.productoRepository, existente);
    }
    existente.cambiarEstado(nuevoEstado);
    return await this.productoRepository.actualizar(existente);
  }
}