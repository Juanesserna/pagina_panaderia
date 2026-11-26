import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import {
  fetchRoles,
  createRole,
  updateRole,
  toggleEstadoRole,
  deleteRole,
  esRolSistema,
  esEliminable,
  esDesactivable,
} from '../services/rolesService'

const PAGE_SIZE = 6

export default function useRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const bloqueo = useRef(false)

  // Consulta inicial y actualización de los roles.
  const cargarRoles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchRoles()
      setRoles(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los roles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarRoles()
  }, [cargarRoles])

  // Búsqueda por ID, nombre o estado.
  const rolesFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return roles

    return roles.filter((rol) => {
      if (term === 'activo' || term === 'inactivo') {
        return rol.estado.toLowerCase() === term
      }

      return (
        String(rol.id).includes(term) ||
        rol.nombre.toLowerCase().includes(term)
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

  // Centraliza el bloqueo de operaciones simultáneas.
  const ejecutarAccion = useCallback(async (accion) => {
    if (bloqueo.current) {
      throw new Error('Ya hay una operación en curso.')
    }

    bloqueo.current = true
    setSubmitting(true)

    try {
      return await accion()
    } finally {
      bloqueo.current = false
      setSubmitting(false)
    }
  }, [])

  // Agrega el nuevo rol al final del listado.
  const agregarRol = (data) => ejecutarAccion(async () => {
    const nuevo = await createRole(data)

    setRoles((prev) => [...prev, nuevo])
    setSearch('')
    setPage(Math.ceil((roles.length + 1) / PAGE_SIZE))

    return nuevo
  })

  // Actualiza únicamente el rol seleccionado.
  const editarRol = (id, data) => ejecutarAccion(async () => {
    const actualizado = await updateRole(id, data)

    setRoles((prev) =>
      prev.map((rol) =>
        rol.id === actualizado.id ? actualizado : rol
      )
    )

    return actualizado
  })

  // Activa o desactiva un rol personalizado.
  const cambiarEstado = (id) => ejecutarAccion(async () => {
    const actualizado = await toggleEstadoRole(id)

    setRoles((prev) =>
      prev.map((rol) =>
        rol.id === actualizado.id ? actualizado : rol
      )
    )

    return actualizado
  })

  // Elimina un rol que cumple las restricciones del servicio.
  const eliminarRol = (id) => ejecutarAccion(async () => {
    await deleteRole(id)

    setRoles((prev) =>
      prev.filter((rol) => rol.id !== Number(id))
    )
  })

  const cambiarBusqueda = (value) => {
    setSearch(value)
    setPage(1)
  }

  return {
    roles: rolesPagina,
    totalFiltrados: rolesFiltrados.length,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    submitting,
    error,
    kpis,
    search,
    setSearch: cambiarBusqueda,
    cargarRoles,
    agregarRol,
    editarRol,
    cambiarEstado,
    eliminarRol,
    esRolSistema,
    esEliminable,
    esDesactivable,
  }
}
