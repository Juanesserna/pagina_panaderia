import { NotFoundError } from '../../domain/shared/errors.js'
import { validarQueNoSeUsaComoComponente } from './validacionesProducto.js'

export class EliminarProducto {
  constructor({ productoRepository }) {
    this.productoRepository = productoRepository;
  }

  async execute(id) {
    const existente = await this.productoRepository.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError('Producto no encontrado');
    }
    // Pendiente: dependencias con ventas y pedidos (paso B7)
    await validarQueNoSeUsaComoComponente(this.productoRepository, existente);
    await this.productoRepository.eliminar(id);
  }
}