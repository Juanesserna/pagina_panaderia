import { NotFoundError } from '../../domain/ventas/errors.js'

export class ObtenerVenta {
  constructor({ ventaRepository }) { this.ventaRepository = ventaRepository }
  async execute({ id }) {
    const venta = await this.ventaRepository.obtenerPorId(id)
    if (!venta) throw new NotFoundError(`Venta ${id} no existe`)
    return venta
  }
}
