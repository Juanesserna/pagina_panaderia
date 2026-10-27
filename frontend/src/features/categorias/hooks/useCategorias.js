import { useState, useCallback, useMemo } from 'react'
import { categorias as categoriasIniciales } from '../services/categorias.service'
import { FILTRO_TODOS_TIPOS, FILTRO_TODAS_ESTADOS } from '../components/comunes/opcionesCategoria'
import { COLOR_CATEGORIA_NUEVA } from '../constants/coloresCategoria'

let categoriaIdCounter = 0

const filtrosIniciales = {
  tipo: FILTRO_TODOS_TIPOS,
  estado: FILTRO_TODAS_ESTADOS,
}

const crearId = () => {
  const cryptoApi = globalThis.crypto
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID()
  }
  categoriaIdCounter += 1
  return `categoria-${Date.now()}-${categoriaIdCounter}`
}

export function useCategorias() {
  const [categorias, setCategorias] = useState(() =>
    categoriasIniciales.map((categoria) => ({ ...categoria }))
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [filtros, setFiltros] = useState(() => ({ ...filtrosIniciales }))
  const [paginaActual, setPaginaActual] = useState(1)
  const [porPagina] = useState(8)

  const filteredCategorias = useMemo(() => {
    const busqueda = searchTerm.trim().toLowerCase()
    return categorias.filter((categoria) => {
      const coincideBusqueda =
        !busqueda || categoria.nombre.toLowerCase().includes(busqueda)
      const coincideTipo =
        filtros.tipo === filtrosIniciales.tipo || categoria.tipo === filtros.tipo
      const coincideEstado =
        filtros.estado === filtrosIniciales.estado ||
        categoria.estado === filtros.estado

      return coincideBusqueda && coincideTipo && coincideEstado
    })
  }, [categorias, searchTerm, filtros])

  const totalRegistros = filteredCategorias.length
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / porPagina))
  const paginaVisible = Math.min(paginaActual, totalPaginas)

  const paginatedCategorias = useMemo(() => {
    const inicio = (paginaVisible - 1) * porPagina
    return filteredCategorias.slice(inicio, inicio + porPagina)
  }, [filteredCategorias, paginaVisible, porPagina])

  const handleSearch = useCallback((evento) => {
    setSearchTerm(evento.target.value)
    setPaginaActual(1)
  }, [])

  const aplicarFiltros = useCallback((nuevosFiltros) => {
    setFiltros({
      tipo: nuevosFiltros.tipo,
      estado: nuevosFiltros.estado,
    })
    setPaginaActual(1)
  }, [])

  const limpiarFiltros = useCallback(() => {
    setFiltros({ ...filtrosIniciales })
    setPaginaActual(1)
  }, [])

  const handlePageChange = useCallback((nuevaPagina) => {
    setPaginaActual(nuevaPagina)
  }, [])

  const crear = useCallback((nuevaCategoria) => {
    const categoria = {
      id: crearId(),
      color: COLOR_CATEGORIA_NUEVA,
      productosCount: 0,
      insumosCount: 0,
      ...nuevaCategoria,
      creada: new Date().toLocaleDateString('es-CO'),
    }
    setCategorias((prev) => [categoria, ...prev])
    setSearchTerm('')
    setFiltros({ ...filtrosIniciales })
    setPaginaActual(1)
  }, [])

  const editar = useCallback((id, cambios) => {
    setCategorias((prev) =>
      prev.map((categoria) =>
        categoria.id === id ? { ...categoria, ...cambios } : categoria
      )
    )
  }, [])

  const eliminar = useCallback((id) => {
    setCategorias((prev) => prev.filter((categoria) => categoria.id !== id))
  }, [])

  return {
    categorias: paginatedCategorias,
    allCategorias: categorias,
    searchTerm,
    handleSearch,
    filtros,
    aplicarFiltros,
    limpiarFiltros,
    paginaActual: paginaVisible,
    totalPaginas,
    totalRegistros,
    porPagina,
    handlePageChange,
    crear,
    editar,
    eliminar,
  }
}