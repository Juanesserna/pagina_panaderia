import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [rolFiltro, setRolFiltro] = useState('Todos')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  const ejecutando = useRef(false)

  // Cargar los usuarios y sus relaciones actuales.
  useEffect(() => {
    let activo = true

    fetchUsuarios()
      .then((data) => {
        if (!activo) return

        setUsuarios(data)
        setError(null)
      })
      .catch((err) => {
        if (!activo) return

        setError(
          err.message || 'No se pudieron cargar los usuarios.'
        )
      })
      .finally(() => {
        if (activo) setLoading(false)
      })

    return () => {
      activo = false
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
        usuario.tipoPerfil,
      ]

      const coincideBusqueda =
        !term ||
        valoresBusqueda.some((valor) =>
          String(valor ?? '').toLowerCase().includes(term)
        )

      const coincideRol =
        rolFiltro === 'Todos' || usuario.rol === rolFiltro

      const coincideEstado =
        estadoFiltro === 'Todos' ||
        usuario.estado === estadoFiltro

      return coincideBusqueda && coincideRol && coincideEstado
    })
  }, [usuarios, search, rolFiltro, estadoFiltro])

  // Paginación.
  const pageCount = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / PAGE_SIZE)
  )

  const paginaActual = Math.max(1, Math.min(page, pageCount))

  useEffect(() => {
    if (page !== paginaActual) {
      setPage(paginaActual)
    }
  }, [page, paginaActual])

  const usuariosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * PAGE_SIZE

    return usuariosFiltrados.slice(
      inicio,
      inicio + PAGE_SIZE
    )
  }, [usuariosFiltrados, paginaActual])

  // Indicadores calculados sobre todos los usuarios.
  const kpis = useMemo(() => {
    const activos = usuarios.filter(
      (usuario) => usuario.estado === 'Activo'
    ).length

    return {
      total: usuarios.length,
      activos,
      inactivos: usuarios.length - activos,
    }
  }, [usuarios])

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

  const limpiarFiltros = useCallback(() => {
    setRolFiltro('Todos')
    setEstadoFiltro('Todos')
    setPage(1)
  }, [])

  const hayFiltrosActivos =
    rolFiltro !== 'Todos' || estadoFiltro !== 'Todos'

  // Centraliza el control de operaciones y evita envíos duplicados.
  const ejecutarOperacion = useCallback(async (operacion) => {
    if (ejecutando.current) {
      throw new Error('Ya hay una operación en proceso.')
    }

    ejecutando.current = true
    setSubmitting(true)

    try {
      return await operacion()
    } finally {
      ejecutando.current = false
      setSubmitting(false)
    }
  }, [])

  // Crear: agregar al final y mostrar el nuevo registro.
  const agregarUsuario = useCallback(
    (data) =>
      ejecutarOperacion(async () => {
        const nuevo = await createUsuario(data)

        setUsuarios((prev) => [...prev, nuevo])

        setSearch('')
        setRolFiltro('Todos')
        setEstadoFiltro('Todos')

        setPage(
          Math.max(
            1,
            Math.ceil((usuarios.length + 1) / PAGE_SIZE)
          )
        )

        return nuevo
      }),
    [ejecutarOperacion, usuarios.length]
  )

  // Actualiza únicamente el registro modificado.
  const actualizarRegistro = useCallback((actualizado) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === actualizado.id
          ? actualizado
          : usuario
      )
    )

    return actualizado
  }, [])

  // Editar usuario.
  const editarUsuario = useCallback(
    (id, data) =>
      ejecutarOperacion(async () => {
        const actualizado = await updateUsuario(id, data)

        return actualizarRegistro(actualizado)
      }),
    [ejecutarOperacion, actualizarRegistro]
  )

  // Activar o desactivar usuario.
  const cambiarEstado = useCallback(
    (id) =>
      ejecutarOperacion(async () => {
        const actualizado = await toggleEstadoUsuario(id)

        return actualizarRegistro(actualizado)
      }),
    [ejecutarOperacion, actualizarRegistro]
  )

  return {
    usuarios: usuariosPagina,
    totalFiltrados: usuariosFiltrados.length,

    page: paginaActual,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,

    loading,
    submitting,
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
