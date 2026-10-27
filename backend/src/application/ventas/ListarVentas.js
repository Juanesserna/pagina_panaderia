import { filtrarVentas, ordenarVentas, paginar } from '../../domain/ventas/ventasQuery.js'

export class ListarVentas {
  constructor({ ventaRepository }) { this.ventaRepository = ventaRepository }
  async execute(query = {}) {
    const { sortKey, sortDir, page = 1, pageSize = 8, ...filtros } = query
    const todas = await this.ventaRepository.listar()
    return paginar(ordenarVentas(filtrarVentas(todas, filtros), sortKey, sortDir), Number(page), Number(pageSize))
  }
}
