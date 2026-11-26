import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
} from '../services/empleadosService'

const PAGE_SIZE = 6

// Búsqueda sin distinguir mayúsculas ni tildes.
const normalizar = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export default function useEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [tipoDocumentoFiltro, setTipoDocumentoFiltro] = useState('Todos')
  const [cuentaFiltro, setCuentaFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  const enviando = useRef(false)

  // Cargar empleados y sus cuentas vinculadas.
  const cargarEmpleados = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setEmpleados(await fetchEmpleados())
    } catch (err) {
      setError(err.message || 'No fue posible cargar los empleados.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarEmpleados()
  }, [cargarEmpleados])

  // Indicadores generales, independientes de los filtros.
  const estadisticas = useMemo(() => {
    const conCuenta = empleados.filter(
      empleado => empleado.id_usuario != null
    ).length

    return {
      total: empleados.length,
      conCuenta,
      sinCuenta: empleados.length - conCuenta,
    }
  }, [empleados])

  // Búsqueda y filtros combinados.
  const empleadosFiltrados = useMemo(() => {
    const termino = normalizar(search)

    return empleados.filter(empleado => {
      const coincideBusqueda =
        !termino ||
        normalizar(empleado.nombre).includes(termino) ||
        normalizar(empleado.documento).includes(termino) ||
        normalizar(empleado.telefono).includes(termino)

      const coincideTipo =
        tipoDocumentoFiltro === 'Todos' ||
        empleado.tipoDocumento === tipoDocumentoFiltro

      const coincideCuenta =
        cuentaFiltro === 'Todos' ||
        (cuentaFiltro === 'Con cuenta' &&
          empleado.id_usuario != null) ||
        (cuentaFiltro === 'Sin cuenta' &&
          empleado.id_usuario == null)

      return coincideBusqueda && coincideTipo && coincideCuenta
    })
  }, [empleados, search, tipoDocumentoFiltro, cuentaFiltro])

  // Paginación.
  const totalEmpleados = empleadosFiltrados.length

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalEmpleados / PAGE_SIZE)
  )

  const paginaActual = Math.max(
    1,
    Math.min(page, totalPaginas)
  )

  const empleadosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * PAGE_SIZE

    return empleadosFiltrados.slice(inicio, inicio + PAGE_SIZE)
  }, [empleadosFiltrados, paginaActual])

  useEffect(() => {
    if (page !== paginaActual) {
      setPage(paginaActual)
    }
  }, [page, paginaActual])

  function cambiarBusqueda(valor) {
    setSearch(valor)
    setPage(1)
  }

  function cambiarFiltroDocumento(valor) {
    setTipoDocumentoFiltro(valor)
    setPage(1)
  }

  function cambiarFiltroCuenta(valor) {
    setCuentaFiltro(valor)
    setPage(1)
  }

  function limpiarFiltros() {
    setSearch('')
    setTipoDocumentoFiltro('Todos')
    setCuentaFiltro('Todos')
    setPage(1)
  }

  const hayFiltrosActivos =
    search.trim() !== '' ||
    tipoDocumentoFiltro !== 'Todos' ||
    cuentaFiltro !== 'Todos'

  // Centraliza el guardado y evita operaciones duplicadas.
  async function ejecutarOperacion(operacion) {
    if (enviando.current) {
      throw new Error('Ya hay una operación en proceso.')
    }

    enviando.current = true
    setSubmitting(true)

    try {
      return await operacion()
    } finally {
      enviando.current = false
      setSubmitting(false)
    }
  }

  // Registrar al final del listado.
  function registrarEmpleado(data) {
    return ejecutarOperacion(async () => {
      const nuevo = await createEmpleado(data)

      setEmpleados(prev => [...prev, nuevo])

      limpiarFiltros()
      setPage(Math.ceil((empleados.length + 1) / PAGE_SIZE))

      return nuevo
    })
  }

  // Actualizar únicamente el empleado seleccionado.
  function actualizarEmpleado(id, data) {
    return ejecutarOperacion(async () => {
      const actualizado = await updateEmpleado(id, data)

      setEmpleados(prev =>
        prev.map(empleado =>
          empleado.id === id ? actualizado : empleado
        )
      )

      return actualizado
    })
  }

  return {
    empleados,
    empleadosFiltrados,
    empleadosPaginados,
    estadisticas,

    loading,
    submitting,
    error,

    search,
    setSearch: cambiarBusqueda,

    tipoDocumentoFiltro,
    setTipoDocumentoFiltro: cambiarFiltroDocumento,

    cuentaFiltro,
    setCuentaFiltro: cambiarFiltroCuenta,

    hayFiltrosActivos,
    limpiarFiltros,

    page: paginaActual,
    setPage,
    pageSize: PAGE_SIZE,
    totalPaginas,
    totalEmpleados,

    cargarEmpleados,
    registrarEmpleado,
    actualizarEmpleado,
  }
}
