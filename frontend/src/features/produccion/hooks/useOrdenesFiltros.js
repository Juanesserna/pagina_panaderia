import { useState, useMemo } from 'react'
import { PAGE_SIZE } from '@features/produccion/constants/produccion.constants'
import { estadoEfectivo, parseFechaSolicitud, totalCantidad } from '@features/produccion/utils/produccionHelpers'

// Búsqueda, filtros avanzados y paginación del listado. Cada cambio de filtro vuelve a la página 1.
export function useOrdenesFiltros(ordenes) {
  const [page, setPage] = useState(1)
  const [search, setSearchState] = useState('')
  const [estadoFilter, setEstadoState] = useState('')
  const [origenFilter, setOrigenState] = useState('')
  const [fechaDesde, setFechaDesdeState] = useState('')
  const [fechaHasta, setFechaHastaState] = useState('')
  const [cantidadMin, setCantidadMinState] = useState('')
  const [cantidadMax, setCantidadMaxState] = useState('')

  const conReset = (setter) => (valor) => {
    setter(valor)
    setPage(1)
  }

  const filtered = useMemo(() => {
    let data = ordenes
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (o) =>
          o.producto.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.generadoPor.documento.toLowerCase().includes(q) ||
          o.items.some((i) => i.nombre.toLowerCase().includes(q))
      )
    }
    if (estadoFilter) data = data.filter((o) => estadoEfectivo(o) === estadoFilter)
    if (origenFilter) data = data.filter((o) => o.producto === origenFilter)
    if (fechaDesde) {
      const desde = new Date(`${fechaDesde}T00:00:00`)
      data = data.filter((o) => parseFechaSolicitud(o.fechaSolicitud) >= desde)
    }
    if (fechaHasta) {
      const hasta = new Date(`${fechaHasta}T23:59:59`)
      data = data.filter((o) => parseFechaSolicitud(o.fechaSolicitud) <= hasta)
    }
    if (cantidadMin !== '') {
      const min = parseInt(cantidadMin, 10)
      if (!isNaN(min)) data = data.filter((o) => totalCantidad(o) >= min)
    }
    if (cantidadMax !== '') {
      const max = parseInt(cantidadMax, 10)
      if (!isNaN(max)) data = data.filter((o) => totalCantidad(o) <= max)
    }
    return data
  }, [ordenes, search, estadoFilter, origenFilter, fechaDesde, fechaHasta, cantidadMin, cantidadMax])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const valoresFiltros = [estadoFilter, origenFilter, fechaDesde, fechaHasta, cantidadMin, cantidadMax]
  const filtrosActivos = valoresFiltros.some(Boolean)
  const cantidadFiltrosActivos = valoresFiltros.filter(Boolean).length

  const limpiarFiltros = () => {
    setEstadoState('')
    setOrigenState('')
    setFechaDesdeState('')
    setFechaHastaState('')
    setCantidadMinState('')
    setCantidadMaxState('')
    setPage(1)
  }

  return {
    search,
    setSearch: conReset(setSearchState),
    estadoFilter,
    setEstadoFilter: conReset(setEstadoState),
    origenFilter,
    setOrigenFilter: conReset(setOrigenState),
    fechaDesde,
    setFechaDesde: conReset(setFechaDesdeState),
    fechaHasta,
    setFechaHasta: conReset(setFechaHastaState),
    cantidadMin,
    setCantidadMin: conReset(setCantidadMinState),
    cantidadMax,
    setCantidadMax: conReset(setCantidadMaxState),
    filtrosActivos,
    cantidadFiltrosActivos,
    limpiarFiltros,
    page,
    setPage,
    total: filtered.length,
    paginated,
  }
}
