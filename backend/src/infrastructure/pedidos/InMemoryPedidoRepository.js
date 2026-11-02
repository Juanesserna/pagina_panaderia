import { Pedido } from '../../domain/pedidos/Pedido.js'
import { initialPedidos } from './pedidos.seed.js'

export class InMemoryPedidoRepository {
  constructor(pedidos = null) {
    this.pedidos = (pedidos || initialPedidos).map((p) => (p instanceof Pedido ? p : new Pedido(p)))
  }

  async listar() {
    return [...this.pedidos]
  }

  async obtenerPorId(id) {
    const raw = String(id).replace('#PED-', '').replace('#', '').replace('PED-', '').trim()
    return (
      this.pedidos.find((p) => {
        const pRaw = String(p.id).replace('#PED-', '').replace('#', '').replace('PED-', '').trim()
        return p.id === id || pRaw === raw
      }) || null
    )
  }

  async guardar(pedido) {
    const index = this.pedidos.findIndex((p) => p.id === pedido.id)
    if (index >= 0) {
      this.pedidos[index] = pedido
    } else {
      this.pedidos.unshift(pedido)
    }
    return pedido
  }

  async siguienteId() {
    const maxNum = this.pedidos.reduce((max, p) => {
      const num = parseInt(String(p.id).replace(/\D/g, ''), 10) || 0
      return Math.max(max, num)
    }, 100)
    return String(maxNum + 1)
  }
}
