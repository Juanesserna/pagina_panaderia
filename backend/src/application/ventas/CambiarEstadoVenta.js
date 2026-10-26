import { NotFoundError } from '../../domain/ventas/errors.js'

export class CambiarEstadoVenta {
  constructor({ ventaRepository }) { this.ventaRepository = ventaRepository }
  async execute({ id, estado }) {
    const venta = await this.ventaRepository.obtenerPorId(id)
    if (!venta) throw new NotFoundError(`Venta ${id} no existe`)
    venta.cambiarEstado(estado)
    await this.ventaRepository.guardar(venta)
    return venta
  }
}
