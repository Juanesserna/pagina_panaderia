import { useState, useCallback } from 'react'
import { categorias as mockCategorias } from '../services/categorias.service'

export function useCategorias() {
  const [categorias, setCategorias] = useState(mockCategorias)
  const [searchTerm, setSearchTerm] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [porPagina] = useState(8)

  const filteredCategorias = categorias.filter((c) => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalRegistros = filteredCategorias.length
  const totalPaginas = Math.ceil(totalRegistros / porPagina)

  const paginatedCategorias = filteredCategorias.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  )

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value)
    setPaginaActual(1)
  }, [])

  const handlePageChange = useCallback((nuevaPagina) => {
    setPaginaActual(nuevaPagina)
  }, [])

  const toggleEstado = useCallback((id) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, estado: c.estado === 'Activa' ? 'Inactiva' : 'Activa' } : c
      )
    )
  }, [])

  const eliminarCategoria = useCallback((id) => {
    setCategorias((prev) => prev.filter((c) => c.id !== id))
    if (paginaActual > 1 && (paginaActual - 1) * porPagina >= totalRegistros - 1) {
      setPaginaActual((prev) => prev - 1)
    }
  }, [paginaActual, porPagina, totalRegistros])

  const editarCategoria = useCallback((id, datosActualizados) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...datosActualizados } : c
      )
    )
  }, [])

  return {
    categorias: paginatedCategorias,
    allCategorias: categorias,
    searchTerm,
    handleSearch,
    paginaActual,
    totalPaginas,
    totalRegistros,
    porPagina,
    handlePageChange,
    toggleEstado,
    eliminarCategoria,
    editarCategoria,
  }
}