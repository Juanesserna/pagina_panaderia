import { NotFoundError } from '../../domain/shared/errors.js'

export class CambiarEstadoPedido {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository
  }

  async execute({ id, estado, usuario = 'Usuario', motivo = '' }) {
    const pedido = await this.pedidoRepository.obtenerPorId(id)
    if (!pedido) {
      throw new NotFoundError(`Pedido ${id} no encontrado`)
    }

    // El método cambiarEstado lanzará TransicionInvalidaError si está en 'anulado'
    // o si la transición no está permitida.
    pedido.cambiarEstado(estado, { usuario, motivo })
    await this.pedidoRepository.guardar(pedido)
    return pedido
  }
}

