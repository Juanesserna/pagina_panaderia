// Acceso a datos del módulo "compras".
// HOY: simula una API con los datos de mocks/ (en memoria, async).
// MAÑANA: se cambia SOLO el cuerpo de estas funciones por fetch/axios; los hooks y las pantallas no cambian.
import { initialCompras, INSUMOS, PROVEEDORES } from '../mocks/comprasMockData'
import { esTransicionValida, siguienteIdCompra } from '../utils/comprasHelpers'

const clonar = (valor) => structuredClone(valor)

let comprasDB = clonar(initialCompras)
let proveedoresDB = clonar(PROVEEDORES)
let insumosDB = clonar(INSUMOS)

export const comprasService = {
  async obtenerCompras() {
    return clonar(comprasDB)
  },

  async obtenerCatalogos() {
    return clonar({ proveedores: proveedoresDB, insumos: insumosDB })
  },

  async crearProveedor(datos) {
    const maxNum = proveedoresDB.reduce((max, p) => Math.max(max, parseInt(String(p.id).replace(/\D/g, ''), 10) || 0), 0)
    const nuevo = {
      id: `PROV-${String(maxNum + 1).padStart(3, '0')}`,
      nombre: datos.nombre,
    }
    proveedoresDB = [...proveedoresDB, nuevo]
    return clonar(nuevo)
  },

  async crearInsumo(datos) {
    const nuevo = {
      nombre: datos.nombre,
      unidad: datos.unidad,
      categoria: datos.categoria,
    }
    insumosDB = [...insumosDB, nuevo]
    return clonar(nuevo)
  },

  // El id lo asigna el servicio (en la API real lo asigna el backend)
  async crearCompra(datos) {
    const nueva = { ...clonar(datos), id: siguienteIdCompra(comprasDB) }
    comprasDB = [nueva, ...comprasDB]
    return clonar(nueva)
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
