// TEMPORAL: stand-ins de los futuros módulos usuarios/clientes y productos.
import { catalogoClientes, catalogoPanaderia, usuarioAutenticado } from '../ventas/ventas.seed.js'
import { SinStockError } from '../../domain/shared/errors.js'

export class InMemoryCatalogoClientes {
  async listar() { return catalogoClientes }
  async buscarPorNit(nit) { return catalogoClientes.find((c) => c.nit === nit) ?? null }
}

export class InMemoryCatalogoProductos {
  #productos = new Map(
    // "Pan francés" figura agotado (simulación heredada del frontend)
    catalogoPanaderia.map((p) => [p.nombre, { ...p, stock: p.nombre === 'Pan francés' ? 0 : 50 }]),
  )

  async listar() { return [...this.#productos.values()].map((p) => ({ ...p })) }

  async buscarPorNombre(nombre) {
    const p = this.#productos.get(nombre)
    return p ? { ...p } : null
  }

  async descontarStock(lineas) {
    // valida todo primero para no dejar el descuento a medias
    for (const { nombre, cantidad } of lineas) {
      if ((this.#productos.get(nombre)?.stock ?? 0) < cantidad) throw new SinStockError(nombre)
    }
    for (const { nombre, cantidad } of lineas) this.#productos.get(nombre).stock -= cantidad
  }
}

export const usuarioActualStub = usuarioAutenticado // debe venir de auth