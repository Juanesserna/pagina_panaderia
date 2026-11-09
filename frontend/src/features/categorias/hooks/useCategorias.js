import { useCallback, useMemo, useState } from 'react'
import { useCategoriasContext } from '../context/useCategoriasContext'
import { FILTRO_TODOS_TIPOS, FILTRO_TODAS_ESTADOS } from '../components/comunes/opcionesCategoria'

const filtrosIniciales = {
  tipo: FILTRO_TODOS_TIPOS,
  estado: FILTRO_TODAS_ESTADOS,
}

export function useCategorias() {
  const { categorias: todas, crear: crearContexto, editar: editarContexto, eliminar: eliminarContexto } =
    useCategoriasContext()

  const [searchTerm, setSearchTerm] = useState('')
  const [filtros, setFiltros] = useState(() => ({ ...filtrosIniciales }))
  const [paginaActual, setPaginaActual] = useState(1)
  const [porPagina] = useState(8)

  const filteredCategorias = useMemo(() => {
    const busqueda = searchTerm.trim().toLowerCase()
    const resultado = todas.filter((categoria) => {
      const coincideBusqueda =
        !busqueda || categoria.nombre.toLowerCase().includes(busqueda)
      const coincideTipo =
        filtros.tipo === filtrosIniciales.tipo || categoria.tipo === filtros.tipo
      const coincideEstado =
        filtros.estado === filtrosIniciales.estado ||
        categoria.estado === filtros.estado

      return coincideBusqueda && coincideTipo && coincideEstado
    })
    // Orden alfabético por nombre sobre una copia (no mutar el estado)
    return [...resultado].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    )
  }, [todas, searchTerm, filtros])

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
    setSearchTerm('')
    setPaginaActual(1)
  }, [])

  const handlePageChange = useCallback((nuevaPagina) => {
    setPaginaActual(nuevaPagina)
  }, [])

  const crear = useCallback(
    (nuevaCategoria) => {
      crearContexto(nuevaCategoria)
      setSearchTerm('')
      setFiltros({ ...filtrosIniciales })
      setPaginaActual(1)
    },
    [crearContexto]
  )

  const editar = useCallback((id, cambios) => {
    editarContexto(id, cambios)
  }, [editarContexto])

  const eliminar = useCallback((id) => {
    eliminarContexto(id)
  }, [eliminarContexto])

  return {
    categorias: paginatedCategorias,
    allCategorias: todas,
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
