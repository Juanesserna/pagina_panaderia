import { NotFoundError } from '../../domain/shared/errors.js'

export class ObtenerPedido {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository
  }

  async execute({ id }) {
    const pedido = await this.pedidoRepository.obtenerPorId(id)
    if (!pedido) {
      throw new NotFoundError(`Pedido ${id} no encontrado`)
    }
    return pedido
  }
}

