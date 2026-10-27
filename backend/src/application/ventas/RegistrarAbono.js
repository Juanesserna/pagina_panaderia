import { NotFoundError } from '../../domain/ventas/errors.js'

export class RegistrarAbono {
  constructor({ ventaRepository, reloj = () => new Date() }) { Object.assign(this, { ventaRepository, reloj }) }
  async execute({ id, slot, urlComprobante }) {
    const venta = await this.ventaRepository.obtenerPorId(id)
    if (!venta) throw new NotFoundError(`Venta ${id} no existe`)
    venta.registrarAbono({ slot, urlComprobante, fecha: this.reloj() })
    await this.ventaRepository.guardar(venta)
    return venta
  }
}
