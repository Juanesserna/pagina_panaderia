import { useMemo, useState } from 'react'
import { PAGE_SIZE } from '../constants/ventas.constants'
import { FILTROS_INICIALES, contarFiltrosActivos, filtrarVentas, ordenarVentas } from '../utils/ventasFiltros'

// Búsqueda, filtros, orden y paginación del listado.
export function useVentasFiltros(ventas) {
  const [search, setSearchState] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const setSearch = (value) => {
    setSearchState(value)
    setPage(1)
  }

  const setFiltro = (key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES)
    setPage(1)
  }

  const toggleFiltros = () => setMostrarFiltros((v) => !v)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtradas = useMemo(
    () => ordenarVentas(filtrarVentas(ventas, search, filtros), sortKey, sortDir),
    [ventas, search, filtros, sortKey, sortDir]
  )

  const paginadas = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const cantidadFiltrosActivos = contarFiltrosActivos(filtros)

  return {
    search,
    setSearch,
    filtros,
    setFiltro,
    limpiarFiltros,
    mostrarFiltros,
    toggleFiltros,
    cantidadFiltrosActivos,
    filtrosActivos: cantidadFiltrosActivos > 0,
    sortKey,
    sortDir,
    handleSort,
    page,
    setPage,
    total: filtradas.length,
    paginadas,
  }
}
