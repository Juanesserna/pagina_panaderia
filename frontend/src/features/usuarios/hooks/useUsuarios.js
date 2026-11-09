import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'

import {
  fetchUsuarios,
  createUsuario,
  updateUsuario,
  toggleEstadoUsuario,
  esUnicoGerente,
} from '../services/usuariosService'

const PAGE_SIZE = 6

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [rolFiltro, setRolFiltro] = useState('Todos')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  // Cargar usuarios.
  useEffect(() => {
    let active = true

    const cargarUsuarios = async () => {
      try {
        const data = await fetchUsuarios()

        if (active) {
          setUsuarios(data)
          setError(null)
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'No se pudieron cargar los usuarios.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    cargarUsuarios()

    return () => {
      active = false
    }
  }, [])

  // Búsqueda y filtros.
  const usuariosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()

    return usuarios.filter((usuario) => {
      const valoresBusqueda = [
        usuario.nombre,
        usuario.email,
        usuario.rol,
        usuario.documento,
        usuario.telefono,
        usuario.cliente?.nombre,
        usuario.cliente?.documento,
        usuario.empleado?.nombre,
        usuario.empleado?.documento,
      ]

      const coincideBusqueda =
        !term ||
        valoresBusqueda.some((valor) =>
          String(valor ?? '').toLowerCase().includes(term)
        )

      const coincideRol =
        rolFiltro === 'Todos' || usuario.rol === rolFiltro

      const coincideEstado =
        estadoFiltro === 'Todos' || usuario.estado === estadoFiltro

      return coincideBusqueda && coincideRol && coincideEstado
    })
  }, [usuarios, search, rolFiltro, estadoFiltro])

  // Paginación.
  const pageCount = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / PAGE_SIZE)
  )

  // Corregir la página cuando los filtros reducen los resultados.
  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const paginaActual = Math.min(page, pageCount)

  const usuariosPagina = useMemo(() => {
    const start = (paginaActual - 1) * PAGE_SIZE

    return usuariosFiltrados.slice(start, start + PAGE_SIZE)
  }, [usuariosFiltrados, paginaActual])

  // Indicadores generales.
  const kpis = useMemo(
    () => ({
      activos: usuarios.filter(
        (usuario) => usuario.estado === 'Activo'
      ).length,

      inactivos: usuarios.filter(
        (usuario) => usuario.estado === 'Inactivo'
      ).length,

      total: usuarios.length,
    }),
    [usuarios]
  )

  // Búsqueda.
  const cambiarBusqueda = useCallback((value) => {
    setSearch(value)
    setPage(1)
  }, [])

  // Filtro por rol.
  const cambiarRolFiltro = useCallback((value) => {
    setRolFiltro(value)
    setPage(1)
  }, [])

  // Filtro por estado.
  const cambiarEstadoFiltro = useCallback((value) => {
    setEstadoFiltro(value)
    setPage(1)
  }, [])

  // Limpiar filtros.
  const limpiarFiltros = useCallback(() => {
    setRolFiltro('Todos')
    setEstadoFiltro('Todos')
    setPage(1)
  }, [])

  const hayFiltrosActivos =
    rolFiltro !== 'Todos' || estadoFiltro !== 'Todos'

  // Crear usuario: agregar al final y mostrar la última página.
  const agregarUsuario = useCallback(
    async (data) => {
      const nuevo = await createUsuario(data)
      const actualizados = [...usuarios, nuevo]

      setUsuarios(actualizados)

      // Limpiar búsqueda y filtros para que el nuevo registro sea visible.
      setSearch('')
      setRolFiltro('Todos')
      setEstadoFiltro('Todos')

      setPage(
        Math.max(1, Math.ceil(actualizados.length / PAGE_SIZE))
      )

      return nuevo
    },
    [usuarios]
  )

  // Editar usuario.
  const editarUsuario = useCallback(async (id, data) => {
    const actualizado = await updateUsuario(id, data)

    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id ? actualizado : usuario
      )
    )

    return actualizado
  }, [])

  // Cambiar estado.
  const cambiarEstado = useCallback(async (id) => {
    const actualizado = await toggleEstadoUsuario(id)

    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id ? actualizado : usuario
      )
    )

    return actualizado
  }, [])

  return {
    usuarios: usuariosPagina,
    totalFiltrados: usuariosFiltrados.length,
    page: paginaActual,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    loading,
    error,
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