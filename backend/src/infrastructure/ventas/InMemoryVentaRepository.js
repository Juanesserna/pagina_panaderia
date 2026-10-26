// Implementa el puerto VentaRepository en memoria. Reemplazable por Postgres/Mongo sin tocar domain/application.
import { Venta } from '../../domain/ventas/Venta.js'
import { initialVentas, obtenerProductosVenta } from './ventas.seed.js'

const parseFechaHora = (fecha, hora = '00:00') => {
  const [d, m, y] = fecha.split('/').map(Number)
  const [hh, mm] = hora.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export class InMemoryVentaRepository {
  constructor(seed = initialVentas) {
    this.ventas = new Map(
      seed.map(({ fecha, hora, ...v }) => {
        const venta = new Venta({ ...v, fechaHora: parseFechaHora(fecha, hora), items: obtenerProductosVenta(v) })
        return [venta.id, venta]
      })
    )
  }
  async listar() { return [...this.ventas.values()] }
  async obtenerPorId(id) { return this.ventas.get(id) ?? null }
  async guardar(venta) { this.ventas.set(venta.id, venta) }
  async siguienteId() {
    const max = [...this.ventas.keys()].reduce((m, id) => Math.max(m, parseInt(id.replace('#', ''), 10) || 0), 0)
    return `#${max + 1}`
  }
}
