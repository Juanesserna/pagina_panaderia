import { NotFoundError } from '../../domain/shared/errors.js'

export class RegistrarAbonoPedido {
  constructor({ pedidoRepository, reloj = () => new Date() }) {
    Object.assign(this, { pedidoRepository, reloj })
  }

  async execute({ id, slot = 1, urlComprobante, monto }) {
    const pedido = await this.pedidoRepository.obtenerPorId(id)
    if (!pedido) {
      throw new NotFoundError(`Pedido ${id} no encontrado`)
    }

    pedido.registrarAbono({
      slot,
      urlComprobante,
      monto,
      fecha: this.reloj(),
    })

    await this.pedidoRepository.guardar(pedido)
    return pedido
  }
}

