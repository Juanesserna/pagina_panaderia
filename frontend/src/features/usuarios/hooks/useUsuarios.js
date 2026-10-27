import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  fetchUsuarios,
  createUsuario,
  updateUsuario,
  toggleEstadoUsuario,
  esUnicoGerente,
} from '../services/usuariosService'

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [rolFiltro, setRolFiltro] = useState('Todos')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 6

  useEffect(() => {
    let active = true
    fetchUsuarios().then((data) => {
      if (active) {
        setUsuarios(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const usuariosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()
    return usuarios.filter((u) => {
      const matchTerm =
        !term || u.nombre.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      const matchRol = rolFiltro === 'Todos' || u.rol === rolFiltro
      const matchEstado = estadoFiltro === 'Todos' || u.estado === estadoFiltro
      return matchTerm && matchRol && matchEstado
    })
  }, [usuarios, search, rolFiltro, estadoFiltro])

  // Si una búsqueda o un filtro deja menos páginas de las que había, no te
  // quedes "varado" en una página que ya no existe. Se ajusta durante el
  // render (patrón recomendado por React) en vez de en un useEffect, para
  // evitar el render en cascada que marca react-hooks/set-state-in-effect.
  const pageCount = Math.max(1, Math.ceil(usuariosFiltrados.length / PAGE_SIZE))
  const [prevPageCount, setPrevPageCount] = useState(pageCount)
  if (pageCount !== prevPageCount) {
    setPrevPageCount(pageCount)
    if (page > pageCount) setPage(pageCount)
  }

  const usuariosPagina = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return usuariosFiltrados.slice(start, start + PAGE_SIZE)
  }, [usuariosFiltrados, page])

  const kpis = useMemo(
    () => ({
      activos: usuarios.filter((u) => u.estado === 'Activo').length,
      inactivos: usuarios.filter((u) => u.estado === 'Inactivo').length,
      total: usuarios.length,
    }),
    [usuarios]
  )

  const limpiarFiltros = useCallback(() => {
    setRolFiltro('Todos')
    setEstadoFiltro('Todos')
    setPage(1)
  }, [])

  const hayFiltrosActivos = rolFiltro !== 'Todos' || estadoFiltro !== 'Todos'

  const agregarUsuario = useCallback(async (data) => {
    const nuevo = await createUsuario(data)
    setUsuarios((prev) => [nuevo, ...prev])
  }, [])

  const editarUsuario = useCallback(async (id, data) => {
    const actualizado = await updateUsuario(id, data)
    setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)))
  }, [])

  const cambiarEstado = useCallback(async (id) => {
    const actualizado = await toggleEstadoUsuario(id)
    setUsuarios((prev) => prev.map((u) => (u.id === id ? actualizado : u)))
    return actualizado
  }, [])

  const cambiarBusqueda = useCallback((value) => {
    setSearch(value)
    setPage(1)
  }, [])

  const cambiarRolFiltro = useCallback((value) => {
    setRolFiltro(value)
    setPage(1)
  }, [])

  const cambiarEstadoFiltro = useCallback((value) => {
    setEstadoFiltro(value)
    setPage(1)
  }, [])

  return {
    usuarios: usuariosPagina,
    totalFiltrados: usuariosFiltrados.length,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    kpis,
    search,
    setSearch: cambiarBusqueda,
    rolFiltro,
    setRolFiltro: cambiarRolFiltro,
    estadoFiltro,
    setEstadoFiltro: cambiarEstadoFiltro,
    hayFiltrosActivos,
    limpiarFiltros,
    agregarUsuario,
    editarUsuario,
    cambiarEstado,
    esUnicoGerente,
  }
}