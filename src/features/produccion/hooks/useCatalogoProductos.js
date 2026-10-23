// TEMPORAL: datos de ejemplo. Cuando exista el service, este es el único punto a cambiar
// (por ejemplo, a un fetch/react-query) sin tocar los componentes.
import { catalogoProductos, recetasProductos } from '@features/produccion/mocks/produccionMockData'

export function useCatalogoProductos() {
  return { catalogo: catalogoProductos, recetas: recetasProductos }
}
