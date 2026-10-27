// Acceso a datos del módulo "compras".
// HOY: simula una API con los datos de mocks/ (en memoria, async).
// MAÑANA: se cambia SOLO el cuerpo de estas funciones por fetch/axios; los hooks y las pantallas no cambian.
import { initialCompras, INSUMOS, PROVEEDORES } from '../mocks/comprasMockData'
import { esTransicionValida, siguienteIdCompra } from '../utils/comprasHelpers'

const clonar = (valor) => structuredClone(valor)

let comprasDB = clonar(initialCompras)

export const comprasService = {
  async obtenerCompras() {
    return clonar(comprasDB)
  },

  async obtenerCatalogos() {
    return clonar({ proveedores: PROVEEDORES, insumos: INSUMOS })
  },

  // El id lo asigna el servicio (en la API real lo asigna el backend)
  async crearCompra(datos) {
    const nueva = { ...clonar(datos), id: siguienteIdCompra(comprasDB) }
    comprasDB = [nueva, ...comprasDB]
    return clonar(nueva)
  },

  async actualizarCompra(compra) {
    if (!comprasDB.some((c) => c.id === compra.id)) throw new Error(`La orden ${compra.id} no existe`)
    comprasDB = comprasDB.map((c) => (c.id === compra.id ? clonar(compra) : c))
    return clonar(compra)
  },

  async cambiarEstado(id, nuevoEstado) {
    const actual = comprasDB.find((c) => c.id === id)
    if (!actual) throw new Error(`La orden ${id} no existe`)
    if (!esTransicionValida(actual.estado, nuevoEstado)) {
      throw new Error(`No se puede pasar de ${actual.estado} a ${nuevoEstado}`)
    }
    const actualizada = { ...actual, estado: nuevoEstado }
    comprasDB = comprasDB.map((c) => (c.id === id ? actualizada : c))
    return clonar(actualizada)
  },

  async eliminarCompra(id) {
    comprasDB = comprasDB.filter((c) => c.id !== id)
  },
}
