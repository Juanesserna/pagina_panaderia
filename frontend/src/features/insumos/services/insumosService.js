// Llamadas a "API" del feature Insumos.
// Por ahora son mocks en memoria con delay simulado; cuando exista el
// backend real, solo hay que cambiar el cuerpo de cada función (misma firma).
import { initialCategorias, initialUnidadesMedida, initialInsumos } from '../mocks/insumosMockData'

const DELAY_MS = 300

const categorias = initialCategorias
const unidadesMedida = initialUnidadesMedida

// "Base de datos" en memoria (se pierde al recargar; es solo para maquetar).
let insumos = [...initialInsumos]

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS))
}

export function getCategorias() {
  return categorias
}

export function getUnidadesMedida() {
  return unidadesMedida
}

export function fetchInsumos() {
  return delay([...insumos])
}

export function createInsumo(data) {
  const nuevo = {
    id: insumos.length ? Math.max(...insumos.map((i) => i.id)) + 1 : 1,
    nombre: data.nombre,
    descripcion: data.descripcion,
    idCategoria: Number(data.idCategoria),
    idUnidadMedida: Number(data.idUnidadMedida),
    stockActual: 0,
    stockMinimo: Number(data.stockMinimo) || 0,
    costoPromedio: 0,
    estado: data.estado,
    lotes: [],
  }
  insumos = [...insumos, nuevo]
  return delay(nuevo)
}

export function updateInsumo(id, data) {
  insumos = insumos.map((i) =>
    i.id === id
      ? {
          ...i,
          nombre: data.nombre,
          descripcion: data.descripcion,
          idCategoria: Number(data.idCategoria),
          idUnidadMedida: Number(data.idUnidadMedida),
          stockMinimo: Number(data.stockMinimo),
          estado: data.estado,
        }
      : i
  )
  return delay(insumos.find((i) => i.id === id))
}

export function deleteInsumo(id) {
  insumos = insumos.filter((i) => i.id !== id)
  return delay(true)
}

export function changeEstadoInsumo(id, nuevoEstado) {
  insumos = insumos.map((i) => (i.id === id ? { ...i, estado: nuevoEstado } : i))
  return delay(insumos.find((i) => i.id === id))
}
