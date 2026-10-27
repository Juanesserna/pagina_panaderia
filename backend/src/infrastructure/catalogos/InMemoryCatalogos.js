// TEMPORAL: stand-ins de los futuros módulos usuarios/clientes y productos.
import { catalogoClientes, catalogoPanaderia, usuarioAutenticado } from '../ventas/ventas.seed.js'

export class InMemoryCatalogoClientes {
  async listar() { return catalogoClientes }
  async buscarPorNit(nit) { return catalogoClientes.find((c) => c.nit === nit) ?? null }
}

export class InMemoryCatalogoProductos {
  async listar() { return catalogoPanaderia.map((p) => this.#conStock(p)) }
  async buscarPorNombre(nombre) {
    const p = catalogoPanaderia.find((x) => x.nombre === nombre)
    return p ? this.#conStock(p) : null
  }
  // Simulación heredada del frontend: "Pan francés" figura agotado.
  #conStock(p) { return { ...p, stock: p.nombre === 'Pan francés' ? 0 : 50 } }
}

export const usuarioActualStub = usuarioAutenticado // debe venir de auth
