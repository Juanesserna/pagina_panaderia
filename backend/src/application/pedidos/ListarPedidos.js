import { filtrarPedidos, ordenarPedidos, paginar } from '../../domain/pedidos/pedidosQuery.js'

export class ListarPedidos {
  constructor({ pedidoRepository }) {
    this.pedidoRepository = pedidoRepository
  }

  async execute(query = {}) {
    const todos = await this.pedidoRepository.listar()
    const filtrados = filtrarPedidos(todos, query)
    const ordenados = ordenarPedidos(filtrados, query.sortKey || 'id', query.sortDir || 'desc')
    return paginar(ordenados, query.page || 1, query.pageSize || 8)
  }
}

