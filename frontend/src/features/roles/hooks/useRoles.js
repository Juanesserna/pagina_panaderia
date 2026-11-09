import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  fetchRoles,
  createRole,
  updateRole,
  toggleEstadoRole,
  deleteRole,
  esEliminable,
} from '../services/rolesService'

export default function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 10

  useEffect(() => {
    let active = true

    fetchRoles()
      .then((data) => {
        if (active) setRoles(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const rolesFiltrados = useMemo(() => {
  const term = search.trim().toLowerCase()

  if (!term) return roles

  return roles.filter((rol) => {
    const estado = String(rol.estado ?? '').trim().toLowerCase()

    if (term === 'activo' || term === 'inactivo') {
      return estado === term
    }

    return (
      String(rol.id).includes(term) ||
      String(rol.nombre ?? '').toLowerCase().includes(term)
    )
  })
}, [roles, search])

  const pageCount = Math.max(
    1,
    Math.ceil(rolesFiltrados.length / PAGE_SIZE)
  )

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const rolesPagina = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return rolesFiltrados.slice(start, start + PAGE_SIZE)
  }, [rolesFiltrados, page])

  const kpis = useMemo(() => ({
    total: roles.length,
    activos: roles.filter((rol) => rol.estado === 'Activo').length,
  }), [roles])

  const agregarRol = useCallback(async (data) => {
    const nuevo = await createRole(data)
    setRoles((prev) => [...prev, nuevo])
    return nuevo
  }, [])

  const editarRol = useCallback(async (id, data) => {
    const actualizado = await updateRole(id, data)

    if (!actualizado) throw new Error('No se encontró el rol.')

    setRoles((prev) =>
      prev.map((rol) => rol.id === id ? actualizado : rol)
    )

    return actualizado
  }, [])

  const cambiarEstado = useCallback(async (id) => {
    const actualizado = await toggleEstadoRole(id)

    if (!actualizado) throw new Error('No se encontró el rol.')

    setRoles((prev) =>
      prev.map((rol) => rol.id === id ? actualizado : rol)
    )

    return actualizado
  }, [])

  const eliminarRol = useCallback(async (id) => {
    await deleteRole(id)
    setRoles((prev) => prev.filter((rol) => rol.id !== id))
  }, [])

  const cambiarBusqueda = useCallback((value) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    roles: rolesPagina,
    totalFiltrados: rolesFiltrados.length,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    kpis,
    search,
    setSearch: cambiarBusqueda,
    agregarRol,
    editarRol,
    cambiarEstado,
    eliminarRol,
    esEliminable,
  }
}
